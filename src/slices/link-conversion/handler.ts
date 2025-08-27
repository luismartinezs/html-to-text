import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { LinkConverter } from "./domain";
import { ElementRouter } from "../../element-router";

/**
 * Handler for link conversion slice.
 * Implements the slice contract for processing anchor elements.
 */
export class LinkConversionHandler implements SliceContract {
  constructor(
    private converter: LinkConverter = new LinkConverter(),
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
    return node.nodeName === "a";
  }

  /**
   * Handles anchor element conversion to markdown format
   *
   * @param node - The anchor node to process
   * @param context - Processing context
   * @returns The converted link in markdown format or plain text
   */
  handle(node: Parse5Node, context: ProcessingContext): string {
    if (!this.canHandle(node)) {
      return "";
    }

    // Extract href attribute
    const href = node.attrs?.find(attr => attr.name === "href")?.value;

    // Extract text content from child nodes
    let textContent = "";
    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        textContent += this.router.route(child, context);
      }
    }

    // Convert the link
    const result = this.converter.convert({ href, textContent });
    return result.convertedLink;
  }
}
