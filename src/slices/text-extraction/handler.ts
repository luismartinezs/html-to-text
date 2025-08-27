import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { TextExtractor } from "./domain";

/**
 * Handler for text extraction slice.
 * Implements the slice contract for processing text nodes.
 */
export class TextExtractionHandler implements SliceContract {
  constructor(private extractor: TextExtractor = new TextExtractor()) {}

  /**
   * Determines if this slice can handle the given node
   */
  canHandle(node: Parse5Node): boolean {
    return node.nodeName === "#text";
  }

  /**
   * Handles text node extraction
   *
   * @param node - The text node to process
   * @param _context - Processing context (unused for text nodes)
   * @returns The extracted text content
   */
  handle(node: Parse5Node, _context: ProcessingContext): string {
    if (!this.canHandle(node)) {
      return "";
    }

    const result = this.extractor.extract({ node });
    return result.text;
  }
}
