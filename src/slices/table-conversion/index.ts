/**
 * Table Conversion Slice
 *
 * Handles conversion of HTML table elements (table, tr, td, th) to text format.
 * This slice is responsible for processing table structures and converting them
 * to pipe-delimited text format with proper row and column organization.
 */

export { TableConversionHandler } from "./handler";
export { TableConverter } from "./domain";
export type {
  TableConversionInput,
  TableConversionOutput,
  TableRow,
  TableCellInput,
  TableCellOutput,
} from "./types";
