#!/usr/bin/env python3
"""
Claude Code TDD pipeline (config-driven)

Flow:
1) Warn if not on a feature branch.
2) Read multi-line feature description from stdin.
3) Execute steps from workflow.tdd.json in order.
4) Enforce: /tdd:test must change repo or abort; commit tests; review can write files.

Prereqs: Python 3.10+, git, pip install claude-code-sdk, npm i -g @anthropic-ai/claude-code
Usage: python tdd_pipeline.py [repo_path] [config_path]
"""

import asyncio, json, os, re, subprocess, sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from claude_code_sdk import ClaudeSDKClient, ClaudeCodeOptions

# ---------- Git helpers ----------
def sh(args: List[str], cwd: Optional[Path] = None) -> subprocess.CompletedProcess:
    return subprocess.run(args, cwd=cwd, text=True, capture_output=True, check=True)

def git_branch(cwd: Path) -> str:
    return sh(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd).stdout.strip()

def git_clean(cwd: Path) -> bool:
    try:
        sh(["git", "diff", "--quiet"], cwd)
        sh(["git", "diff", "--cached", "--quiet"], cwd)
        return True
    except subprocess.CalledProcessError:
        return False

def git_changed_matching(cwd: Path, pattern: re.Pattern) -> List[str]:
    out = sh(["git", "ls-files", "-m", "-o", "--exclude-standard"], cwd).stdout.splitlines()
    return [p for p in out if pattern.search(p)]

def git_commit(cwd: Path, files: List[str], msg: str) -> None:
    if files: sh(["git", "add", *files], cwd)
    else:     sh(["git", "add", "-A"], cwd)
    try:
        sh(["git", "diff", "--cached", "--quiet"], cwd); return
    except subprocess.CalledProcessError:
        sh(["git", "commit", "-m", msg], cwd)

# ---------- Claude helpers ----------
async def query_collect(client: ClaudeSDKClient, prompt: str) -> Tuple[str, str]:
    await client.query(prompt)
    chunks, session_id = [], ""
    async for m in client.receive_response():
        t = type(m).__name__
        if hasattr(m, "content"):
            for b in m.content:
                if hasattr(b, "text") and b.text:
                    chunks.append(b.text)
        if t == "ResultMessage":
            session_id = getattr(m, "session_id", "") or session_id
            break
    return ("".join(chunks).strip(), session_id)

async def run_step(
    repo: Path,
    permission_mode: str,
    prompt: str,
    allowed_tools: list[str],
    session_id: str | None,
    max_turns: int = 50,
) -> Tuple[str, str]:
    """Run one step with its own client. Resume the same session if provided."""
    async with ClaudeSDKClient(
        options=ClaudeCodeOptions(
            cwd=str(repo),
            permission_mode=permission_mode,
            allowed_tools=allowed_tools,
            resume=session_id,
            max_turns=max_turns,
        )
    ) as client:
        return await query_collect(client, prompt)

# ---------- Tiny template rendering ----------
class DefaultDict(dict):
    def __missing__(self, k): return ""

def render(template: str, ctx: Dict[str, str]) -> str:
    return template.format_map(DefaultDict(ctx))

# ---------- Engine ----------
async def run_workflow(repo: Path, cfg_path: Path) -> None:
    # Preconditions
    try: sh(["git", "rev-parse", "--is-inside-work-tree"], repo)
    except subprocess.CalledProcessError: sys.exit("Not a git repo.")

    branch = git_branch(repo)
    print(f"Info: use a feature branch. Current: {branch}")
    cont = input("Continue? [y/N] ")
    if cont.lower() != "y": sys.exit("Aborted.")

    print("\nPaste the feature description. End with Ctrl-D:")
    feature_text = sys.stdin.read().strip()
    if not feature_text: sys.exit("No feature description. Aborted.")
    if not git_clean(repo): sys.exit("Working tree not clean. Commit or stash first.")

    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    steps = cfg["steps"]
    permission_mode = cfg.get("permission_mode", "acceptEdits")
    test_pat = re.compile(cfg.get("test_regex", r".*$"))

    ctx: Dict[str, str] = {"feature_text": feature_text}
    session_id = ""

    for step in steps:
        tools = step.get("allowed_tools", ["Read"])

        # Prompt selection
        prompt = step.get("prompt")
        if not prompt and step.get("prompt_if_tests") and step.get("prompt_if_no_tests"):
            prompt = step["prompt_if_tests"] if ctx.get("tests_to_pass") else step["prompt_if_no_tests"]
        if not prompt:
            raise SystemExit(f"Step '{step.get('id','?')}' has no prompt.")

        text, sid = await run_step(
            repo=repo,
            permission_mode=permission_mode,
            prompt=render(prompt, ctx),
            allowed_tools=tools,
            session_id=session_id or None,
        )
        session_id = session_id or sid  # capture after first step

        # Save outputs into context if requested
        if "save_as" in step:
            ctx[step["save_as"]] = text

        # Enforce repo change if required
        if step.get("require_repo_change"):
            if git_clean(repo):
                sys.exit(f"{step.get('id','step')}: no git changes. Aborted.")

        # Commit tests if requested and set tests_to_pass
        if step.get("commit_tests"):
            changed_tests = git_changed_matching(repo, test_pat)
            git_commit(repo, changed_tests, step.get("commit_message", "chore(tdd): update tests"))
            if step.get("set_var"):
                ctx[step["set_var"]] = " ".join(changed_tests)

    print("\nSession:", session_id or "<unknown>")
    print("Tests considered:")
    print(ctx.get("tests_to_pass") or "<none>")

# ---------- Entrypoint ----------
if __name__ == "__main__":
    repo_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    cfg_path  = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else repo_path / "workflow.tdd.json"
    asyncio.run(run_workflow(repo_path, cfg_path))
