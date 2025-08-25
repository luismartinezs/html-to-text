# Html to text

Small library to convert HTML to text by stripping HTML tags from input strings.

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
console.log(text); // Output: "Hello world!"
```

### Browser (IIFE)

```html
<script src="./dist/html-to-text.iife.js"></script>
<script>
  const text = htmlToText("<p>Hello <strong>world</strong>!</p>");
  console.log(text); // Output: "Hello world!"
</script>
```

## API

### `htmlToText(html: string): string`

Converts HTML string to plain text by removing all HTML tags.

**Parameters:**

- `html` (string): The HTML string to convert

**Returns:**

- (string): Plain text with HTML tags removed

**Examples:**

```javascript
// Basic usage
htmlToText("<p>Hello world</p>"); // "Hello world"

// Complex HTML
htmlToText(
  '<div><h1>Title</h1><p>Paragraph with <a href="#">link</a></p></div>'
);
// "TitleParagraph with link"

// Empty or invalid input
htmlToText(""); // ""
htmlToText("<div></div>"); // " "
```
