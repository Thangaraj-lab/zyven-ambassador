# ZYVEN Security Architecture & Controls

## 1. IDOR Protection
- Ambassador can only review submissions to tasks where `tasks.created_by = auth.uid()`.
- Students can only view and update their own submissions.
- Storage buckets reject cross-tenant file downloads.

## 2. Row Level Security (RLS)
- Enabled across 100% of application tables.
- No `USING (true)` or `WITH CHECK (true)` on sensitive mutation operations.
- Admin bypass functions (`is_admin()`) execute via `SECURITY DEFINER`.

## 3. Storage Security
- Bucket `proofs` is private.
- Files accessed strictly via short-lived signed URLs.
- MIME type and size limits enforced during upload.

## 4. Rate Limiting & Bot Protection
- Sliding window rate limiting applied to auth mutations, task submissions, and point adjustments.
- Cloudflare Turnstile token validation integrated for signup and authentication.

## 5. Security Headers
Configured via `src/proxy.ts` (Next.js 16 proxy convention):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
