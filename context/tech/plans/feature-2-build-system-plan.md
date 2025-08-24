# Feature 2: Build System Configuration - Simplified Implementation Plan

## Problem Statement

The current build system has a critical configuration issue preventing proper TypeScript declaration generation. The `dts-bundle-generator.config.ts` uses ESM syntax but the tool only supports CommonJS configuration files, causing build failures.

## Root Cause

Investigation revealed that `dts-bundle-generator` **only supports CommonJS config files**, not ESM. The build system is otherwise 99% functional and just needs this compatibility fix.

## Minimal Solution (15 minutes total)

### [x] Step 1: Fix Configuration (5 minutes)
**Task:** Revert `dts-bundle-generator.config.ts` to use CommonJS syntax
**Action:** Change `export default config;` back to `module.exports = config;`
**Rationale:** Tool limitation - dts-bundle-generator cannot parse ESM configs

### [x] Step 2: Test Build Process (5 minutes)
**Task:** Verify build completes successfully
**Action:** Run `bun run build` command
**Expected Output:**
- `build/dist/html-to-text.js` (ESM bundle)
- `build/dist/html-to-text.iife.js` (IIFE bundle)
- `build/dist/index.d.ts` (TypeScript declarations)
- `build/dist/html-to-text.css` (styles)

### [x] Step 3: Validate Bundle Functionality (5 minutes)
**ESM Test:**
```javascript
import { sum } from './build/dist/html-to-text.js';
console.log(sum(2, 3)); // Should output: 5
```

**IIFE Test:**
```html
<script src="./build/dist/html-to-text.iife.js"></script>
<script>console.log(window.htmlToText.sum(2, 3));</script>
```

**TypeScript Test:** Verify import provides proper type inference

## Acceptance Criteria

1. ✅ `bun run build` completes without errors
2. ✅ All four expected files generated in `build/dist/`
3. ✅ ESM import works correctly
4. ✅ IIFE global variable access works
5. ✅ TypeScript declarations provide proper types

## What We're NOT Doing

- ❌ No package.json exports changes (current configuration works fine)
- ❌ No comprehensive test suite creation
- ❌ No documentation updates
- ❌ No complex multi-phase implementation
- ❌ No switching to alternative tools (vite-plugin-dts, etc.)

## Success Metrics

- **Time to completion:** < 15 minutes
- **Build time:** Remains under 30 seconds
- **Bundle functionality:** Both ESM and IIFE formats work correctly
- **Type safety:** TypeScript declarations generated and functional

## Risk Assessment: LOW

The current build system architecture is solid. This is purely a configuration compatibility fix, not a structural change.