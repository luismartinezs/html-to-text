# Milestones v1

- **Cadence:** 1 day per milestone (first milestone ≤1 day)
- **Total Timebox:** 6 days
- **Global DoD:** All features pass integration tests against representative HTML email fixtures, CI pipeline green, published to npm with dual bundles.

---

## [ ] Milestone 1

- **Name:** Project Setup & Core Skeleton
- **Objective:** Establish development environment and implement basic library structure.
- **Scope:**
  - Repo scaffolding with Bun + TypeScript + Vite.
  - CI pipeline (lint + test).
  - Placeholder `htmlToText()` function.

- **Deliverables:**
  - Public GitHub repo with CI pipeline.
  - Empty function `htmlToText(html:string):string` returning stub.

- **Acceptance criteria:**
  - `bun run build` produces CJS + ESM bundles.
  - CI runs automatically on PR and passes.

- **Exit tests:**
  - Repo builds successfully.
  - CI runs unit test placeholder.

- **Demo checklist:**
  - Show build and CI run.
  - Show npm package local install.

- **Metrics target:** 100% green CI.
- **Dependencies:** Bun, TypeScript, Vite.
- **Risks & mitigations:** Incorrect bundling → mitigate by verifying both CJS and ESM builds.
- **Estimate:** 1 day.
- **Owner:** Dev team.

---

## [ ] Milestone 2

- **Name:** Core Parsing & Entities
- **Objective:** Implement HTML parsing and entity decoding.
- **Scope:**
  - Integrate `parse5` for AST generation.
  - Integrate `he` for entity decoding.
  - Convert block-level elements to line breaks.

- **Deliverables:**
  - Working traversal function returning text with decoded entities and correct newlines.

- **Acceptance criteria:**
  - Given `<p>Hello&nbsp;World</p>`, returns `Hello World\n`.
  - No crashes on valid HTML.

- **Exit tests:**
  - Unit tests for entities and block-level breaks.

- **Demo checklist:**
  - Convert sample HTML into plain text with correct spacing.

- **Metrics target:** Unit test coverage ≥ 0.6.
- **Dependencies:** parse5, he.
- **Risks & mitigations:** Performance hit on large HTML → mitigate with fixture testing up to 200 KB.
- **Estimate:** 1 day.
- **Owner:** Dev team.

---

## [ ] Milestone 3

- **Name:** Structured Elements (Links, Lists, Tables)
- **Objective:** Implement conversion for lists, links, and tables.
- **Scope:**
  - Lists → `*` or `1.` syntax.
  - Links → `[text](url)` or URL-only.
  - Tables → Markdown-like grid using `|`.

- **Deliverables:**
  - Extended traversal covering all required element types.

- **Acceptance criteria:**
  - Given `<ul><li>Item</li></ul>` → `* Item`.
  - Given `<a href="url">Text</a>` → `[Text](url)`.
  - Given simple `<table>` → formatted grid.

- **Exit tests:**
  - Golden file fixtures for links/lists/tables pass.

- **Demo checklist:**
  - Convert sample HTML email with lists, links, tables.

- **Metrics target:** Coverage ≥ 0.8.
- **Dependencies:** Core parsing from milestone 2.
- **Risks & mitigations:** Complexity of table formatting → limit alignment and test minimal grid.
- **Estimate:** 1 day.
- **Owner:** Dev team.

---

## [ ] Milestone 4

- **Name:** Final Hardening & Release
- **Objective:** Ensure robustness, finalize tests, release to npm.
- **Scope:**
  - Add integration tests with representative email fixtures.
  - Document API usage and limitations.
  - Manual npm publish with versioning.

- **Deliverables:**
  - Published npm package.
  - Documentation in README.

- **Acceptance criteria:**
  - All fixtures pass.
  - Package installable via `npm install`.

- **Exit tests:**
  - CI pipeline passes full suite.
  - Install from npm and run sample.

- **Demo checklist:**
  - Show npm install and function call with sample email.

- **Metrics target:** P95 <200 ms on 200 KB email.
- **Dependencies:** npm account, GitHub Actions CI.
- **Risks & mitigations:** Human error in manual publish → mitigate with step-by-step checklist.
- **Estimate:** 1 day.
- **Owner:** Dev team.

---

## Cut lines

- **Deferrable items:**
  - Handling malformed HTML.
  - Optional advanced formatting (nested tables, alignment).

- **Kill criteria:**
  - Library cannot meet latency or dependency constraints.
  - Inability to pass core functional tests on fixtures.

# Appendix

P95 means the **95th percentile** of all measured runs.

In this context:

- You run performance tests on many HTML emails of \~200 KB size.
- Measure the time each conversion takes.
- Order all the times from fastest to slowest.
- The time at the 95% mark is the **P95 latency**.

So “P95 < 200 ms” means:
95% of conversion calls must complete in under 200 milliseconds. Only the slowest 5% are allowed to take longer.

This metric avoids being skewed by rare outliers (like one very slow run) while still showing worst-case performance for typical users.
