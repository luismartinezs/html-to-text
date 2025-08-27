#!/usr/bin/env python3
"""
Claude Code TDD pipeline (config-driven)

Flow:
1) Warn if not on a feature branch.
2) Read feature description from YAML config.
3) Execute steps from workflow file in order.
4) Enforce: /tdd:test must change repo or abort; commit tests; review can write files.

Prereqs: Python 3.10+, git, pip install claude-code-sdk PyYAML, npm i -g @anthropic-ai/claude-code
Usage: python tdd_pipeline.py <config.yml>

Config YAML format:
repo_path: "."  # optional, defaults to "."
workflow_path: "./path/to/workflow.tdd.json"  # mandatory
feature: |  # mandatory - multiline markdown text
  Feature 3.3: Ordered List Conversion
  
  **Scope:** 3 points
  **Priority:** High
  
  ### Description
  Convert HTML ordered lists to numbered format...
"""

import asyncio, json, os, re, subprocess, sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from claude_code_sdk import ClaudeSDKClient, ClaudeCodeOptions

try:
    import yaml
except ImportError:
    print("❌ Error: PyYAML not installed. Run: pip install PyYAML")
    sys.exit(1)

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
async def run_workflow(config: Dict) -> None:
    # Extract config values
    repo = Path(config.get("repo_path", ".")).resolve()
    feature_text = config.get("feature", "").strip()
    workflow_path = Path(config["workflow_path"]).resolve()
    
    # Validate config
    if not feature_text:
        sys.exit("❌ Error: 'feature' is required in config file.")
    if not workflow_path.exists():
        sys.exit(f"❌ Error: Workflow file not found: {workflow_path}")
    
    print(f"📁 Repository path: {repo}")
    print(f"📄 Workflow file: {workflow_path}")
    print(f"✨ Feature: {feature_text[:100]}{'...' if len(feature_text) > 100 else ''}")
    
    # Preconditions
    try: sh(["git", "rev-parse", "--is-inside-work-tree"], repo)
    except subprocess.CalledProcessError: sys.exit("❌ Not a git repo.")

    branch = git_branch(repo)
    print(f"\n⚠️  Info: use a feature branch. Current: {branch}")
    cont = input("Continue? [y/N] ")
    if cont.lower() != "y": sys.exit("Aborted.")

    if not git_clean(repo): sys.exit("❌ Working tree not clean. Commit or stash first.")

    print(f"\n📋 Loading workflow configuration from: {workflow_path}")
    workflow_cfg = json.loads(workflow_path.read_text(encoding="utf-8"))
    steps = workflow_cfg["steps"]
    permission_mode = workflow_cfg.get("permission_mode", "acceptEdits")
    test_pat = re.compile(workflow_cfg.get("test_regex", r".*$"))
    print(f"⚙️  Permission mode: {permission_mode}")
    print(f"🧪 Test regex pattern: {workflow_cfg.get('test_regex', '.*$')}")

    ctx: Dict[str, str] = {"feature_text": feature_text}
    session_id = ""

    print(f"\n🚀 Starting TDD workflow with {len(steps)} steps...")

    for i, step in enumerate(steps, 1):
        step_id = step.get('id', f'step-{i}')
        tools = step.get("allowed_tools", ["Read"])
        
        print(f"\n--- Step {i}/{len(steps)}: {step_id} ---")
        print(f"Tools available: {', '.join(tools)}")

        # Prompt selection
        prompt = step.get("prompt")
        if not prompt and step.get("prompt_if_tests") and step.get("prompt_if_no_tests"):
            prompt = step["prompt_if_tests"] if ctx.get("tests_to_pass") else step["prompt_if_no_tests"]
        if not prompt:
            raise SystemExit(f"Step '{step_id}' has no prompt.")

        print(f"🤖 Running Claude with prompt: {prompt.split()[0] if prompt else 'N/A'}...")
        text, sid = await run_step(
            repo=repo,
            permission_mode=permission_mode,
            prompt=render(prompt, ctx),
            allowed_tools=tools,
            session_id=session_id or None,
        )
        session_id = session_id or sid  # capture after first step
        print(f"✅ Claude step completed")

        # Save outputs into context if requested
        if "save_as" in step:
            print(f"💾 Saving output to context variable: {step['save_as']}")
            ctx[step["save_as"]] = text

        # Commit tests if requested and set tests_to_pass
        if step.get("commit_tests"):
            print(f"🔍 Looking for test files matching pattern...")
            changed_tests = git_changed_matching(repo, test_pat)
            if changed_tests:
                print(f"📝 Committing {len(changed_tests)} test file(s): {', '.join(changed_tests)}")
                git_commit(repo, changed_tests, step.get("commit_message", "chore(tdd): update tests"))
                print(f"✅ Tests committed successfully")
            else:
                print(f"⚠️  No test files found to commit")
            if step.get("set_var"):
                ctx[step["set_var"]] = " ".join(changed_tests)
                print(f"📋 Set context variable '{step['set_var']}' = '{ctx[step['set_var']]}'")

        # Enforce repo change if required (after committing tests)
        if step.get("require_repo_change"):
            print(f"🔒 Checking that step '{step_id}' made repository changes...")
            if git_clean(repo):
                sys.exit(f"❌ {step_id}: no git changes. Aborted.")
            else:
                print(f"✅ Repository changes confirmed")

    print(f"\n🎉 TDD workflow completed successfully!")
    print(f"📋 Session ID: {session_id or '<unknown>'}")
    print(f"🧪 Tests considered: {ctx.get('tests_to_pass') or '<none>'}")
    print(f"🏁 All {len(steps)} steps finished.")

# ---------- Entrypoint ----------
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tdd_pipeline.py <config.yml>")
        print("\nConfig YAML format:")
        print('repo_path: "."  # optional, defaults to "."')
        print('workflow_path: "./path/to/workflow.tdd.json"  # mandatory')
        print('feature: |  # mandatory - multiline markdown text')
        print('  Feature 3.3: Ordered List Conversion')
        print('  ')
        print('  **Scope:** 3 points')
        print('  **Priority:** High')
        print('  ')
        print('  ### Description')
        print('  Convert HTML ordered lists to numbered format...')
        sys.exit(1)
    
    config_path = Path(sys.argv[1]).resolve()
    if not config_path.exists():
        sys.exit(f"❌ Error: Config file not found: {config_path}")
    
    try:
        config = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        sys.exit(f"❌ Error: Invalid YAML in config file: {e}")
    
    asyncio.run(run_workflow(config))
