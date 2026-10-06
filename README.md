# Hantke Bautrocknung

Premium, mobile-first website preview, independently deployed to:

https://hantke-bautrocknung-preview.ksqsebastian.workers.dev

## Run

Node 22+ for the app build; Node 25 was used for SQLite-backed tests. No npm dependencies.

```
npm run dev
npm run build
npm test
```

The static local preview runs at http://127.0.0.1:4317. The local static server does not emulate the Cloudflare enquiry API; test submission on the live Worker or use Wrangler with a local D1 instance.

## Live enquiry pipeline

Browser → validated Worker endpoint → EU-jurisdiction D1 → Resend → project inbox.

- Actual requests are durably saved before mail is attempted.
- Resend idempotency keys prevent duplicate sends within the provider's 24-hour window.
- Pending notifications retry every 15 minutes for up to 24 hours; older pending requests remain available in the private inbox for manual investigation.
- Scheduled cleanup removes D1 requests after 90 days. Gmail copies require separate mailbox deletion.
- Same-origin checks, a honeypot, an atomic three-requests-per-IP-hash-per-hour limit and server-side validation guard the form.
- Admin API requires a 256-bit bearer secret. Browser uses sessionStorage only. No lead data is public.
- Client never claims a technician appointment is confirmed. No verified calendar/dispatch integration exists.

The recipient uses the Resend account's registered `ksqsebastian@googlemail.com` alias. Google confirms this is the same inbox as `ksqsebastian@gmail.com`: https://support.google.com/mail/answer/10313

This Resend account has no verified sending domain. The preview therefore uses `onboarding@resend.dev` and can deliver only to the account owner's registered address. A branded sender and other recipients require a verified domain.

## Dashboard

https://hantke-bautrocknung-preview.ksqsebastian.workers.dev/admin

The access key is saved locally in `.secrets-admin` (mode 0600, gitignored). Do not commit or share it. Production bindings `ADMIN_TOKEN` and `RESEND_API_KEY` are encrypted Cloudflare secrets, not client assets. The email credential is restricted to sending.

## Deployment

Deployed through the Cloudflare plugin/API with a separate Worker and a new EU D1 database. `wrangler.jsonc` records the reproducible non-secret configuration. `npm run build` embeds all public assets into `dist/worker.mjs`; no external font, image or analytics fetches occur at runtime. Deployment tooling must preserve existing secrets, or provide them through secure bindings.

The D1 schema is in `schema.sql`.

## Research and editorial boundaries

See DESIGN.md for actual Mobbin references, source facts, rejected patterns and the value equation. The concept image is a local layout reference only and is not served on the website. The site uses a real Unsplash interior photo as a labelled symbol image, and an original code-native explanatory diagram. No generated people, synthetic project photos, fake ratings or fake availability.

This is a noindex design preview. Brand/service facts come from the Hantke source page, while form submissions go to the user's project inbox. The form and privacy page disclose that distinction. Review the operator's legal details before turning the preview into the business's production site.
