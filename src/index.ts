import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";
import { ElementRouter } from "./element-router";
import { createDefaultContext } from "./processing-context";

// Import all slice handlers
import { TextExtractionHandler } from "./slices/text-extraction";
import { LinkConversionHandler } from "./slices/link-conversion";
import { BlockFormattingHandler } from "./slices/block-formatting";
import { LineBreakHandler } from "./slices/line-break";
import { ListFormattingHandler } from "./slices/list-formatting";
import { TableConversionHandler } from "./slices/table-conversion";

export { sum } from "./sum";

// Create slice instances
const textExtractionHandler = new TextExtractionHandler();
const linkConversionHandler = new LinkConversionHandler();
const blockFormattingHandler = new BlockFormattingHandler();
const lineBreakHandler = new LineBreakHandler();
const listFormattingHandler = new ListFormattingHandler();
const tableConversionHandler = new TableConversionHandler();

// Create router and register all slices
// Order matters: more specific handlers should come before more general ones
const router = new ElementRouter([
  textExtractionHandler,
  linkConversionHandler,
  lineBreakHandler,
  listFormattingHandler, // List handler must come before block handler
  tableConversionHandler,
  blockFormattingHandler, // Block handler should come last as it's most general
]);

// Set router references for slices that need to process child nodes
linkConversionHandler.setRouter(router);
blockFormattingHandler.setRouter(router);
listFormattingHandler.setRouter(router);
tableConversionHandler.setRouter(router);

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

  // Create processing context
  const context = createDefaultContext();

  // Use ElementRouter to process the DOM tree with vertical slices
  const text = router.processFragment(fragment, context);

  // Decode HTML entities and normalize non-breaking spaces
  const decoded = decode(text);
  return decoded.replace(/\u00A0/g, " ") || "";
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
