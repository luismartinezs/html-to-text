import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

describe("Package Publishing Configuration", () => {
  describe("package.json configuration", () => {
    it("should not have private field set to true in build package.json", () => {
      const buildPackageJsonPath = join(process.cwd(), "build", "package.json");

      if (!existsSync(buildPackageJsonPath)) {
        throw new Error("Build package.json does not exist. Run build first.");
      }

      const packageJson = JSON.parse(
        readFileSync(buildPackageJsonPath, "utf-8")
      );
      expect(packageJson.private).not.toBe(true);
    });

    it("should have correct exports configuration for ESM and IIFE", () => {
      const buildPackageJsonPath = join(process.cwd(), "build", "package.json");

      if (!existsSync(buildPackageJsonPath)) {
        throw new Error("Build package.json does not exist. Run build first.");
      }

      const packageJson = JSON.parse(
        readFileSync(buildPackageJsonPath, "utf-8")
      );

      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports["."]).toBeDefined();
      expect(packageJson.exports["."].import).toBe("./dist/html-to-text.js");

      // Should also support IIFE access
      expect(
        packageJson.exports["."].browser ||
          packageJson.exports["."].umd ||
          packageJson.exports["."].iife
      ).toBeDefined();
    });

    it("should include TypeScript declarations in exports", () => {
      const buildPackageJsonPath = join(process.cwd(), "build", "package.json");

      if (!existsSync(buildPackageJsonPath)) {
        throw new Error("Build package.json does not exist. Run build first.");
      }

      const packageJson = JSON.parse(
        readFileSync(buildPackageJsonPath, "utf-8")
      );

      expect(packageJson.types).toBe("./dist/index.d.ts");
      expect(packageJson.exports["."].types).toBe("./dist/index.d.ts");
    });
  });
});
