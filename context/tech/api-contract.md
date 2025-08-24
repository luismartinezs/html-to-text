# API Contract v1

## Overview

- Boundary type: Library API (synchronous, in-process).
- Single public operation exposed by the package.

## Operations

- **Name:** htmlToText
  - **Purpose:** Convert an HTML email body to clean plain text.
  - **Input:**
    - `html` (string, required, nullable: no): HTML source to convert. Must be ≤ 1,048,576 bytes (1 MB) when UTF-8 encoded.

  - **Output:**
    - `text` (string, required, nullable: no): Plain-text result of the conversion.

  - **Errors:**
    - `INVALID_TYPE` (string): Input is not a string.
    - `MAX_SIZE_EXCEEDED` (string): Input exceeds 1 MB limit.
    - `PARSE_FAILURE` (string): HTML could not be parsed into a tree.
    - `INTERNAL` (string): Unspecified failure during conversion.

  - **Auth/Access:**
    - Not applicable. Library runs in the caller’s process. No authentication.

## Invariants

- Stateless and deterministic: same `html` input yields the same `text` output.
- No network or file I/O occurs during operation.
- No external side effects; memory use is confined to the call stack/heap.
- Maximum accepted input size is 1 MB.
- Entity decoding and parsing never execute scripts.
- Operation completes synchronously within process limits.

## Error Model

- Format: `{ code: string, message: string }`
- Consistent across the operation.
- Enumerated error codes:
  - `INVALID_TYPE`: Input was not of type string.
  - `MAX_SIZE_EXCEEDED`: UTF-8 encoded input exceeds 1 MB.
  - `PARSE_FAILURE`: Input could not be parsed into an AST.
  - `INTERNAL`: Unexpected failure not covered above.

## Examples

### Flow 1: Happy path

#### Request

```json
{
  "html": "<p>Hello <a href=\"https://example.com\">world</a></p>"
}
```

#### Response

```json
{
  "text": "Hello [world](https://example.com)"
}
```

### Flow 2: Error case (invalid type)

#### Request

```json
{
  "html": 12345
}
```

#### Response

```json
{
  "error": {
    "code": "INVALID_TYPE",
    "message": "`html` must be a string"
  }
}
```
