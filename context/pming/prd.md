# Product Requirements Document: HTML → Plain-text Converter

## Objective

Create a minimal Node.js library that converts HTML email content into clean, structured plain text for downstream processing or display.

## Features / Functional Requirements

* **Input:** Raw valid HTML string.
* **Output:** Plain text string with defined formatting.
* **Conversion rules:**

  * **Links:** `[text](URL)` if text present, otherwise URL only.
  * **Lists:**

    * Unordered → `* item`
    * Ordered → `1. item` (restart numbering per list).
  * **Tables:** Render as Markdown-like grid with `|` separators. Minimal alignment only.
  * **Entities:** Decode HTML entities to plain text equivalents.
  * **Line breaks:** Insert newlines for block-level elements (`<p>`, `<br>`, `<li>`, etc.). No column wrapping.
* **Exclusions:** Ignore images and CSS. No rendering of visual styling.

## Non-Functional Requirements

* **Environment:** Node.js.
* **API:** Single synchronous function `htmlToText(html: string): string`.
* **Dependencies:** Minimal, small widely used packages only.
* **Performance:** Must handle typical email body sizes without blocking issues.
* **Robustness:** Input assumed valid HTML; malformed markup handling out of scope.

## Constraints

* No asynchronous API.
* No browser environment support.
* No handling of embedded scripts, styles, or media.

## Success Criteria

* Correct plain-text conversion of links, lists, tables, entities, and line breaks.
* Output passes unit tests with representative HTML email samples.
* Library footprint remains minimal and dependency chain small.