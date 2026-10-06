# Cover redesign — final design and live verification

Date: 2026-10-06. Live URL: https://hantke-bautrocknung-preview.ksqsebastian.workers.dev/
Final Cloudflare plugin upload: 08:46:59 UTC, successful, etag `4f041a371a719c6aa23100535ce78bc41680320e9cbd34a136193ace8123753f`.

## Design evidence

User-selected direction: Cover, with actual Mobbin research. Four built-in Image Gen section concepts were produced before coding; these are layout references only and never served as website images. Prompt set and the six current Mobbin links are in DESIGN.md.

Concepts: `../research/cover-concepts/hero.png` (1487×1058), `services.png` (1536×1024), `process.png` (1536×1024), `faq.png` (1487×1058).
Rendered evidence: `../research/cover-live-desktop-native.png`, `cover-live-services.png`, `cover-live-process.png`, `cover-live-faq.png`, `cover-live-mobile.png`, `cover-live-confirmation.png`.

Browser/IAB captured the live page and exercised the actual controls. `view_image` was used on the concept and implementation images directly, covering the hero, services, process and FAQ. No Playwright Chromium fallback was used. The hero was additionally captured at its concept's exact native dimensions, 1487×1058. Desktop1440×1000, mobile390×844 and small-phone320×568 were checked.

## Fidelity ledger

| Comparison point | Concept evidence | Render evidence and disposition |
| --- | --- | --- |
| First viewport | Full photographic background; lower-left two-line serif title; service line and pill action | Same real image, headline and visual hierarchy. Actual responsive crop preserved. Native-size comparison completed. |
| Copy and hierarchy | Hantke, Leistungen / Ablauf / Fragen, Hilfe anfordern; “Ihr Zuhause. Wieder in Ruhe.” | Hero headline, service line and CTA match. Above-fold copy checked against the brief; phone spacing, brand period and discover arrow are deliberate UI refinements. Mobile adds the direct call/menu chrome. No extra sales badges. |
| Typography | Instrument Serif editorial headings, DM Sans readable UI | Self-hosted fonts confirmed loaded through DOM/computed CSS. Desktop hero102px at1440px, body18px; mobile hero57px at390px. The generated process image drifted toward a heavier serif, so the specified Instrument font is consistently used instead. |
| Palette | White, charcoal and stone, neutral photo contrast shading | White #fff, ink #232722, process #f1f0eb and body #60635e confirmed in CSS/render. No orange or mint remaining. |
| Container and spacing | Open editorial sections, ruled lists and steps, no card grid | Photo/text services, three open process columns and ruled FAQ retained. Services use page margins and a slightly narrower image than the generated edge-bleed concept to keep source-backed copy readable; factual credential row adds section height. |
| Asset treatment | Supplied architectural photography | Original real photographs are used, not mockup-generated photos. All three displayed photo instances loaded on the live page. Symbolbild captions are explicit. Mobile image resolution was increased after the initial rendering looked soft. |
| Mobile | Clear action, readable typography, simple hierarchy | 390px and320px layouts have no horizontal overflow. At320×568 the hero help button ends at493px, fully visible. The contact bar appears only after the hero help action exits above the viewport. |
| Motion | Quiet photographic/editorial treatment | Finite image settling, native-scroll parallax/framing, observed section reveals, header transition, drawer and form-step animations, animated native FAQ. No hijacked scroll or loading gate. CSS and JS reduced-motion branches inspected; OS preference emulation was unavailable in IAB. |
| Forms | Two clear steps, one next action | Native accessible dialog, situation radio choices, phone/postcode only, progress state, back/close, focus return and actual confirmation tested. Hidden contact inputs disabled until step2; Enter from the selected first-step option advances successfully. |

Intentional content adaptations: generated health/outcome guarantees and overbroad cost wording were replaced with verified source wording. Added local credentials, phone availability, the habitation FAQ, fuller cost/insurance explanations, Symbolbild captions, and the actual preview/operator disclosure. The footer includes the business address and photo credit. These support the user's requested value equation and preserve the true operational boundaries.

The implementation was visually verified against the chosen Cover direction and the coordinated section concepts, with the listed deliberate adaptations. No accidental overflow, missing primary action, broken image or clipped primary copy remained in the inspected views. This is design verification, not a claim of measured conversion uplift or user taste approval.

## Functional and deployment evidence

- Seven existing Worker tests pass: idempotency, same-origin validation, atomic rate limits, persistence/mail failure retry, private admin and status changes, expiry/static headers, bounded mail retry.
- Live mobile enquiry: selected “Ich bin mir nicht sicher”, synthetic zero telephone, postcode22529. Confirmation reference `78BBBE7E` appeared. D1 stored the request and marked the email sent with no delivery error.
- Resend get-email returned **delivered**, subject `[TEST] Bautrocknung: Unklar · 22529`, to the account-owner Googlemail spelling of the user's Gmail inbox. Email clearly says SYSTEMTEST / no real customer / do not call back.
- Disposable synthetic D1 row removed after verification. The labelled test email remains in the user's inbox as delivery evidence.
- Final fresh browser session had no error/warning logs. The first rollout briefly mixed an old loaded document with the new script; defensive animation initialization was added, and the final fresh session verified the current bundle cleanly.
- Admin login surface verified after typography update; auth/API behavior is covered by existing tests. No credentials are placed in the page or public assets.
- Fonts, photos, CSS and JS are self-hosted. The build embeds14 public assets; no tracking dependency added.

## Operating boundary

This remains a noindex design preview. Real form notifications go to the user's project inbox via Resend, not directly to Hantke. The form and privacy page disclose that. An enquiry is not a booked technician appointment. No instant dispatch, 24/7 availability, pricing guarantee or insurance coverage guarantee is invented.
