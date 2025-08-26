# Html to text

Secure and robust HTML-to-text conversion library using proper DOM parsing. Converts HTML to plain text while handling block-level elements, HTML entities, and malformed HTML gracefully.

## Installation

```bash
npm install html-to-text
```

## Usage

### ES Modules (Recommended)

```javascript
import { htmlToText } from "html-to-text";

const html = "<p>Hello <strong>world</strong>!</p>";
const text = htmlToText(html);
console.log(text); // Output: "Hello world!\n"
```

### Browser (IIFE)

```html
<script src="./dist/html-to-text.iife.js"></script>
<script>
  const text = htmlToText("<p>Hello <strong>world</strong>!</p>");
  console.log(text); // Output: "Hello world!\n"
</script>
```

## API

### `htmlToText(html: string): string`

Converts HTML to plain text using proper DOM parsing. Handles block-level elements, HTML entities, and malformed HTML gracefully.

**Features:**
- Block-level elements (p, div, h1-h6, li, br, etc.) convert to line breaks
- HTML entities are properly decoded (&nbsp;, &amp;, &lt;, &gt;, &quot;, &#39;, etc.)
- Secure parsing - no script execution or innerHTML risks
- Handles malformed HTML gracefully

**Parameters:**

- `html` (string): The HTML string to convert

**Returns:**

- (string): Plain text with proper line breaks and decoded entities

**Examples:**

```javascript
// Basic usage with block elements
htmlToText("<p>Hello world</p>"); // "Hello world\n"

// Multiple paragraphs
htmlToText("<p>First</p><p>Second</p>"); // "First\nSecond\n"

// Complex HTML with entities
htmlToText('<div><h1>Title</h1><p>A&amp;B &lt;test&gt;</p><br><p>Final</p></div>');
// "Title\nA&B <test>\n\nFinal\n"

// Line breaks
htmlToText("Hello<br>World"); // "Hello\nWorld"

// HTML entities
htmlToText("Hello&nbsp;World"); // "Hello World"

// Empty input
htmlToText(""); // ""
```

### `parseHtml(html: string): object`

Parses HTML into a structured document fragment object for advanced use cases.

**Parameters:**

- `html` (string): The HTML string to parse

**Returns:**

- (object): Parse5 document fragment with childNodes array

**Example:**

```javascript
import { parseHtml } from "html-to-text";

const fragment = parseHtml("<div><p>Hello</p></div>");
console.log(fragment.childNodes); // Array of parsed DOM nodes
```

## Security

This library is designed with security as a fundamental principle:

- Uses parse5 for spec-compliant HTML parsing (no script execution)
- Safe for processing user-generated content
- No innerHTML or DOM manipulation vulnerabilities
- Comprehensive input sanitization through text-only extraction

See [SECURITY.md](SECURITY.md) for detailed security information.
