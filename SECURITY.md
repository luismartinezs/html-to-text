# Security Policy

## Security Model

This library is designed with security as a fundamental principle. Our HTML-to-text conversion process is safe by design and prevents common web security vulnerabilities.

## XSS Prevention Through DOM Parsing

### How parse5 Provides Security

The library uses [parse5](https://github.com/inikulin/parse5) for HTML parsing, which provides several security advantages:

- **Spec-compliant parsing**: Follows HTML5 specification for consistent, predictable behavior
- **No script execution**: Parse5 creates a static DOM tree without executing any JavaScript
- **Safe DOM representation**: Converts HTML into a structured object tree for safe traversal

### Input Sanitization Approach

Our security model is based on **text extraction only**:

1. **Parse HTML safely**: Use parse5 to convert HTML string into a DOM tree structure
2. **Extract text content only**: Recursively traverse nodes and extract only text content
3. **Ignore all attributes**: No processing of `href`, `onclick`, `style`, or any other attributes
4. **Ignore script elements**: Scripts and other executable content are completely ignored
5. **Decode entities safely**: Use the `he` library for proper HTML entity decoding

### Safe by Design

```typescript
// ✅ SAFE: Only text content is extracted
htmlToText('<script>alert("xss")</script>Hello World');
// Result: "Hello World" - script content is ignored

// ✅ SAFE: Malicious attributes are ignored
htmlToText('<div onclick="malicious()">Click me</div>');
// Result: "Click me" - onclick attribute is completely ignored

// ✅ SAFE: No innerHTML or DOM manipulation
htmlToText('<img src="x" onerror="alert(1)">');
// Result: "" - img elements with no text content produce empty string
```

### No innerHTML Usage = No XSS Risk

Key security features:

- **No browser DOM**: Never uses `innerHTML`, `outerHTML`, or browser-based parsing
- **Server-side safe**: Works safely in Node.js environments without browser vulnerabilities
- **Static parsing**: No dynamic code execution during HTML processing
- **Content extraction only**: Only extracts text content, never processes or executes HTML

## Supported Attack Vectors

This library is resistant to common HTML-based attacks:

| Attack Type                | Protection                                |
| -------------------------- | ----------------------------------------- |
| XSS (Cross-site scripting) | Scripts are parsed but never executed     |
| HTML injection             | Only text content is extracted            |
| Attribute-based attacks    | All attributes are ignored                |
| Entity-based attacks       | Safe entity decoding with `he` library    |
| Malformed HTML             | parse5 handles malformed input gracefully |

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email security concerns to the maintainers
3. Include a clear description and reproduction steps
4. Allow time for investigation and patching

## Security Best Practices

When using this library:

- ✅ **Safe**: Use for converting any HTML to plain text
- ✅ **Safe**: Process user-generated HTML content
- ✅ **Safe**: Use in server-side applications
- ⚠️ **Consider**: Input validation for extremely large HTML strings (DoS prevention)
- ⚠️ **Consider**: Rate limiting when processing user uploads

## Dependency Security

Our security depends on two well-maintained libraries:

- **parse5**: Mature HTML5 parser with active maintenance and security updates
- **he**: Robust HTML entity decoder with comprehensive entity support

Both dependencies are regularly updated and have good security track records.
