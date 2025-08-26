# Minimal Plan: Integrate parse5 for AST Generation

## Overview

Replace stub `parseHtml()` with actual HTML parsing in 3 minimal steps.

## Steps

### 1. Add Dependency

- `bun add parse5`

### 2. Replace Function

- **File:** `src/index.ts:10-12`
- **Change:** `import { parseFragment } from 'parse5'`
- **Replace:** `return {}` → `return parseFragment(html)`

### 3. Fix Tests

- **File:** `test/parseHtml.test.ts:5-21`
- **Change:** Update 3 existing tests to verify AST has `childNodes` property instead of just checking object type

## Validation

- `bun test` - existing tests pass with real AST

This achieves all milestone requirements with minimum scope.
