import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import vm from "node:vm";

const BUILD_DIR = join(process.cwd(), "build/dist");

describe("Build System", () => {
  beforeAll(async () => {
    // Test 1: bun run build does not error out
    await new Promise<void>((resolve, reject) => {
      // Use spawn with shell: false to prevent command injection vulnerabilities
      const buildProcess = spawn("bun", ["run", "build"], {
        stdio: "pipe",
        shell: false,
      });

      buildProcess.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build process exited with code ${code}`));
        }
      });

      buildProcess.on("error", error => {
        reject(new Error(`Build process failed to start: ${error.message}`));
      });
    });
  }, 30000);

  it("should generate .js and .iife.js files", () => {
    // Test 2: .js and .iife.js files are created
    expect(existsSync(join(BUILD_DIR, "html-to-text.js"))).toBe(true);
    expect(existsSync(join(BUILD_DIR, "html-to-text.iife.js"))).toBe(true);
  });

  it("should generate type declarations", () => {
    // Test 3: Type declarations are generated (.d.ts)
    expect(existsSync(join(BUILD_DIR, "index.d.ts"))).toBe(true);
  });

  it("should have working ESM bundle", async () => {
    // Test 4a: ESM bundle works correctly (import)
    const { sum } = await import(join(BUILD_DIR, "html-to-text.js"));
    expect(sum(2, 3)).toBe(5);
  });

  it("should have working IIFE bundle", () => {
    // Test 4b: IIFE bundle works correctly (global variable)
    const iifeContent = readFileSync(
      join(BUILD_DIR, "html-to-text.iife.js"),
      "utf-8"
    );

    const context = { htmlToText: undefined };
    const code = `${iifeContent}; htmlToText`;

    const htmlToText = vm.runInNewContext(code, context);
    expect(htmlToText.sum(2, 3)).toBe(5);
  });
});
