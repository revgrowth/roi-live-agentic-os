#!/usr/bin/env python3
"""
Interactive skill selector with checkbox-style UI.
Called by start-here after brand context is built.

Usage:
    python3 scripts/select-skills.py [--catalog PATH] [--skills-dir PATH] [--business-context "description"]

Navigation:
    ↑/↓ or j/k  — move cursor
    Space        — toggle skill on/off
    a            — select all
    n            — select none
    Enter        — confirm selection

Outputs JSON to stdout with selected/removed skill lists.
Writes installed.json and removes unselected skill folders.
"""

import json
import os
import shutil
import sys
import tty
import termios
import datetime
import argparse

# ---------- Colors ----------
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
CYAN = "\033[0;36m"
RED = "\033[0;31m"
BOLD = "\033[1m"
DIM = "\033[2m"
NC = "\033[0m"
INVERSE = "\033[7m"


def get_key():
    """Read a single keypress, handling arrow key escape sequences."""
    fd = sys.stdin.fileno()
    old = termios.tcgetattr(fd)
    try:
        tty.setraw(fd)
        ch = sys.stdin.read(1)
        if ch == "\x1b":
            ch2 = sys.stdin.read(1)
            if ch2 == "[":
                ch3 = sys.stdin.read(1)
                if ch3 == "A":
                    return "up"
                elif ch3 == "B":
                    return "down"
                return None
            return None
        return ch
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old)


def render(skills, selected, cursor, category_rows):
    """Render the skill menu. Returns list of lines for calculating screen clearing."""
    lines = []
    lines.append("")
    lines.append(f"{CYAN}{BOLD}  Choose your skills{NC}")
    lines.append(f"{DIM}  ↑/↓ navigate • Space toggle • a all • n none • Enter confirm{NC}")
    lines.append("")

    skill_index = 0
    for row in category_rows:
        if row["type"] == "header":
            lines.append(f"  {BOLD}{row['label']}{NC}")
        elif row["type"] == "skill":
            idx = row["index"]
            skill = skills[idx]
            is_cursor = idx == cursor
            is_selected = selected[idx]

            checkbox = f"{GREEN}■{NC}" if is_selected else "□"
            name = skill["name"]
            desc = skill["description"]
            svc = ""
            if skill.get("services"):
                svc = f" {DIM}(needs {', '.join(skill['services'])}){NC}"

            if is_cursor:
                lines.append(f"  {INVERSE} {checkbox} {name:<28}{NC} {DIM}{desc}{NC}{svc}")
            else:
                lines.append(f"   {checkbox} {name:<28} {DIM}{desc}{NC}{svc}")
        elif row["type"] == "spacer":
            lines.append("")

    lines.append("")

    count = sum(1 for s in selected if s)
    lines.append(f"  {BOLD}{count} skill{'s' if count != 1 else ''} selected{NC}")
    lines.append("")

    return lines


