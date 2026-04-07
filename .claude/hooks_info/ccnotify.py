#!/usr/bin/env python3
"""
Claude Code Notify
https://github.com/dazuiba/CCNotify
"""

import json
import logging
import os
import platform
import sqlite3
import subprocess
import sys
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler


class ClaudePromptTracker:
    def __init__(self):
        """Initialize the prompt tracker with database and paths."""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.script_dir = script_dir
        self.project_dir = os.path.dirname(os.path.dirname(script_dir))
        self.db_path = os.path.join(script_dir, "ccnotify.db")
        self.windows_notify_script = os.path.join(
            self.project_dir, "scripts", "windows-notify.ps1"
        )
        self.setup_logging()
        self.init_database()

    def setup_logging(self):
        """Setup logging to file with daily rotation."""
        log_path = os.path.join(self.script_dir, "ccnotify.log")

        handler = TimedRotatingFileHandler(
            log_path,
            when="midnight",
            interval=1,
            backupCount=1,
            encoding="utf-8",
        )

        formatter = logging.Formatter(
            "%(asctime)s - %(levelname)s - %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)

        logger = logging.getLogger()
        logger.setLevel(logging.INFO)
        if not logger.handlers:
            logger.addHandler(handler)

    def init_database(self):
        """Create tables and triggers if they don't exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS prompt (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    prompt TEXT,
                    cwd TEXT,
                    seq INTEGER,
                    stoped_at DATETIME,
                    lastWaitUserAt DATETIME
                )
            """
            )

            conn.execute(
                """
                CREATE TRIGGER IF NOT EXISTS auto_increment_seq
                AFTER INSERT ON prompt
                FOR EACH ROW
                BEGIN
                    UPDATE prompt
                    SET seq = (
                        SELECT COALESCE(MAX(seq), 0) + 1
                        FROM prompt
                        WHERE session_id = NEW.session_id
                    )
                    WHERE id = NEW.id;
                END
            """
            )

            conn.commit()

    def handle_user_prompt_submit(self, data):
        """Handle UserPromptSubmit event by inserting a new prompt row."""
        session_id = data.get("session_id")
        prompt = data.get("prompt", "")
        cwd = data.get("cwd", "")

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT INTO prompt (session_id, prompt, cwd)
                VALUES (?, ?, ?)
            """,
                (session_id, prompt, cwd),
            )
            conn.commit()

        logging.info("Recorded prompt for session %s", session_id)

    def handle_stop(self, data):
        """Handle Stop event by closing the latest prompt and notifying."""
        session_id = data.get("session_id")
        record = self.get_latest_prompt_record(session_id, unfinished_only=True)
        if not record:
            logging.info("Stop received for session %s with no unfinished prompt", session_id)
            return

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                UPDATE prompt
                SET stoped_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """,
                (record["id"],),
            )
            conn.commit()

        duration = self.calculate_duration_from_db(record["id"])
        seq = record["seq"] or 1
        project_label = self.project_label(record.get("cwd"))
        if duration == "Unknown":
            body = f"Job #{seq} finished."
        else:
            body = f"Job #{seq} finished in {duration}."

        self.send_notification(
            title=project_label,
            subtitle="Task complete",
            message=body,
            variant="success",
            duration="short",
        )

        logging.info(
            "Task completed for session %s, job#%s, duration: %s",
            session_id,
            seq,
            duration,
        )

    def handle_notification(self, data):
        """Handle Notification event with Windows-aware dedupe and mapping."""
        session_id = data.get("session_id")
        raw_message = data.get("message", "")
        message = self.normalize_message(raw_message)
        record = self.get_latest_prompt_record(session_id)
        cwd = data.get("cwd") or (record.get("cwd") if record else "")

        logging.info("[NOTIFICATION] session=%s, message='%s'", session_id, message)

        message_lower = message.lower()
        subtitle = "Notification"
        body = message or "Claude sent an update."
        variant = "info"
        duration = "short"

        if "waiting for your input" in message_lower or "waiting for input" in message_lower:
            if not self.mark_wait_notification(session_id):
                logging.info(
                    "Duplicate waiting notification suppressed for session %s",
                    session_id,
                )
                return
            subtitle = "Waiting for input"
            body = "Claude is paused until you reply."
            variant = "info"
            duration = "long"
        elif "permission" in message_lower:
            subtitle = "Permission required"
            variant = "warning"
            duration = "long"
        elif "approval" in message_lower or "choose an option" in message_lower:
            subtitle = "Action required"
            variant = "warning"
            duration = "long"

        self.send_notification(
            title=self.project_label(cwd),
            subtitle=subtitle,
            message=body,
            variant=variant,
            duration=duration,
        )

        logging.info(
            "Notification processed for session %s: %s (%s)",
            session_id,
            subtitle,
            variant,
        )

    def get_latest_prompt_record(self, session_id, unfinished_only=False):
        """Return the latest prompt row for a session."""
        query = """
            SELECT id, created_at, prompt, cwd, seq, stoped_at, lastWaitUserAt
            FROM prompt
            WHERE session_id = ?
        """
        if unfinished_only:
            query += " AND stoped_at IS NULL"
        query += " ORDER BY created_at DESC LIMIT 1"

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query, (session_id,))
            row = cursor.fetchone()

        if not row:
            return None

        return {
            "id": row[0],
            "created_at": row[1],
            "prompt": row[2],
            "cwd": row[3],
            "seq": row[4],
            "stoped_at": row[5],
            "lastWaitUserAt": row[6],
        }

    def mark_wait_notification(self, session_id):
        """Mark the current prompt as waiting. Returns False if already marked."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """
                UPDATE prompt
                SET lastWaitUserAt = CURRENT_TIMESTAMP
                WHERE id = (
                    SELECT id
                    FROM prompt
                    WHERE session_id = ? AND stoped_at IS NULL
                    ORDER BY created_at DESC
                    LIMIT 1
                )
                AND lastWaitUserAt IS NULL
            """,
                (session_id,),
            )
            conn.commit()
            return cursor.rowcount > 0

    def calculate_duration_from_db(self, record_id):
        """Calculate duration for a completed record."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """
                SELECT created_at, stoped_at
                FROM prompt
                WHERE id = ?
            """,
                (record_id,),
            )
            row = cursor.fetchone()

        if row and row[1]:
            return self.calculate_duration(row[0], row[1])

        return "Unknown"

    def calculate_duration(self, start_time, end_time):
        """Calculate human-readable duration between two timestamps."""
        try:
            if isinstance(start_time, str):
                start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
            else:
                start_dt = datetime.fromisoformat(start_time)

            if isinstance(end_time, str):
                end_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
            else:
                end_dt = datetime.fromisoformat(end_time)

            duration = end_dt - start_dt
            total_seconds = int(duration.total_seconds())

            if total_seconds < 60:
                return f"{total_seconds}s"
            if total_seconds < 3600:
                minutes = total_seconds // 60
                seconds = total_seconds % 60
                return f"{minutes}m{seconds}s" if seconds > 0 else f"{minutes}m"

            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            return f"{hours}h{minutes}m" if minutes > 0 else f"{hours}h"
        except Exception as error:
            logging.error("Error calculating duration: %s", error)
            return "Unknown"

    def send_notification(self, title, subtitle, message, variant="info", duration="short"):
        """Send a native notification and log the real delivery channel."""
        system = platform.system()

        try:
            if system == "Darwin":
                self._notify_macos(title, subtitle, message)
                logging.info("Notification sent: %s - %s", title, subtitle)
                return

            if system == "Windows":
                result = self._notify_windows(title, subtitle, message, variant, duration)
                delivery = result.get("delivery", "unknown")
                if delivery != "toast":
                    logging.warning(
                        "Windows notification used %s fallback for %s - %s: %s",
                        delivery,
                        title,
                        subtitle,
                        result.get("toast_error", "unknown toast error"),
                    )
                logging.info(
                    "Notification sent: %s - %s via %s",
                    title,
                    subtitle,
                    delivery,
                )
                return

            logging.warning("Notifications not supported on %s", system)
        except Exception as error:
            logging.error("Error sending notification: %s", error)

    def _notify_macos(self, title, subtitle, message):
        """Send notification via osascript (built into macOS)."""
        script = (
            f'display notification "{self.escape_applescript(message)}" '
            f'with title "{self.escape_applescript(title)}" '
            f'subtitle "{self.escape_applescript(subtitle)}" '
            f'sound name "default"'
        )
        result = subprocess.run(
            ["osascript", "-e", script],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or "osascript failed")

    def _notify_windows(self, title, subtitle, message, variant, duration):
        """Send a Windows notification through the shared PowerShell helper."""
        if not os.path.exists(self.windows_notify_script):
            raise FileNotFoundError(
                f"windows-notify.ps1 not found at {self.windows_notify_script}"
            )

        command = [
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            self.windows_notify_script,
            "-Variant",
            variant,
            "-Title",
            title,
            "-Subtitle",
            subtitle,
            "-Message",
            message,
            "-Attribution",
            "Agentic OS",
            "-Duration",
            duration,
        ]

        result = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
        )

        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        if result.returncode != 0:
            raise RuntimeError(
                f"windows-notify exited {result.returncode}: {stderr or stdout or 'no output'}"
            )

        parsed = {}
        if stdout:
            try:
                parsed = json.loads(stdout)
            except json.JSONDecodeError:
                parsed = {"ok": True, "delivery": "unknown", "raw_stdout": stdout}

        if stderr:
            logging.warning("windows-notify stderr: %s", stderr)

        return parsed

    @staticmethod
    def project_label(cwd):
        """Build the first-line title from the current project/worktree name."""
        if not cwd:
            return "Claude Task"
        return os.path.basename(os.path.normpath(cwd)) or "Claude Task"

    @staticmethod
    def normalize_message(message):
        """Collapse whitespace so notification bodies stay compact."""
        return " ".join((message or "").split()).strip()

    @staticmethod
    def escape_applescript(value):
        """Escape text for inline AppleScript strings."""
        return (value or "").replace("\\", "\\\\").replace('"', '\\"')


def validate_input_data(data, expected_event_name):
    """Validate input data matches design specification."""
    required_fields = {
        "UserPromptSubmit": ["session_id", "prompt", "cwd", "hook_event_name"],
        "Stop": ["session_id", "hook_event_name"],
        "Notification": ["session_id", "message", "hook_event_name"],
    }

    if expected_event_name not in required_fields:
        raise ValueError(f"Unknown event type: {expected_event_name}")

    if data.get("hook_event_name") != expected_event_name:
        raise ValueError(
            f"Event name mismatch: expected {expected_event_name}, got {data.get('hook_event_name')}"
        )

    missing_fields = []
    for field in required_fields[expected_event_name]:
        if field not in data or data[field] is None:
            missing_fields.append(field)

    if missing_fields:
        raise ValueError(
            f"Missing required fields for {expected_event_name}: {missing_fields}"
        )

    return True


def main():
    """Main entry point - read JSON from stdin and process event."""
    try:
        if len(sys.argv) < 2:
            print("ok")
            return

        expected_event_name = sys.argv[1]
        valid_events = ["UserPromptSubmit", "Stop", "Notification"]

        if expected_event_name not in valid_events:
            logging.error("Invalid hook type: %s", expected_event_name)
            logging.error("Valid hook types: %s", ", ".join(valid_events))
            sys.exit(1)

        input_data = sys.stdin.read().strip()
        if not input_data:
            logging.warning("No input data received")
            return

        data = json.loads(input_data)
        validate_input_data(data, expected_event_name)

        tracker = ClaudePromptTracker()

        if expected_event_name == "UserPromptSubmit":
            tracker.handle_user_prompt_submit(data)
        elif expected_event_name == "Stop":
            tracker.handle_stop(data)
        elif expected_event_name == "Notification":
            tracker.handle_notification(data)

    except json.JSONDecodeError as error:
        logging.error("JSON decode error: %s", error)
        sys.exit(1)
    except ValueError as error:
        logging.error("Validation error: %s", error)
        sys.exit(1)
    except Exception as error:
        logging.error("Unexpected error: %s", error)
        sys.exit(1)


if __name__ == "__main__":
    main()
