# Agentic OS Install Guide — Jordan

Welcome to the system. This guide walks you through installing Agentic OS on your Windows machine and running your first session. Budget about 60 minutes for the full setup including the prereqs. If you're moving fast and already have Git, Python, and Node installed, budget 20 minutes.

Read this end-to-end before you start. Don't skip ahead. The order matters because each step depends on the one before it.

If something breaks, there's a troubleshooting section at the bottom with the specific errors we already hit during Jason's install and their fixes.

---

## What you're installing

Agentic OS is the operating system for how ROI.LIVE does agency work. It's a set of files and scripts that turn Claude Code into a business assistant that knows our agency standards, every client's brand context, and the methodology for producing SEO/AEO content.

You'll interact with it two ways:

1. **Claude Code in Git Bash (terminal)** — this is where the actual work happens
2. **Command Centre in a web browser** — this is a dashboard for tracking tasks, scheduled jobs, and clients. Heads up: the chat input has a known bug on Windows that truncates messages. Do the real work in the terminal.

Your role in this system is AEO/SEO execution lead in training. What that means, how you'll progress, and what you can and can't touch — all documented in the repo after install. You'll read those files as part of orientation.

---

## Before you start

Make sure these are true:

- You have a ROI.LIVE Google Workspace account
- You have a GitHub account (tell Jason your GitHub username if he doesn't have it)
- Jason has accepted you as a collaborator on `revgrowth/roi-live-agentic-os` — check your email for the invite, or visit https://github.com/revgrowth/roi-live-agentic-os (you should be able to see the repo; if you get a 404, tell Jason)
- Your Claude Pro Team account is active and you can log in at claude.ai

Don't proceed until all four are true.

---

## Part 1 — Install the prerequisites (20-30 minutes)

Four things need to be installed before Agentic OS can work. Do them in this order.

### 1.1 Install Git

Git is how you pull the latest code and push your work.

1. Go to https://git-scm.com/downloads
2. Click **Download for Windows**
3. Run the installer
4. Accept the defaults on every screen — just click Next repeatedly
5. On the "Choosing the default editor" screen, select **Use Visual Studio Code as Git's default editor** (it's in the dropdown list)
6. Finish install

Verify by opening Command Prompt (Windows key → type "cmd" → Enter) and typing:

```
git --version
```

You should see something like `git version 2.45.x`. If you see "git is not recognized," restart your computer and try again. If it still fails, tell Jason.

### 1.2 Install Python

Agentic OS uses Python for some background scripts.

1. Go to https://www.python.org/downloads/
2. Click **Download Python 3.x.x** (the big yellow button)
3. Run the installer
4. **Critical:** On the first screen, check the box that says **Add python.exe to PATH** at the bottom. This is the #1 thing people miss. If you miss this, nothing else works.
5. Click **Install Now**
6. Let it finish

Verify in Command Prompt:

```
python --version
```

Should show `Python 3.x.x`. If it says "not recognized," you missed the PATH checkbox. Uninstall Python and reinstall, this time checking the box.

### 1.3 Install Node.js

Node runs the Command Centre web dashboard.

1. Go to https://nodejs.org/en/download
2. Download the **LTS** (Long Term Support) version for Windows
3. Run the installer
4. Accept all defaults
5. When it asks about "Tools for Native Modules," leave that box **unchecked** — you don't need it

Verify in Command Prompt:

```
node --version
npm --version
```

Both should return version numbers.

### 1.4 Install VS Code

VS Code is the editor you'll use to read files, edit content, and run the terminal.

1. Go to https://code.visualstudio.com
2. Click **Download for Windows**
3. Run the installer
4. On the "Select Additional Tasks" screen, check these boxes:
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Register Code as an editor for supported file types
   - ✅ Add to PATH
5. Click Install, then Finish

Open VS Code once to make sure it launches. You can close it again.

### 1.5 Install Claude Code

Claude Code is the terminal-based assistant that does the actual work.

Open Command Prompt as Administrator:
- Press the Windows key
- Type "cmd"
- Right-click "Command Prompt" → **Run as administrator**
- Click Yes on the UAC prompt

In the Administrator Command Prompt, run:

```
npm install -g @anthropic-ai/claude-code
```

This takes 1-2 minutes. When it finishes, close the Administrator Command Prompt and open a regular one. Test:

```
claude --version
```

You should see something like `2.x.x (Claude Code)`.

The first time you run the `claude` command (not just `--version`), it'll prompt you to log in. Use your ROI.LIVE Google Workspace credentials for the Claude Pro Team account.

---

## Part 2 — Clone the repo (5 minutes)

You're going to clone Jason's private repo to your local machine. This gives you the full agency operating system plus all current client work.

### 2.1 Generate a GitHub Personal Access Token

