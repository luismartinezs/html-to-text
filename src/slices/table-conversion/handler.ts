import type {
  Parse5Node,
  ProcessingContext,
  SliceContract,
} from "../../processing-context";
import { TableConverter } from "./domain";
import { ElementRouter } from "../../element-router";

/**
 * Handler for table conversion slice.
 * Implements the slice contract for processing table, tr, td, and th elements.
 */
export class TableConversionHandler implements SliceContract {
  constructor(
    private converter: TableConverter = new TableConverter(),
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
    return this.converter.isTableElement(node.nodeName);
  }

  /**
   * Handles table element processing
   *
   * @param node - The table element node to process
   * @param context - Processing context
   * @returns The formatted table content
   */
  handle(node: Parse5Node, context: ProcessingContext): string {
    if (!this.canHandle(node) || !node.nodeName) {
      return "";
    }

    const tagName = node.nodeName.toLowerCase();

    // Handle table containers
    if (this.converter.isTableContainer(tagName)) {
      return this.handleTable(node, context);
    }

    // Handle table rows
    if (this.converter.isTableRow(tagName)) {
      return this.handleTableRow(node, context);
    }

    // Handle table cells - these are processed by tr handler
    if (this.converter.isTableCell(tagName)) {
      return this.handleTableCell(node, context);
    }

    return "";
  }

  /**
   * Handles table container elements
   */
  private handleTable(node: Parse5Node, context: ProcessingContext): string {
    let result = "";

    // Process child nodes - let them handle their own formatting
    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        result += this.router.route(child, context);
      }
    }

    return result;
  }

  /**
   * Handles table row elements
   */
  private handleTableRow(node: Parse5Node, context: ProcessingContext): string {
    const cells: string[] = [];

    if (node.childNodes && this.router) {
      for (const child of node.childNodes) {
        if (child.nodeName === "td" || child.nodeName === "th") {
          const cellContent = this.extractCellContent(child, context);
          cells.push(cellContent);
        }
      }
    }

    if (cells.length === 0) {
      return "";
    }

    return "| " + cells.join(" | ") + " |\n";
  }

  /**
   * Handles table cell elements
   */
  private handleTableCell(
    node: Parse5Node,
    context: ProcessingContext
  ): string {
    // Cell content is typically handled by the tr element
    // But we can still process it directly if needed
    return this.extractCellContent(node, context);
  }

  /**
   * Extracts content from a table cell
   */
  private extractCellContent(
    node: Parse5Node,
    context: ProcessingContext
  ): string {
    if (!node.childNodes || !this.router) {
      return "";
    }

    let cellContent = "";
    for (const cellChild of node.childNodes) {
      cellContent += this.router.route(cellChild, context);
    }

    // Clean up the cell content (trim whitespace)
    return cellContent.trim();
  }
}
