# Tech Spec: HTML → Plain-text Converter

## Objective

Build a minimal Node.js-compatible library that converts HTML email content into clean plain text for downstream processing or display. See [PRD](./prd.md) for detailed requirements.

## Constraints

- Timebox: ≤ 2 weeks for first release.
- Budget: Minimal, OSS only.
- Infra: Bun runtime with npm publishing target.
- Data: No persistence; stateless.
- Compliance: No PII storage, no external API calls.

## Key Decisions (stack + rationale)

- **Runtime: Bun** — chosen for fast dev loop, but npm publish ensures Node compatibility.
- **Language: TypeScript** — adds type safety with minimal overhead.
- **Package Manager: Bun** — integrated with runtime, simplifies workflows.
- **Build/Packaging: Vite** — provides modern bundling and easy dual-target (CJS/ESM).
- **HTML Parsing: parse5** — spec-compliant, robust against quirks in email HTML.
- **Entity Decoding: he** — covers all HTML entities reliably.
- **Testing: Vitest** — Bun-compatible, fast test runner with good DX.
- **CI: GitHub Actions** — standard for lint, test, publish pipelines.
- **Release: Manual npm publish with npm version** — keeps release process explicit and lightweight.

## Architecture Overview

The library exposes a single synchronous function `htmlToText(html: string): string`. Input is parsed with `parse5` into an AST. The tree is traversed recursively, converting nodes into plain-text fragments. Links are formatted as `[text](URL)` or URL-only. Lists and tables are mapped to text representations with simple Markdown-like syntax. Entities are decoded with `he` before output. The final result is concatenated into a plain-text string. State lives only in the function call stack; no persistent state or global context. Build emits both CJS and ESM bundles. Tests validate representative HTML email fixtures.

## Data Model

- **AST Node**: from parse5, fields include `nodeName:string`, `attrs:[]`, `childNodes:[]`.
- **Output String**: concatenated plain text, no structured model beyond string assembly.
- No persistent entities, indexes, or ownership rules.

## Non-Functional Targets

- P95 latency < 200 ms for email bodies up to 200 KB.
- Max payload size 1 MB.
- Zero external network calls.
- Test coverage ≥ 0.8.
- CI green required before publish.

## Security

- Validate input type before processing.
- No network, no file IO, no secret handling.
- Ensure entity decoding does not execute scripts.
- No multi-tenant risk (stateless function).

## Testing Strategy

- **Unit Tests:** node conversion (links, lists, tables, entities, line breaks).
- **Integration Tests:** run representative HTML email fixtures.
- **Coverage:** ≥ 0.8 across codebase.
- **Fixtures:** golden outputs stored in repo for regression checks.

## Operations

- **Environments:** local dev with Bun; CI via GitHub Actions; prod = npm registry.
- **Build+Deploy:** `bun run build` → outputs bundles; `npm publish` manual release.
- **Rollback:** unpublish npm or republish previous version.
- **Backups:** git repo and npm history.
- **Monitoring:** none; library code.

## Risks & Mitigations

1. **Edge-case HTML emails may break conversion.**
   - Mitigation: collect sample fixtures; add regression tests.
2. **Synchronous parsing may block on very large inputs.**
   - Mitigation: document size limits; optimize parser usage.
3. **Manual release process may introduce human error.**
   - Mitigation: use `npm version` tagging; require CI pass before publish.
