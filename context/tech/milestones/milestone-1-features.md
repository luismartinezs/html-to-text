# Milestone 1 Feature Breakdown

**Parent Milestone:** Project Setup & Core Skeleton
**Objective:** Establish development environment and implement basic library structure
**Total Estimate:** 6 features (2-3 scope each) = 1 day total

---

## [x] Feature 1: Development Environment Setup
- **Scope:** 2 (Small, well-understood setup tasks)
- **Description:** Initialize the project foundation with core development tools
- **Tasks:**
  - Initialize Bun project with `bun init`
  - Set up TypeScript configuration (`tsconfig.json`)
  - Install and configure core dependencies (TypeScript, Vite)
  - Create basic project structure (`src/`, `test/`)
- **Acceptance Criteria:**
  - TypeScript compiles without errors
  - Bun can run TypeScript files
  - Project structure matches conventions
- **Dependencies:** None
- **Estimate:** 2-3 hours

---

## [ ] Feature 2: Build System Configuration
- **Scope:** 3 (Medium complexity, dual-bundle setup)
- **Description:** Configure Vite to produce both ESM and IIFE bundles
- **Tasks:**
  - Create `vite.config.ts` with dual-target build
  - Configure build scripts in `package.json`
  - Set up TypeScript declaration generation
  - Test both bundle formats work correctly
- **Acceptance Criteria:**
  - `bun run build` produces both `.js` (ESM) and `.iife.js` files
  - Type declarations (.d.ts) are generated
  - Both bundles work correctly (import for ESM, global variable for IIFE)
- **Dependencies:** Feature 1 (dev environment)
- **Estimate:** 4-6 hours

---

## [ ] Feature 3: CI Pipeline Setup
- **Scope:** 3 (Medium complexity, GitHub Actions workflow)
- **Description:** Create automated CI pipeline for lint, test, and build validation
- **Tasks:**
  - Create `.github/workflows/ci.yml`
  - Configure lint stage (ESLint setup)
  - Configure test stage (Vitest runner)
  - Configure build validation stage
  - Ensure PR checks are automatic
- **Acceptance Criteria:**
  - CI runs automatically on PR creation/updates
  - All stages (lint, test, build) pass
  - Failed checks block PR merge
- **Dependencies:** Feature 2 (build system), Feature 5 (testing)
- **Estimate:** 4-6 hours

---

## [ ] Feature 4: Core Library Structure
- **Scope:** 2 (Simple function structure)
- **Description:** Implement the main library entry point and placeholder function
- **Tasks:**
  - Create `src/index.ts` as main entry point
  - Implement placeholder `htmlToText(html: string): string` function
  - Set up proper TypeScript types and exports
  - Configure path aliases (`@/` for `src/`)
- **Acceptance Criteria:**
  - Function can be imported: `import { htmlToText } from 'html-to-text'`
  - Returns stub response for any input
  - TypeScript types are properly exported
- **Dependencies:** Feature 1 (dev environment)
- **Estimate:** 2-3 hours

---

## [ ] Feature 5: Testing Infrastructure
- **Scope:** 2 (Basic test setup)
- **Description:** Set up Vitest testing framework with initial placeholder tests
- **Tasks:**
  - Install and configure Vitest
  - Create `test/` directory structure
  - Write placeholder unit test for `htmlToText` function
  - Configure test scripts in `package.json`
- **Acceptance Criteria:**
  - `bun test` runs successfully
  - Placeholder test passes
  - Test coverage reporting works
- **Dependencies:** Feature 4 (core library)
- **Estimate:** 2-3 hours

---

## [ ] Feature 6: Package Publishing Setup
- **Scope:** 2 (Package configuration)
- **Description:** Configure package.json for npm publishing and local installation
- **Tasks:**
  - Configure `package.json` exports for ESM + IIFE format
  - Set up proper module resolution
  - Test local package installation (`npm pack` + local install)
  - Verify import/require works from external project
- **Acceptance Criteria:**
  - Package can be installed locally via `npm install ./package.tgz`
  - Both `import` (ESM) and script tag (IIFE) work correctly
  - TypeScript declarations are available to consumers
- **Dependencies:** Feature 2 (build system), Feature 4 (core library)
- **Estimate:** 2-3 hours

---

## Implementation Order

1. **Feature 1** (Dev Environment) → Foundation for everything
2. **Feature 4** (Core Library) → Need function to test/build
3. **Feature 2** (Build System) → Need build for testing CI
4. **Feature 5** (Testing) → Need tests for CI pipeline
5. **Feature 6** (Package Setup) → Verify end-to-end works
6. **Feature 3** (CI Pipeline) → Validate everything together

## Success Metrics
- All 6 features implemented and tested
- `bun run build` produces working ESM + IIFE bundles
- CI pipeline green with all checks passing
- Package installable locally and imports work correctly