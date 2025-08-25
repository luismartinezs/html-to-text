# Lint Fixes Scratchpad

## Issues Found by `bun run lint:scripts`

### File: test/ci-workflow.test.ts

#### [ ] Issue 1 - Line 20

- **Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
- **Code**: `const workflow = yaml.load(workflowContent) as any;`
- **Proposed Fix**: Create a proper interface for the workflow structure and use type assertion to that interface instead of `any`

#### [ ] Issue 2 - Line 27

- **Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
- **Code**: `const workflow = yaml.load(workflowContent) as any;`
- **Proposed Fix**: Same as Issue 1 - use proper interface

#### [ ] Issue 3 - Line 41

- **Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
- **Code**: `const workflow = yaml.load(workflowContent) as any;`
- **Proposed Fix**: Same as Issue 1 - use proper interface

#### [ ] Issue 4 - Line 55

- **Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
- **Code**: `const workflow = yaml.load(workflowContent) as any;`
- **Proposed Fix**: Same as Issue 1 - use proper interface

#### [ ] Issue 5 - Line 69

- **Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
- **Code**: `const workflow = yaml.load(workflowContent) as any;`
- **Proposed Fix**: Same as Issue 1 - use proper interface

### File: test/package-publishing.test.ts

#### [ ] Issue 6 - Line 14

- **Error**: `A require() style import is forbidden @typescript-eslint/no-require-imports`
- **Code**: `const packageJson = require(buildPackageJsonPath);`
- **Proposed Fix**: Replace with `readFileSync()` + `JSON.parse()` approach

#### [ ] Issue 7 - Line 25

- **Error**: `A require() style import is forbidden @typescript-eslint/no-require-imports`
- **Code**: `const packageJson = require(buildPackageJsonPath);`
- **Proposed Fix**: Replace with `readFileSync()` + `JSON.parse()` approach

#### [ ] Issue 8 - Line 46

- **Error**: `A require() style import is forbidden @typescript-eslint/no-require-imports`
- **Code**: `const packageJson = require(buildPackageJsonPath);`
- **Proposed Fix**: Replace with `readFileSync()` + `JSON.parse()` approach

## Fix Strategy

1. **For ci-workflow.test.ts**: Create a TypeScript interface for the GitHub workflow structure and replace all `as any` with proper typing
2. **For package-publishing.test.ts**: Import `readFileSync` and replace all `require()` calls with `JSON.parse(readFileSync())`

## Status

- [ ] Fix Issue 1-5: Replace `as any` with proper interface
- [ ] Fix Issue 6-8: Replace `require()` with `readFileSync` + `JSON.parse`
- [ ] Run lint to verify all fixes
