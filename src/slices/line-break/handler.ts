import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { LineBreakHandler as LineBreakDomain } from "./domain";

/**
 * Handler for line break slice.
 * Implements the slice contract for processing br elements.
 */
export class LineBreakHandler implements SliceContract {
  constructor(
    private lineBreakDomain: LineBreakDomain = new LineBreakDomain()
  ) {}

  /**
   * Determines if this slice can handle the given node
   */
  canHandle(node: Parse5Node): boolean {
    if (!node.nodeName) return false;
    return this.lineBreakDomain.isLineBreak(node.nodeName);
  }

  /**
   * Handles br element conversion to line break
   *
   * @param node - The br node to process
   * @param _context - Processing context (unused for br elements)
   * @returns The line break character
   */
  handle(node: Parse5Node, _context: ProcessingContext): string {
    if (!this.canHandle(node) || !node.nodeName) {
      return "";
    }

    const result = this.lineBreakDomain.handle({ tagName: node.nodeName });
    return result.lineBreak;
  }
}
