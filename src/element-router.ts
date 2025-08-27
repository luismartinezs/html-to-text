import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "./processing-context";

/**
 * Central element router that dispatches HTML elements to appropriate slice handlers.
 * This implements the routing logic to determine which slice should handle each element type.
 */
export class ElementRouter {
  private sliceHandlers: SliceContract[] = [];

  constructor(sliceHandlers: SliceContract[] = []) {
    this.sliceHandlers = sliceHandlers;
  }

  /**
   * Registers a slice handler with the router
   */
  registerSlice(handler: SliceContract): void {
    this.sliceHandlers.push(handler);
  }

  /**
   * Routes a node to the appropriate slice handler
   * Falls back to generic processing if no specific handler is found
   */
  route(node: Parse5Node, context: ProcessingContext): string {
    if (!node) return "";

    // Find the first handler that can process this node
    for (const handler of this.sliceHandlers) {
      if (handler.canHandle(node)) {
        return handler.handle(node, context);
      }
    }

    // Fallback: generic recursive processing for unhandled elements
    return this.processGenericElement(node, context);
  }

  /**
   * Generic processing for elements that don't have specific handlers
   * Recursively processes child nodes
   */
  private processGenericElement(
    node: Parse5Node,
    context: ProcessingContext
  ): string {
    let result = "";

    // Handle document fragments and other container nodes
    if (node.childNodes && !node.nodeName) {
      for (const child of node.childNodes) {
        result += this.route(child, context);
      }
      return result;
    }

    // Handle element nodes with children
    if (node.nodeName && node.childNodes) {
      for (const child of node.childNodes) {
        result += this.route(child, context);
      }
    }

    return result;
  }

  /**
   * Main entry point for processing a complete HTML fragment
   */
  processFragment(fragment: Parse5Node, context: ProcessingContext): string {
    return this.route(fragment, context);
  }
}
