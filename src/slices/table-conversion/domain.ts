import type {
  TableConversionInput,
  TableConversionOutput,
  TableRow,
  TableCellOutput,
} from "./types";

/**
 * Domain service for converting HTML tables to text format.
 * Handles the core logic of table structure processing and formatting.
 */
export class TableConverter {
  /**
   * Determines if the given tag is a table-related element
   */
  isTableElement(tagName: string): boolean {
    const normalizedTag = tagName.toLowerCase();
    return ["table", "tr", "td", "th"].includes(normalizedTag);
  }

  /**
   * Determines if the given tag is a table container (table)
   */
  isTableContainer(tagName: string): boolean {
    return tagName.toLowerCase() === "table";
  }

  /**
   * Determines if the given tag is a table row (tr)
   */
  isTableRow(tagName: string): boolean {
    return tagName.toLowerCase() === "tr";
  }

  /**
   * Determines if the given tag is a table cell (td or th)
   */
  isTableCell(tagName: string): boolean {
    const normalizedTag = tagName.toLowerCase();
    return ["td", "th"].includes(normalizedTag);
  }

  /**
   * Extracts content from a table cell
   */
  extractCellContent(): TableCellOutput {
    // This will be implemented by the handler using the router
    // The domain just defines the interface
    return { cellContent: "" };
  }

  /**
   * Converts table rows to pipe-delimited text format
   *
   * @param input - The table conversion input containing rows
   * @returns The formatted table text
   */
  convert(input: TableConversionInput): TableConversionOutput {
    const { rows } = input;

    if (!rows.length) {
      return { tableText: "" };
    }

    let result = "";
    for (const row of rows) {
      if (row.cells.length > 0) {
        result += "| " + row.cells.join(" | ") + " |\n";
      }
    }

    return { tableText: result };
  }

  /**
   * Creates an empty table row
   */
  createEmptyRow(): TableRow {
    return { cells: [] };
  }

  /**
   * Adds a cell to a table row
   */
  addCellToRow(row: TableRow, cellContent: string): TableRow {
    return {
      cells: [...row.cells, cellContent],
    };
  }
}
