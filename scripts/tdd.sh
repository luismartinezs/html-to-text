#!/usr/bin/env bash
# =============================================================================
# TDD automation pipeline for Claude Code CLI
#
# What this script does, in plain English:
# 1) Prompts you to confirm you are on a feature branch.
# 2) Prompts you to paste a multi-line feature description.
# 3) Runs the TDD flow with Claude Code in headless mode:
#    - Acceptance: clarifies requirements from your feature text.
#    - Test: generates/updates tests (must change the repo or abort).
#    - Git commit: commits new/updated tests.
#    - Code: implements the minimal code to make those tests pass.
#    - Review: performs a review pass and can write files.
# 4) Prints the Claude session id and which tests were considered.
#
# Requirements:
# - claude, jq, git installed and available in PATH
# - Run from the repo root (or pass a path as $1)
# =============================================================================

set -euo pipefail

# ---------------------------
# Frontmatter: Key configurables
# ---------------------------

# Claude command names (you can rename to your custom aliases)
TDD_ACCEPTANCE_CMD="/engineering:tdd:define-acceptance-criteria"
TDD_TEST_CMD="/engineering:tdd:scaffold-tests"
TDD_CODE_CMD="/engineering:tdd:implement"
TDD_REVIEW_CMD="/engineering:tdd:review-code"

# Allowed tools and permissions per phase
ALLOWED_TOOLS_ACCEPTANCE="Read"
ALLOWED_TOOLS_TEST="mcp__filesystem,Bash,Read"
ALLOWED_TOOLS_CODE="mcp__filesystem,Bash,Read"
ALLOWED_TOOLS_REVIEW="mcp__filesystem,Bash,Read"   # review can write files

PERMISSION_MODE="acceptEdits"   # non-interactive, auto-accept edits

# Test file detection patterns (extend as needed)
TEST_GREP_REGEX='\.test\.ts$'

# Optional: extra hints added to prompts
TEST_EXTRA_HINT="Make concrete automated tests. Create files if missing."
CODE_FALLBACK_HINT="No test files detected. Use acceptance criteria to infer failing tests and implement minimal code."

# Working directory
PROJECT_DIR="${1:-$(pwd)}"

# ---------------------------
# Pre-flight checks
# ---------------------------

cd "$PROJECT_DIR"

command -v claude >/dev/null || { echo "claude not found"; exit 1; }
command -v jq >/dev/null || { echo "jq not found"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null || { echo "not a git repo"; exit 1; }

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Info: You should be on a feature branch, not main/master/develop. Current branch: $BRANCH"
read -r -p "Continue? [y/N] " CONT
if [[ ! "$CONT" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo
echo "Paste the feature description for acceptance. End with Ctrl-D:"
FEATURE_TEXT="$(cat)"
if [[ -z "${FEATURE_TEXT// }" ]]; then
  echo "No feature description provided. Aborted."
  exit 1
fi

# Ensure a clean starting state for reliable change detection
git update-index -q --refresh
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree not clean. Commit or stash first. Aborted."
  exit 1
fi

# ---------------------------
# 1) Acceptance
# ---------------------------

ACC_PROMPT="${TDD_ACCEPTANCE_CMD}

${FEATURE_TEXT}"
ACC_JSON=$(
  claude -p "$ACC_PROMPT" \
    --output-format json \
    --allowedTools "$ALLOWED_TOOLS_ACCEPTANCE" \
    --permission-mode "$PERMISSION_MODE" \
    --cwd "$PROJECT_DIR"
)

SESSION_ID=$(jq -r '.session_id' <<<"$ACC_JSON")
ACC_TEXT=$(jq -r '.result' <<<"$ACC_JSON")

# ---------------------------
# 2) Tests (must change repo or abort)
# ---------------------------

TEST_PROMPT="${TDD_TEST_CMD}

${ACC_TEXT}

${TEST_EXTRA_HINT}"
claude -p "$TEST_PROMPT" \
  --resume "$SESSION_ID" \
  --output-format json \
  --allowedTools "$ALLOWED_TOOLS_TEST" \
  --permission-mode "$PERMISSION_MODE" \
  --cwd "$PROJECT_DIR" >/dev/null

# Verify that test command produced changes
git update-index -q --refresh
if git diff --quiet && git diff --cached --quiet; then
  echo "$TDD_TEST_CMD produced no git changes. Something went wrong. Aborted."
  exit 1
fi

# ---------------------------
# 3) Commit new/updated tests
# ---------------------------

CHANGED_TESTS=$(git ls-files -m -o --exclude-standard | grep -E "$TEST_GREP_REGEX" || true)

# If no tests matched the patterns, still commit all changes from text command to avoid losing work
if [[ -z "${CHANGED_TESTS// }" ]]; then
  echo "No files matched test patterns. Committing all changes from $TDD_TEST_CMD."
  git add -A
else
  echo "$CHANGED_TESTS" | xargs -r git add
fi

if ! git diff --cached --quiet; then
  git commit -m "chore(tdd): add/update tests from ${TDD_TEST_CMD}"
fi

# Build list of tests to pass for /tdd:code
if [[ -n "${CHANGED_TESTS// }" ]]; then
  TESTS_TO_PASS="$CHANGED_TESTS"
else
  TESTS_TO_PASS=$(git ls-files | grep -E "$TEST_GREP_REGEX" || true)
fi

# ---------------------------
# 4) Code to pass tests
# ---------------------------

if [[ -z "${TESTS_TO_PASS// }" ]]; then
  CODE_PROMPT="${TDD_CODE_CMD} tests: <none detected>

${CODE_FALLBACK_HINT}

${ACC_TEXT}"
else
  CODE_PROMPT="${TDD_CODE_CMD} tests: $(echo "$TESTS_TO_PASS" | tr '\n' ' ')"
fi

claude -p "$CODE_PROMPT" \
  --resume "$SESSION_ID" \
  --output-format json \
  --allowedTools "$ALLOWED_TOOLS_CODE" \
  --permission-mode "$PERMISSION_MODE" \
  --cwd "$PROJECT_DIR" >/dev/null

# ---------------------------
# 5) Review (allowed to write files)
# ---------------------------

claude -p "$TDD_REVIEW_CMD" \
  --resume "$SESSION_ID" \
  --output-format json \
  --allowedTools "$ALLOWED_TOOLS_REVIEW" \
  --permission-mode "$PERMISSION_MODE" \
  --cwd "$PROJECT_DIR" >/dev/null

# ---------------------------
# Summary
# ---------------------------

echo
echo "Session: $SESSION_ID"
echo "Tests considered:"
echo "${TESTS_TO_PASS:-<none>}"
