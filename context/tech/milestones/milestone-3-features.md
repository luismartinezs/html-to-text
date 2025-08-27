# Milestone 3 Feature Breakdown: Structured Elements

**Milestone:** Structured Elements (Links, Lists, Tables)
**Total Estimate:** 4 features × 2-3 points = 8-12 story points (manageable for 1-day milestone)

---

## [x] Feature 3.1: Link Conversion

**Scope:** 2 points
**Priority:** High

### Description

Convert HTML anchor tags (`<a>`) to markdown-style link format with proper text extraction and URL handling.

### Acceptance Criteria

- `<a href="https://example.com">Click here</a>` → `[Click here](https://example.com)`
- `<a href="mailto:user@example.com">Contact</a>` → `[Contact](mailto:user@example.com)`
- `<a href="https://example.com"></a>` → `https://example.com` (URL-only when no text)
- `<a>No href</a>` → `No href` (plain text when no href)

### Implementation Notes

- Extract `href` attribute from anchor node
- Get inner text content, handling nested elements
- Format as `[text](url)` or URL-only based on text presence
- Handle edge cases: missing href, empty text, nested tags

### Dependencies

- Core parsing infrastructure from Milestone 2
- Text extraction utility function

---

## [x] Feature 3.2: Unordered List Conversion

**Scope:** 2 points
**Priority:** High

### Description

Convert HTML unordered lists (`<ul>`) to bullet point format with proper nesting support.

### Acceptance Criteria

- `<ul><li>Item 1</li><li>Item 2</li></ul>` → `* Item 1\n* Item 2\n`
- Nested lists increase indentation: `  * Nested item`
- Mixed content in `<li>` handled correctly
- Empty list items produce empty bullet points

### Implementation Notes

- Track nesting level for indentation
- Use `* ` prefix for each list item
- Handle nested `<ul>` elements recursively
- Preserve line breaks between items

### Dependencies

- Core parsing infrastructure from Milestone 2
- Indentation tracking mechanism

---

## [x] Feature 3.3: Ordered List Conversion

**Scope:** 3 points
**Priority:** High

### Description

Convert HTML ordered lists (`<ol>`) to numbered format with proper numbering and nesting support.

### Acceptance Criteria

- `<ol><li>First</li><li>Second</li></ol>` → `1. First\n2. Second\n`
- Each new `<ol>` restarts numbering from 1
- Nested ordered lists use separate numbering sequences
- `start` attribute support: `<ol start="5">` begins numbering at 5

### Implementation Notes

- Maintain counter state per list level
- Reset counter for each new `<ol>` element
- Handle `start` attribute parsing
- Support nested numbering with indentation

### Dependencies

- Core parsing infrastructure from Milestone 2
- Counter state management system

---

## [ ] Feature 3.4: Basic Table Conversion

**Scope:** 3 points
**Priority:** Medium

### Description

Convert HTML tables to markdown-style grid format using pipe separators with minimal alignment.

### Acceptance Criteria

- Simple table: `<table><tr><td>A</td><td>B</td></tr></table>` → `| A | B |\n`
- Header support: `<th>` elements treated as regular cells
- Multi-row tables with consistent column alignment
- Empty cells render as empty space between pipes

### Implementation Notes

- Parse table structure: `<table>` → `<tr>` → `<td>`/`<th>`
- Calculate column widths for basic alignment
- Use `|` separators between cells
- Add newlines between rows
- Handle colspan/rowspan by ignoring (out of scope)

### Dependencies

- Core parsing infrastructure from Milestone 2
- Column width calculation utility

---

## Integration Notes

### Testing Strategy

- Unit tests for each feature independently
- Integration test with combined HTML containing all element types
- Golden file fixtures for regression testing
- Performance test with complex nested structures

### Implementation Order

1. Feature 3.1 (Links) - Foundation for attribute extraction
2. Feature 3.2 (Unordered Lists) - Simpler list logic
3. Feature 3.3 (Ordered Lists) - Builds on list patterns
4. Feature 3.4 (Tables) - Most complex, benefits from other patterns

### Risk Mitigation

- **Complex nesting:** Limit initial nesting depth to 3 levels
- **Table complexity:** Defer advanced alignment and styling
- **Performance:** Profile with nested structures during development
- **Edge cases:** Document limitations clearly in tests

### Definition of Done

- All acceptance criteria pass
- Unit test coverage ≥ 80% for each feature
- Integration tests with representative HTML emails
- No performance regression on 200KB fixtures
- Code review completed
- CI pipeline green
