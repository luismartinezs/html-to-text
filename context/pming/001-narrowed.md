### Project Idea

Micro lib: HTML → Plain-text converter

---

### 1. Assessment Checklist

* Confirmed usage context: Node.js library with exported functions.
* Output formatting clarified for links, lists, tables, entities, and line-wrap.
* Scope excludes images.
* Dependencies and environment implicit: Node.js, minimal footprint.
* All essential functional requirements now explicit.

---

### 2. Clarity Score

**Clarity Score: 100/100**

---

### 3. Reformulated Project Idea (PRD-ready)

**Goal:**
Develop and publish a minimal Node.js library that converts HTML emails into clean plain text.

**Scope:**

* **Input:** Raw HTML string (valid HTML assumed).
* **Output:** Plain text string formatted according to rules below.
* **Elements handled:**

  * **Links:** Convert to `[text](URL)` Markdown-style. If anchor has no text, output only the URL.
  * **Lists:**

    * Unordered → `* item`
    * Ordered → `1. item` (restart numbering for each list).
  * **Tables:** Render as Markdown-like grid with `|` separators and rows aligned minimally.
  * **Entities:** Decode all HTML entities into their plain-text equivalents.
  * **Line breaks:** Insert newlines only where semantically required (e.g., `<p>`, `<br>`, `<li>`, block tags). No soft-wrapping to column width.
* **Exclusions:** Ignore images and any CSS styling.

**Constraints:**

* **Environment:** Node.js only.
* **Interface:** Single exported synchronous function `htmlToText(html: string): string`.
* **Dependencies:** Minimal; small, widely used packages acceptable.
* **Assumptions:** Input HTML is valid. Invalid markup handling is out of scope.

This version is sufficient for a PRD draft.

Do you want me to expand this into a structured PRD outline (objectives, functional requirements, non-functional requirements, out-of-scope) next?
