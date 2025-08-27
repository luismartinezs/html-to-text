import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { BlockFormatter } from "./domain";
import { ElementRouter } from "../../element-router";

/**
 * Handler for block formatting slice.
 * Implements the slice contract for processing block-level elements.
 */
export class BlockFormattingHandler implements SliceContract {
  constructor(
    private formatter: BlockFormatter = new BlockFormatter(),
    private router?: ElementRouter
  ) {}

  /**
   * Sets the router reference for processing child nodes
   */
  setRouter(router: ElementRouter): void {
    this.router = router;
  }

  /**
   * Determines if this slice can handle the given node
   */
  canHandle(node: Parse5Node): boolean {
    if (!node.nodeName) return false;
    return this.formatter.isBlockElement(node.nodeName);
  }

  /**
   * Handles block element formatting
   *
   * @param node - The block element node to process
   * @param context - Processing context
   * @returns The formatted content with proper spacing
   */
  handle(node: Parse5Node, context: ProcessingContext): string {
    if (!this.canHandle(node) || !node.nodeName) {
      return "";
    }

    let result = "";
    const tagName = node.nodeName.toLowerCase();

    // Process opening of block element
    const openingFormatted = this.formatter.format({
      tagName,
      content: "",
      isStart: true,
      hasExistingContent: result.length > 0,
    });
    result += openingFormatted.formattedContent;

    // Process child nodes
    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        const childContent = this.router.route(child, context);

        // Format child content considering if we have existing content
        const childFormatted = this.formatter.format({
          tagName,
          content: childContent,
          isStart: true,
          hasExistingContent: result.length > 0,
        });
        result += childFormatted.formattedContent;
      }
    }

    // Process closing of block element
    const closingFormatted = this.formatter.format({
      tagName,
      content: "",
      isStart: false,
      hasExistingContent: true,
    });
    result += closingFormatted.formattedContent;

    return result;
  }
}
