import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { ListFormatter } from "./domain";
import { ElementRouter } from "../../element-router";

/**
 * Handler for list formatting slice.
 * Implements the slice contract for processing ul, ol, and li elements.
 */
export class ListFormattingHandler implements SliceContract {
  constructor(
    private formatter: ListFormatter = new ListFormatter(),
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
    return this.formatter.isListElement(node.nodeName);
  }

  /**
   * Handles list element processing
   *
   * @param node - The list element node to process
   * @param context - Processing context
   * @returns The formatted list content
   */
  handle(node: Parse5Node, context: ProcessingContext): string {
    if (!this.canHandle(node) || !node.nodeName) {
      return "";
    }

    const tagName = node.nodeName.toLowerCase();

    // Handle list containers (ul, ol)
    if (this.formatter.isListContainer(tagName)) {
      return this.handleListContainer(node, context);
    }

    // Handle list items (li)
    if (this.formatter.isListItem(tagName)) {
      return this.handleListItem(node, context);
    }

    return "";
  }

  /**
   * Handles list container elements (ul, ol)
   */
  private handleListContainer(
    node: Parse5Node,
    context: ProcessingContext
  ): string {
    if (!node.nodeName) return "";

    const tagName = node.nodeName.toLowerCase();
    let result = "";

    // Extract start attribute for ordered lists
    const startAttr = node.attrs?.find(attr => attr.name === "start");
    const startValue = startAttr ? parseInt(startAttr.value, 10) || 1 : 1;

    // Create list context
    const listContext = this.formatter.createListContext(
      tagName,
      context.depth,
      startValue
    );
    let currentCounter = startValue;

    // Process child nodes with list context
    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        if (child.nodeName === "li") {
          // Create updated context for this item
          const itemContext: ProcessingContext = {
            ...context,
            inList: true,
            listContext: {
              type: listContext.type,
              depth: listContext.depth,
              counter: currentCounter,
            },
          };

          const childContent = this.router.route(child, itemContext);
          result += childContent;

          // Increment counter for ordered lists
          if (listContext.type === "ol") {
            currentCounter++;
          }
        } else {
          // Non-li children (like nested lists)
          const childContent = this.router.route(child, {
            ...context,
            depth: context.depth + 1,
            inList: true,
          });
          result += childContent;
        }
      }
    }

    return result;
  }

  /**
   * Handles list item elements (li)
   */
  private handleListItem(node: Parse5Node, context: ProcessingContext): string {
    if (!context.inList || !context.listContext) {
      // If not in a list context, treat as regular block element
      return this.handleAsRegularElement(node, context);
    }

    const indent = "  ".repeat(context.depth);
    let result = "";

    // Add list marker
    if (context.listContext.type === "ul") {
      result += `${indent}* `;
    } else {
      result += `${indent}${context.listContext.counter}. `;
    }

    let hasNestedList = false;

    // Process child nodes
    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        if (child.nodeName === "ul" || child.nodeName === "ol") {
          hasNestedList = true;
          result += "\n";
          result += this.router.route(child, {
            ...context,
            depth: context.depth + 1,
            inList: true,
          });
        } else {
          result += this.router.route(child, context);
        }
      }
    }

    // Only add newline if no nested list
    if (!hasNestedList) {
      result += "\n";
    }

    return result;
  }

  /**
   * Handles li elements that are not in a list context
   */
  private handleAsRegularElement(
    node: Parse5Node,
    context: ProcessingContext
  ): string {
    let result = "";

    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        result += this.router.route(child, context);
      }
    }

    // Add newline for li elements that are not in list context
    return result + "\n";
  }
}
