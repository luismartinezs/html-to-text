Security-by-design. Prioritize controls by risk: Critical → High → Important.

# Core principles

Defense in depth. Least privilege. Separation of duties. Fail securely. Use OWASP, CWE, NIST CSF as compass. Integrate security into the SDLC (DevSecOps).

# Critical — do first

- **Validate and reject** all untrusted input on the server. Prefer allow-lists. Sanitize only when needed.
- **Block injection**:
  - **SQLi:** Parameterized queries everywhere. No dynamic SQL concatenation.
  - **XSS:** Context-aware output encoding. Add a strict **CSP**.

# High — secure core mechanisms

- **Authentication:** Never store plaintext passwords. Hash with **Argon2**, **bcrypt**, or **PBKDF2** with salt and proper work factors. Require **MFA**.
- **Authorization:** Enforce checks on every request. Start with **RBAC**; move to **ABAC** for fine-grained, context-aware rules. Apply least privilege.
- **Sessions:** Generate IDs with a **CSPRNG** (≥128-bit entropy). Rotate on login/privilege change. Set cookies **Secure**, **HttpOnly**, **SameSite**. Add idle and absolute timeouts.

# Important — operational resilience

- **Crypto:** TLS **1.2+** (prefer 1.3). Strong ciphers. **HSTS**. Encrypt sensitive data at rest. Manage keys in a vault. Never hard-code secrets. Use CSPRNG for keys/tokens.
- **Errors and logging:** Show generic user errors. Log security-relevant events centrally. Exclude secrets/PII from logs. Protect logs from tampering and restrict access.

# Implementation plan

- **Adopt standards:** Use **OWASP Top 10** for focus, **OWASP ASVS** for verification levels, **CWE** to fix root causes, **NIST CSF** for org-level alignment.
- **Embed in SSDLC:** Threat model in design. Secure code guidelines and reviews. Security tests in CI. Release gates on passing checks.
- **Automate:** Run **SAST**, **DAST**, and **secret scanning** on every change. Track findings by CWE. Fail builds on Critical/High issues.

# Failure patterns to avoid

Trusting client-side validation. Dynamic SQL. Verbose errors/stack traces to users. Reusing TLS private keys. Logging secrets. Role explosion without a policy model.

# Outcome

Apply the tiers in order. You cut the attack surface fast, harden identity and access, and ensure resilient operations while you iterate.