def clear_lines(n):
    """Move cursor up n lines and clear each one."""
    for _ in range(n):
        sys.stdout.write("\033[A\033[2K")
    sys.stdout.write("\r")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", default=None)
    parser.add_argument("--skills-dir", default=None)
    parser.add_argument("--business-context", default="")
    args = parser.parse_args()

    # Resolve paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)

    catalog_path = args.catalog or os.path.join(
        repo_root, ".claude", "skills", "_catalog", "catalog.json"
    )
    skills_dir = args.skills_dir or os.path.join(repo_root, ".claude", "skills")
    installed_json = os.path.join(
        repo_root, ".claude", "skills", "_catalog", "installed.json"
    )

    # Load catalog
    with open(catalog_path) as f:
        catalog = json.load(f)

    core_skills = set(catalog["core_skills"])
    all_skills = catalog["skills"]

    # Group labels for display
    category_labels = {
        "utility": "Utility (work behind the scenes)",
        "strategy": "Research & Strategy",
        "execution": "Content & Copy",
        "visual": "Visual & Video",
        "operations": "Operations",
    }
    category_order = {"utility": 1, "strategy": 2, "execution": 3, "visual": 4, "operations": 5}

    # Build sorted optional skill list
    optional = []
    for name, info in all_skills.items():
        if name not in core_skills:
            optional.append(
                {
                    "name": name,
                    "category": info["category"],
                    "description": info["description"],
                    "services": info.get("requires_services", []),
                    "dependencies": info.get("dependencies", []),
                }
            )
    optional.sort(key=lambda s: (category_order.get(s["category"], 99), s["name"]))

    if not optional:
        print(json.dumps({"selected": list(core_skills), "removed": []}))
        return

    # All selected by default
    selected = [True] * len(optional)
    cursor = 0

    # Build row layout (headers + skills)
    category_rows = []
    current_cat = None
    for i, skill in enumerate(optional):
        if skill["category"] != current_cat:
            if current_cat is not None:
                category_rows.append({"type": "spacer"})
            current_cat = skill["category"]
            label = category_labels.get(current_cat, current_cat.title())
            category_rows.append({"type": "header", "label": label})
        category_rows.append({"type": "skill", "index": i})

    # Show core skills first
    print()
    print(f"{CYAN}{BOLD}  Core skills (always installed):{NC}")
    for s in sorted(core_skills):
        print(f"   {GREEN}■{NC} {s}")
    print()

    # Initial render
    prev_lines = render(optional, selected, cursor, category_rows)
    sys.stdout.write("\n".join(prev_lines))
    sys.stdout.flush()

    # Interactive loop
    while True:
        key = get_key()
        if key is None:
            continue

        if key in ("q", "\x03"):  # q or Ctrl-C
            # Cancelled — select all to be safe
            selected = [True] * len(optional)
            break
        elif key == "\r" or key == "\n":  # Enter
            break
        elif key == " ":
            selected[cursor] = not selected[cursor]
        elif key in ("k", "up"):
            cursor = (cursor - 1) % len(optional)
        elif key in ("j", "down"):
            cursor = (cursor + 1) % len(optional)
        elif key == "a":
            selected = [True] * len(optional)
        elif key == "n":
            selected = [False] * len(optional)
        else:
            continue

        # Re-render
        clear_lines(len(prev_lines))
        prev_lines = render(optional, selected, cursor, category_rows)
        sys.stdout.write("\n".join(prev_lines))
        sys.stdout.flush()

    # Clear menu
    clear_lines(len(prev_lines))

    # Resolve dependencies — if a skill is selected, auto-select its deps
    changed = True
    while changed:
        changed = False
        for i, skill in enumerate(optional):
            if selected[i]:
                for dep in skill["dependencies"]:
                    # Find dep in optional list
                    for j, other in enumerate(optional):
                        if other["name"] == dep and not selected[j]:
                            selected[j] = True
                            changed = True

    # Build final lists
    selected_names = set(core_skills)
    removed_names = []
    deps_auto_added = []

    for i, skill in enumerate(optional):
        if selected[i]:
            selected_names.add(skill["name"])
        else:
            removed_names.append(skill["name"])

    # Remove unselected skill folders
    for name in removed_names:
        skill_path = os.path.join(skills_dir, name)
        if os.path.isdir(skill_path):
            shutil.rmtree(skill_path)

    # Write installed.json
    os.makedirs(os.path.dirname(installed_json), exist_ok=True)
    data = {
        "installed_at": datetime.date.today().isoformat(),
        "version": catalog["version"],
        "installed_skills": sorted(selected_names),
        "removed_skills": sorted(removed_names),
        "selection_pending": False,
    }
    with open(installed_json, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")

    # Print summary
    print()
    print(f"{CYAN}{BOLD}═══════════════════════════════════════════════{NC}")
    print(f"{CYAN}{BOLD}  Skills configured{NC}")
    print(f"{CYAN}{BOLD}═══════════════════════════════════════════════{NC}")
    print()
    print(f"  {BOLD}Keeping ({len(selected_names)}):{NC}")
    for s in sorted(selected_names):
        print(f"    {GREEN}✓{NC} {s}")
    print()

    if removed_names:
        print(f"  {BOLD}Removed ({len(removed_names)}):{NC}")
        for s in sorted(removed_names):
            print(f"    {DIM}✗ {s}{NC}")
        print()

    # Show needed API keys
    all_services = sorted(
        set(
            svc
            for i, skill in enumerate(optional)
            if selected[i]
            for svc in skill["services"]
        )
    )
    if all_services:
        print(f"  {YELLOW}{BOLD}API keys (optional — skills work without them):{NC}")
        for svc in all_services:
            print(f"    {YELLOW}→{NC} {svc}  {DIM}(add to .env){NC}")
        print()

    print(f"  {DIM}Add skills back anytime with 'add a skill'.{NC}")
    print()

    # Output JSON for Claude to parse
    result = {
        "selected": sorted(selected_names),
        "removed": sorted(removed_names),
        "services_needed": all_services,
    }
    # Write to a temp file so Claude can read it if needed
    result_path = os.path.join(repo_root, ".claude", "skills", "_catalog", "selection-result.json")
    with open(result_path, "w") as f:
        json.dump(result, f, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
