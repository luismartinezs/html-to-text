/**
 * List Formatting Slice
 *
 * Handles conversion of HTML list elements (ul, ol, li) to text format.
 * This slice is responsible for processing list containers and list items,
 * adding proper indentation, bullets for unordered lists, and numbering
 * for ordered lists.
 */

export { ListFormattingHandler } from "./handler";
export { ListFormatter } from "./domain";
export type {
  ListFormattingInput,
  ListFormattingOutput,
  ListContext,
} from "./types";
