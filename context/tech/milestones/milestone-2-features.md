# Milestone 2 Feature Breakdown

## [ ] Feature 1: Integrate `parse5` for AST Generation
- **Scope:** 3
- **Description:** Add `parse5` to the project and implement initial HTML-to-AST parsing within the library.
- **Tasks:**
  - Add `parse5` dependency to project.
  - Implement parser function converting raw HTML to AST.
  - Write unit tests for basic parsing of valid HTML.
- **Acceptance Criteria:**
  - Given valid HTML string, library generates AST without errors.
  - No crashes on representative valid HTML inputs.
- **Dependencies:** None
- **Estimate:** 4 hours

---

## [ ] Feature 2: Integrate `he` for Entity Decoding
- **Scope:** 2
- **Description:** Decode HTML entities into plain text equivalents using the `he` library.
- **Tasks:**
  - Add `he` dependency to project.
  - Implement decoding utility integrated into traversal function.
  - Write unit tests for entity decoding (`&nbsp;`, `&amp;`, etc.).
- **Acceptance Criteria:**
  - Given `<p>Hello&nbsp;World</p>`, output is `Hello World\n`.
  - Entities decode consistently across sample HTML fixtures.
- **Dependencies:** Feature 1 (AST parsing must be available).
- **Estimate:** 3 hours

---

## [ ] Feature 3: Convert Block-Level Elements to Line Breaks
- **Scope:** 3
- **Description:** Extend AST traversal to insert newlines for block-level elements (`<p>`, `<br>`, `<li>`, etc.).
- **Tasks:**
  - Define list of block-level tags relevant for plain-text conversion.
  - Extend traversal function to insert `\n` at correct points.
  - Write unit tests verifying newline insertion for paragraphs, lists, and breaks.
- **Acceptance Criteria:**
  - `<p>Hello</p><p>World</p>` → `Hello\nWorld\n`.
  - `<li>Item1</li><li>Item2</li>` → `Item1\nItem2\n`.
- **Dependencies:** Feature 1 (AST parsing must be implemented).
- **Estimate:** 4 hours

---

# Validation
- All three features (parse5 integration, he integration, block-level newlines) are included as described in Milestone 2 of `milestones.md`.
- Each feature has Scope, Description, Tasks, Acceptance Criteria, Dependencies, and Estimate.
- No missing data detected in `prd.md` or `tech-spec.md` relevant to Milestone 2.
