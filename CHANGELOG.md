# Change Log

All notable changes to the "html-to-text" project will be documented in this file, using this format:

## [1.0.0] - 2025-08-26

### Breaking Changes

- **BREAKING**: Complete refactor of htmlToText function - now uses parse5 for proper DOM parsing instead of simple regex
- **BREAKING**: Block-level elements (p, div, h1-h6, li, br, etc.) now convert to line breaks instead of being stripped
- **feat**: Add parseHtml function for accessing raw parsed HTML structure
- **feat**: Integrate parse5 library for HTML5 specification-compliant parsing
- **feat**: Integrate he library for proper HTML entity decoding (supports &nbsp;, &amp;, &lt;, &gt;, &quot;, &#39;, etc.)
- **feat**: Enhanced security through proper DOM parsing - no innerHTML or script execution risks
- **feat**: Add comprehensive security policy documentation
- **feat**: Add architectural decision record (ADR) documenting parse5 choice
- **fix**: Properly handle malformed HTML through spec-compliant parsing
- **fix**: Convert non-breaking spaces to regular spaces
- **fix**: Handle nested block elements correctly

## [0.1.0] - 2025-08-25

- **feat**: Implement core htmlToText function that strips HTML tags from input strings
- **feat**: Add comprehensive CI pipeline with security scanning, linting, testing, and build validation
- **feat**: Add dependabot configuration for automated security updates and dependency management
- **feat**: Add comprehensive test suite covering CI workflow, htmlToText function, and package publishing
- **feat**: Add typecheck scripts and improved development workflow
- **feat**: Configure package exports for ESM, IIFE, and TypeScript definitions
- **feat**: Add PR checklist to ensure code quality and documentation consistency

## [0.0.6] - 2025-08-24

- Fixed build system by converting dts-bundle-generator config to CommonJS (.cjs) format to resolve ESM parsing limitations
