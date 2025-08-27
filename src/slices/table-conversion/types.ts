/**
 * Represents a single table row with its cells
 */
export interface TableRow {
  /** Array of cell content strings */
  cells: string[];
}

/**
 * Input for table conversion operations
 */
export interface TableConversionInput {
  /** Array of table rows to convert */
  rows: TableRow[];
}

/**
 * Output from table conversion operations
 */
export interface TableConversionOutput {
  /** The converted table as pipe-delimited text */
  tableText: string;
}

/**
 * Input for table cell extraction
 */
export interface TableCellInput {
  /** The table cell node (td or th) */
  node: any; // Parse5Node type
  /** Processing context */
  context: any; // ProcessingContext type
}

/**
 * Output from table cell extraction
 */
export interface TableCellOutput {
  /** The extracted cell content */
  cellContent: string;
}
