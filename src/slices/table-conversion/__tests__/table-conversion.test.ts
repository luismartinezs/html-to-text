import { describe, it, expect } from "vitest";
import { TableConverter } from "../domain";
import { TableConversionHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";
import type { TableRow } from "../types";

describe("TableConverter", () => {
  const converter = new TableConverter();

  describe("isTableElement", () => {
    it("should return true for table elements", () => {
      expect(converter.isTableElement("table")).toBe(true);
    });

    it("should return true for tr elements", () => {
      expect(converter.isTableElement("tr")).toBe(true);
    });

    it("should return true for td elements", () => {
      expect(converter.isTableElement("td")).toBe(true);
    });

    it("should return true for th elements", () => {
      expect(converter.isTableElement("th")).toBe(true);
    });

    it("should handle case insensitive tag names", () => {
      expect(converter.isTableElement("TABLE")).toBe(true);
      expect(converter.isTableElement("TR")).toBe(true);
      expect(converter.isTableElement("TD")).toBe(true);
      expect(converter.isTableElement("TH")).toBe(true);
    });

    it("should return false for non-table elements", () => {
      expect(converter.isTableElement("div")).toBe(false);
      expect(converter.isTableElement("p")).toBe(false);
      expect(converter.isTableElement("span")).toBe(false);
    });
  });

  describe("isTableContainer", () => {
    it("should return true for table elements", () => {
      expect(converter.isTableContainer("table")).toBe(true);
    });

    it("should return false for non-table container elements", () => {
      expect(converter.isTableContainer("tr")).toBe(false);
      expect(converter.isTableContainer("td")).toBe(false);
      expect(converter.isTableContainer("div")).toBe(false);
    });
  });

  describe("isTableRow", () => {
    it("should return true for tr elements", () => {
      expect(converter.isTableRow("tr")).toBe(true);
    });

    it("should return false for non-tr elements", () => {
      expect(converter.isTableRow("table")).toBe(false);
      expect(converter.isTableRow("td")).toBe(false);
      expect(converter.isTableRow("div")).toBe(false);
    });
  });

  describe("isTableCell", () => {
    it("should return true for td elements", () => {
      expect(converter.isTableCell("td")).toBe(true);
    });

    it("should return true for th elements", () => {
      expect(converter.isTableCell("th")).toBe(true);
    });

    it("should return false for non-cell elements", () => {
      expect(converter.isTableCell("table")).toBe(false);
      expect(converter.isTableCell("tr")).toBe(false);
      expect(converter.isTableCell("div")).toBe(false);
    });
  });

  describe("convert", () => {
    it("should convert simple table rows to pipe format", () => {
      const rows: TableRow[] = [
        { cells: ["Name", "Age", "City"] },
        { cells: ["John", "30", "NYC"] },
        { cells: ["Jane", "25", "LA"] },
      ];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe(
        "| Name | Age | City |\n" +
          "| John | 30 | NYC |\n" +
          "| Jane | 25 | LA |\n"
      );
    });

    it("should handle empty rows", () => {
      const rows: TableRow[] = [];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe("");
    });

    it("should handle rows with empty cells", () => {
      const rows: TableRow[] = [
        { cells: ["A", "", "C"] },
        { cells: ["", "B", ""] },
      ];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe("| A |  | C |\n" + "|  | B |  |\n");
    });

    it("should handle single row", () => {
      const rows: TableRow[] = [{ cells: ["Single", "Row"] }];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe("| Single | Row |\n");
    });

    it("should handle single cell", () => {
      const rows: TableRow[] = [{ cells: ["OnlyCell"] }];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe("| OnlyCell |\n");
    });

    it("should skip rows with no cells", () => {
      const rows: TableRow[] = [
        { cells: ["A", "B"] },
        { cells: [] },
        { cells: ["C", "D"] },
      ];

      const result = converter.convert({ rows });
      expect(result.tableText).toBe("| A | B |\n" + "| C | D |\n");
    });
  });

  describe("createEmptyRow", () => {
    it("should create an empty row", () => {
      const row = converter.createEmptyRow();
      expect(row).toEqual({ cells: [] });
    });
  });

  describe("addCellToRow", () => {
    it("should add a cell to an empty row", () => {
      const emptyRow = converter.createEmptyRow();
      const updatedRow = converter.addCellToRow(emptyRow, "Cell1");

      expect(updatedRow).toEqual({ cells: ["Cell1"] });
      expect(emptyRow.cells).toEqual([]); // Original should not be modified
    });

    it("should add a cell to an existing row", () => {
      const existingRow: TableRow = { cells: ["A", "B"] };
      const updatedRow = converter.addCellToRow(existingRow, "C");

      expect(updatedRow).toEqual({ cells: ["A", "B", "C"] });
      expect(existingRow.cells).toEqual(["A", "B"]); // Original should not be modified
    });
  });
});

describe("TableConversionHandler", () => {
  const handler = new TableConversionHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for table elements", () => {
      const tableNode: Parse5Node = {
        nodeName: "table",
      };

      expect(handler.canHandle(tableNode)).toBe(true);
    });

    it("should return true for tr elements", () => {
      const trNode: Parse5Node = {
        nodeName: "tr",
      };

      expect(handler.canHandle(trNode)).toBe(true);
    });

    it("should return true for td elements", () => {
      const tdNode: Parse5Node = {
        nodeName: "td",
      };

      expect(handler.canHandle(tdNode)).toBe(true);
    });

    it("should return true for th elements", () => {
      const thNode: Parse5Node = {
        nodeName: "th",
      };

      expect(handler.canHandle(thNode)).toBe(true);
    });

    it("should return false for non-table elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(divNode)).toBe(false);
    });

    it("should return false for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      expect(handler.canHandle(fragmentNode)).toBe(false);
    });
  });

  describe("handle", () => {
    it("should return empty string for non-table elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      const result = handler.handle(divNode, context);
      expect(result).toBe("");
    });

    it("should return empty string for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      const result = handler.handle(fragmentNode, context);
      expect(result).toBe("");
    });

    it("should handle empty table elements", () => {
      const tableNode: Parse5Node = {
        nodeName: "table",
        childNodes: [],
      };

      const result = handler.handle(tableNode, context);
      expect(result).toBe("");
    });

    it("should handle empty tr elements", () => {
      const trNode: Parse5Node = {
        nodeName: "tr",
        childNodes: [],
      };

      const result = handler.handle(trNode, context);
      expect(result).toBe("");
    });

    it("should handle td elements without router", () => {
      const tdNode: Parse5Node = {
        nodeName: "td",
        childNodes: [],
      };

      const result = handler.handle(tdNode, context);
      expect(result).toBe("");
    });

    it("should handle th elements without router", () => {
      const thNode: Parse5Node = {
        nodeName: "th",
        childNodes: [],
      };

      const result = handler.handle(thNode, context);
      expect(result).toBe("");
    });
  });
});
