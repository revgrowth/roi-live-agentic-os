"""Prove the package cannot send, mutate ClickUp, or turn the gate on by itself."""

from __future__ import annotations

import ast
import io
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

import jev_dispatcher
from jev_dispatcher.cli import main as cli_main
from jev_dispatcher.safety import ALLOWED_ACTIONS, FORBIDDEN_ACTIONS, refuse_mutation


BANNED = (
    "clickup",
    "smtplib",
    "urlopen",
    "subprocess",
    "os.system",
    "write_enabled_on",
    "send_message",
    "gmail",
)


class SafetyTests(unittest.TestCase):
    def test_source_has_no_send_or_mutation_path(self) -> None:
        root = Path(jev_dispatcher.__file__).resolve().parent
        offenders: list[str] = []
        for path in sorted(root.glob("*.py")):
            source = path.read_text(encoding="utf-8")
            # safety.py is the denylist. It names the actions it refuses.
            if path.name != "safety.py":
                lowered = source.lower()
                for word in BANNED:
                    if word in lowered:
                        offenders.append(f"{path.name}:{word}")
            tree = ast.parse(source)
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    if node.name in FORBIDDEN_ACTIONS:
                        offenders.append(f"{path.name}:def {node.name}")
        self.assertEqual(offenders, [])

    def test_refuse_mutation_blocks_send_and_execute(self) -> None:
        for action in ("send", "execute", "clickup_mutate", "email", "publish"):
            with self.assertRaises(RuntimeError):
                refuse_mutation(action)
        for action in ALLOWED_ACTIONS:
            self.assertEqual(refuse_mutation(action), action)

    def test_cli_has_no_send_flag(self) -> None:
        stdout = io.StringIO()
        stderr = io.StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            with self.assertRaises(SystemExit):
                cli_main(["--root", "x", "--send"])
        self.assertNotIn("TYPESAFE_API_KEY", stdout.getvalue() + stderr.getvalue())

    def test_package_does_not_ship_an_on_gate(self) -> None:
        skill = Path(jev_dispatcher.__file__).resolve().parents[1]
        self.assertFalse((skill / "ENABLED.on").exists())
        repo = skill.parents[2]
        project = repo / "clients" / "roi-live" / "projects" / "jev-dispatcher-2026-09"
        if project.exists():
            self.assertFalse((project / "ENABLED.on").exists())


if __name__ == "__main__":
    unittest.main()
