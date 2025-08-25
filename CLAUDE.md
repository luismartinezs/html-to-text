# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Bash commands

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build the library (compiles TypeScript, runs Vite build, bundles type definitions)
- `bun run typecheck` - Run TypeScript compiler type checking
- `bun run typecheck:watch` - Run TypeScript type checking in watch mode
- `bun test` - Run test suite with Vitest
- `bun run test:coverage` - Run tests with coverage report
- `bun run lint:scripts` - Lint TypeScript files with ESLint
- `bun run format` - Format all files with Prettier and Stylelint
- `bunx vitest run <test-file>` - Run a specific test file
- `bunx vitest --reporter=verbose` - Run tests with detailed output

# Code style

- Use ES modules (import/export) syntax
- Follow strict TypeScript compiler options (noUnusedLocals, noUnusedParameters, etc.)
- Use path aliases: `@/` for `src/`, `@@/` for project root
- Test files use `.test.ts` extension in `test/` directory
- Destructure imports when possible

# Core files

- `src/index.ts` - Main entry point that exports public API
- `vite.config.ts` - Build configuration for ESM and IIFE bundles
- `eslint.config.ts` - ESLint configuration with TypeScript and Prettier integration
- `tsconfig.json` - TypeScript configuration with strict options

# Testing

- Use Vitest framework with built-in TypeScript support
- Prefer running single tests over full test suite during development
- Coverage reports available via `@vitest/coverage-v8`
- Test structure: `describe` blocks with `it` assertions using `expect`

# Workflow

- Run `bun run format` before committing (Husky pre-commit hooks enforce this)
- Check TypeScript compilation with build command after code changes
- Bundle names automatically derive from `package.json` name field

# Build system

- Vite generates both ESM (`.js`) and IIFE (`.iife.js`) formats
- Output goes to `build/dist/` directory
- Type definitions bundled via `dts-bundle-generator`
