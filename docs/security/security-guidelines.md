# Security Principles and Guidelines

## 1. Authentication & Session Management

- **Password Hashing**: Always hash user credentials using **Argon2id** (`argon2`), the current winner of the Password Hashing Competition, with high memory and iteration parameters. Never use MD5, SHA-1, or plain bcrypt for new systems.
- **Stateless Access Tokens**: Use short-lived JSON Web Tokens (e.g. 15-minute expiration) signed using cryptographic secrets (`JWT_ACCESS_SECRET`).
- **Secure Refresh Token Rotation**: Refresh tokens must have limited lifespans (e.g. 7 days), be stored hashed in the database, and be rotated upon each refresh invocation to detect token theft.
- **Secret Generation**: Production secrets must be cryptographically random strings generated via:
  ```bash
  openssl rand -base64 32
  ```

## 2. Authorization & Multi-Tenant Data Isolation

- **Tenant Scoping**: Every database query touching workspace resources (tasks, projects, documents, comments) must explicitly filter on `workspaceId`.
- **Role-Based Access Control (RBAC)**: Enforce granular role gates (Owner, Admin, Member, Guest) at the controller and service boundaries.
- **IDOR Prevention**: Always verify that the authenticated user possesses explicit membership within the target workspace before fulfilling entity mutations or reads.

## 3. Network and Transport Security

- **HTTP Security Headers**: Enforce strict security headers using `helmet` on NestJS:
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS)
- **CORS Whitelisting**: Never configure `Access-Control-Allow-Origin: *` in production when credentials are included. Restrict origins strictly to verified frontend domains.
- **Rate Limiting**: Protect authentication endpoints (login, register, forgot password) against brute-force attacks using `@nestjs/throttler` backed by Redis storage.

## 4. Input Validation & Data Sanitization

- **Class Validator & Transformer**: All incoming REST payloads must pass strict DTO validation pipes before reaching controllers.
- **Zod Shared Validation**: Schema validation executed on both the React frontend and NestJS backend via `@projectflow/validation`.
- **SQL Injection Prevention**: Drizzle ORM uses parameterized queries exclusively. Raw SQL queries must never concatenate unescaped user inputs.
- **XSS Sanitization**: User markdown and rich-text document inputs must be sanitized using DOMPurify before rendering in the browser.

## 5. Cloud Storage and Media Security

- **Presigned URLs**: Keep Amazon S3 buckets completely private (block all public read/write access). Grant time-limited presigned PUT/GET URLs generated server-side.
- **File Type & Size Verification**: Enforce strict MIME type validation and file size restrictions both on presigned URL generation and background media processing.
