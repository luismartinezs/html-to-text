import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";

export { sum } from "./sum";

/**
 * Converts HTML content to plain text by parsing the HTML structure,
 * extracting text content, and decoding HTML entities.
 *
 * @param html - The HTML string to convert to plain text
 * @returns The extracted plain text with normalized whitespace
 *
 * @example
 * ```typescript
 * const html = '<div><p>Hello <strong>world</strong>!</p><br><p>How are you?</p></div>';
 * const text = htmlToText(html);
 * console.log(text); // "Hello world!\n\nHow are you?\n\n"
 * ```
 */
export function htmlToText(html: string): string {
  if (!html) return "";

  // Parse HTML using parse5 to create DOM tree
  const fragment = parseFragment(html);

  // Recursively extract text content from the DOM tree
  const text = extractTextFromNode(fragment);

  // Decode HTML entities and normalize non-breaking spaces
  const decoded = decode(text);
  return decoded.replace(/\u00A0/g, " ") || "";
}

interface Parse5Node {
  nodeName?: string;
  value?: string;
  childNodes?: Parse5Node[];
  attrs?: { name: string; value: string }[];
}

function extractTextFromNode(node: Parse5Node): string {
  let result = "";

  if (!node) return result;

  // Handle text nodes
  if (node.nodeName === "#text") {
    return node.value || "";
  }

  // Handle element nodes
  if (node.nodeName && node.childNodes) {
    const tagName = node.nodeName.toLowerCase();

    // Add line break before block elements
    const blockElements = [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "section",
      "article",
      "header",
      "footer",
      "main",
      "aside",
      "nav",
    ];
    const shouldAddLineBreak = blockElements.includes(tagName);

    if (shouldAddLineBreak && result.length > 0) {
      result += "\n";
    }

    // Special handling for br tags
    if (tagName === "br") {
      result += "\n";
    }

    // Special handling for anchor tags
    if (tagName === "a") {
      const href = node.attrs?.find(attr => attr.name === "href")?.value;

      // Extract text content from child nodes
      let textContent = "";
      if (node.childNodes) {
        for (const child of node.childNodes) {
          textContent += extractTextFromNode(child);
        }
      }

      if (href && textContent.trim()) {
        // Link with text content: [text](href)
        result += `[${textContent}](${href})`;
      } else if (href && !textContent.trim()) {
        // Link without text content: just href
        result += href;
      } else {
        // No href: just text content
        result += textContent;
      }

      return result;
    }

    // Recursively process child nodes
    if (node.childNodes) {
      for (const child of node.childNodes) {
        result += extractTextFromNode(child);
      }
    }

    // Add line break after block elements
    if (shouldAddLineBreak) {
      result += "\n";
    }
  }

  // Handle document fragments and other node types with childNodes
  if (node.childNodes && !node.nodeName) {
    for (const child of node.childNodes) {
      result += extractTextFromNode(child);
    }
  }

  return result;
}

/**
 * Parses HTML content into a structured document fragment object using parse5.
 * This provides access to the raw parsed HTML structure for advanced use cases.
 *
 * @param html - The HTML string to parse
 * @returns The parsed document fragment object containing the HTML structure
 *
 * @example
 * ```typescript
 * const html = '<div><p>Hello world</p></div>';
 * const fragment = parseHtml(html);
 * console.log(fragment); // Parse5 document fragment with childNodes array
 * ```
 */
export function parseHtml(html: string): object {
  return parseFragment(html);
}