Your local machine needs a token to authenticate with GitHub.

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in:
   - **Note:** `agentic-os-jordan-local`
   - **Expiration:** 90 days
   - **Scopes:** Check the top-level **repo** checkbox (the sub-items auto-check, that's fine)
4. Click **Generate token** at the bottom
5. **Copy the token immediately.** GitHub shows it once. If you close the page without copying, you have to regenerate.

**Security rule: never paste this token anywhere except the Git Bash credential prompt. Not in chat, not in screenshots, not in email. If you accidentally share it, delete it from GitHub immediately and generate a new one.**

### 2.2 Create your working folder

Open **File Explorer**. Navigate to `C:\Users\<yourname>\`. Create a new folder called `agentic`.

### 2.3 Open the folder in VS Code

1. Open VS Code
2. File → Open Folder
3. Select the `agentic` folder you just created
4. If it asks "Do you trust the authors of the files in this folder?" → click **Yes, I trust the authors**

### 2.4 Open a Git Bash terminal inside VS Code

This is the shell you'll use for everything. Not PowerShell — Git Bash specifically.

1. Top menu: **Terminal → New Terminal**
2. A terminal panel opens at the bottom
3. Look at the top-right of that terminal panel — you'll see a **dropdown arrow (˅)** next to a **+** icon
4. Click the dropdown → select **Git Bash**
5. A new terminal tab opens with a prompt showing `MINGW64` somewhere in it — that confirms you're in Git Bash

**Important:** if you don't see Git Bash in the dropdown, Git didn't install correctly. Go back to step 1.1.

### 2.5 Clone the repo

In the Git Bash terminal, run:

```bash
git clone https://github.com/revgrowth/roi-live-agentic-os.git agentic-os
cd agentic-os
```

Git will prompt for credentials:
- **Username:** your GitHub username
- **Password:** paste the Personal Access Token you generated in step 2.1 (not your GitHub password)

Windows Credential Manager saves this. You won't be prompted again on this machine.

When the clone finishes, you should see all the folders (`.claude`, `agency`, `clients`, `command-centre`, `context`, etc.) in the VS Code file tree on the left.

---

## Part 3 — Run the installer (5 minutes)

The repo has a setup script that installs the skills and configures the system.

In your Git Bash terminal (still in the `agentic-os` folder):

```bash
bash scripts/install.sh
```

The installer will:

- Check that Git, Python, and Node are available
- Show you a menu of skills that are already pre-selected
- Set up the system

**You don't need to change skill selections.** Jason has already curated the right set for ROI.LIVE's work. Just hit Enter / continue when prompted.

When it finishes, you'll see "Installation complete" or similar.

---

## Part 4 — Configure your .env (5 minutes)

The `.env` file holds API keys for services the system uses (Firecrawl, etc.). Jason will share the ROI.LIVE keys with you separately via a secure channel — probably 1Password, LastPass, or in person.

**Do not put keys in Slack, email, or chat.** If Jason sent them via an insecure channel, flag it and ask him to rotate and resend properly.

Once you have the keys:

1. In VS Code's file explorer, find the file called `.env.example` at the root of the `agentic-os` folder
2. Right-click it → **Copy**
3. Right-click in the file tree again → **Paste**
4. Rename the copy to just `.env` (remove `.example` from the filename)
5. Open the new `.env` file
6. Fill in the keys Jason shared with you
7. Save (Ctrl+S)

The `.env` file is in `.gitignore` — it will not be pushed to GitHub. Your keys stay on your machine.

---

## Part 5 — Create your USER profile (5 minutes)

The system needs to know who you are so it can communicate with you appropriately.

In your Git Bash terminal, from the `agentic-os` folder:

```bash
claude
```

The Claude Code assistant launches. It should start silently — no big greeting — because the system detects you as a new user on a system that's already set up.

Type:

```
/start-here
```

It'll walk you through a short interview to fill in your `context/USER.md` file. Answer honestly:

- **Your name and role:** "Jordan Spencer, AEO/SEO Execution Lead (in training)"
- **Communication style preferences:** direct, concise, no fluff. If Claude suggests "professional yet approachable" push back and tell it to be direct and to challenge your work when it's off.
- **What you need help with:** SEO/AEO content execution, keyword research, page optimization, content briefs from strategy docs
- **Background:** whatever's relevant — prior AI tool experience, SEO knowledge level, what you want to learn

Take 5-10 minutes with this. A good USER.md shapes every future session.

When it's done, the system writes to `context/USER.md`. You can open that file in VS Code to see what it captured.

---

## Part 6 — Read the four training docs (30-45 minutes)

Do not skip this step. These docs explain how the system works, what your role is, and how Jason will review your work. Reading them is mandatory before you start producing client work.

In VS Code's file explorer, open and read in this order:

1. **`CONTRIBUTING.md`** (at the repo root) — workflow rules, what you can/can't touch, branch naming conventions, permissions
2. **`AEO-SEO-EXECUTION-PLAYBOOK.md`** (at the repo root) — how to do the actual work. This is your daily reference.
3. **`REVIEW-CHECKLIST.md`** (at the repo root) — what Jason checks when reviewing your PRs. Self-review with this before requesting review.
4. **`clients/training/TRAINING-PROGRESSION.md`** — the 90-day arc. What success looks like in 30/60/90 days.

Take notes. Bring questions to Monday's session with Jason.

Also worth skimming:

- **`agency/README.md`** — what's in the agency layer (SOPs, standards, methodologies)
- **`agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`** — this is the foundational document. Every piece of content you produce gets measured against this.

---

## Part 7 — Verify everything works (5 minutes)

Before you call it installed, run this verification.

In your Git Bash terminal from the `agentic-os` folder:

```bash
claude
```

Once Claude Code launches, ask it:

```
Describe exactly which agency standards files and page-type SOPs you would load before writing a service page for a client. Reference every file by exact path. What's the inheritance order if rules conflict?
```

A passing response names:
- `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md` (Core Standards)
- `agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md` (matching page-type SOP)
- `clients/{client}/brand_context/` files
- The inheritance order (Core → Page-type SOP → Client brand context → Overrides → Session instructions)

If it names those files and describes the inheritance, installation is complete.

If it gives a vague generic answer, something isn't wired correctly — tell Jason and include what the system said.

---

## Part 8 — Your first real task

At Monday's session with Jason, you'll get your first assignment. Don't start work on your own before then.

What Jason will walk you through:

- Setting up your branch naming convention
- Running your first Claude Code session on a real task
- How to wrap up a session (critical — don't skip)
- How to commit and open a pull request
- How his review process works

Come to the session having read the four training docs and with specific questions about anything that wasn't clear.

---

## Daily workflow cheatsheet

Once you're past installation, this is the rhythm you'll run every day.

### Start of work session

```bash
cd ~/agentic/agentic-os
git checkout main
git pull origin main
```

Then switch to a new branch for whatever you're working on:

```bash
git checkout -b jordan/{client}/{deliverable}
cd clients/{client-folder}
claude
```

### During the session

Describe what you're working on, let Claude Code load the right context automatically, iterate on the output. First drafts are never final — push back, ask for specifics, demand sources.

### End of every session

**Non-negotiable:** type `wrap up` in Claude Code and let the meta-wrap-up skill run to completion. This captures learnings, updates memory, and sets tomorrow up.

Then commit and push:

```bash
git add .
git commit -m "concise description of what you built"
git push origin jordan/{client}/{deliverable}
```

Go to GitHub, open a pull request from your branch to `main`. Fill in the PR description per the template in `CONTRIBUTING.md`. Tag Jason for review.

---

## Troubleshooting

### "git is not recognized" or "bash is not recognized"

You're in PowerShell, not Git Bash. Look at the terminal tab — if it says "powershell", click the dropdown arrow next to the `+` icon at the top-right and select Git Bash.

If Git Bash doesn't appear in the dropdown, Git didn't install correctly. Reinstall Git (step 1.1).

### "claude is not recognized"

Claude Code isn't on your PATH. Close and reopen Git Bash. If that doesn't fix it, reinstall Claude Code (step 1.5).

### Enter key doesn't send my message in Claude Code

Paste your message first, then click the send arrow icon (bottom-right of the input box) instead of pressing Enter. There's a known input bug on Windows. Or better: type your message, then click send.

### Claude Code won't launch in a client folder

Make sure you're in the actual client folder, not the client's parent folder. From `agentic-os`, you need to be in `clients/coastal-air-plus`, not just `clients/`.

```bash
pwd
```

Should show something ending in `/clients/{client-name}`.

### The `code` command doesn't work in Git Bash

Inside VS Code, press Ctrl+Shift+P, type "shell command," select **Shell Command: Install 'code' command in PATH**, then close and reopen Git Bash.

### Git push fails with "Authentication failed"

Your token is invalid or expired. Go to https://github.com/settings/tokens, find the token, delete it, and generate a new one (step 2.1). Windows will prompt for credentials on the next push — paste the new token.

### Command Centre chat sends only my first word

Known bug on Windows. Don't use the Command Centre chat for real work. Use Claude Code in Git Bash instead. Command Centre is useful as a dashboard to see goals and scheduled jobs, not as a chat interface.

### Something else broke

Don't edit system files trying to fix it. Tell Jason what happened, what you did last, and what error you saw. Screenshot the terminal.

---

## Things not to do

- Don't paste API keys or GitHub tokens in screenshots, chat, or email
- Don't edit files inside `SOUL.md`, `AGENTS.md`, `CLAUDE.md`, `brand_context/`, or `.claude/skills/` without Jason's explicit approval — these are system-level files
- Don't commit directly to the `main` branch
- Don't skip wrap-up at the end of a session
- Don't use the Command Centre chat for real work (use terminal)
- Don't run Claude Code from the repo root for client work — always `cd` into the client folder first
- Don't assume Claude Code is right. It's excellent at execution, mediocre at strategy. Push back when it's wrong.

---

## When you're stuck

30-minute rule: if you've been stuck on something for 30 minutes and haven't made progress, stop and ask Jason. The cost of asking is 5 minutes. The cost of grinding in the wrong direction is half a day.

Good questions come with: what you were trying to do, what you did, what happened, what error you saw, what you've already tried.

---

## End of install

If you've completed Parts 1 through 7, you're installed. Don't start production work until Monday's session.

Use the weekend to:

1. Re-read `AEO-SEO-EXECUTION-PLAYBOOK.md` and make notes
2. Skim `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md` — don't try to memorize, just get familiar with the sections
3. Come to Monday with questions

See you Monday.
