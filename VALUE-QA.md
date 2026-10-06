# Value refinement — visual and functional verification

2026-10-06. Published through the Cloudflare plugin at09:31:09 UTC; deployment etag `eafdf6292f75bb2363c6a1c05b158a0f3519ce7db6f839b97116f9934a40ca48`.

## Design comparison

Fresh built-in Image Gen concepts were generated before implementation for all three changed surfaces: hero, technical explanation and single-screen callback form. Paths: `../research/value-concepts/hero.png`, `technical.png`, `form.png`. The generated floor illustration is a separate production asset; original architectural photos were preserved.

Live screenshots were captured through Browser/IAB, saved under `../research/value-live/`, and inspected directly with view_image alongside all three concept images. The hero and technical viewport were checked at1505×1045, their exact concept dimensions. The mobile form concept is a high-density853×1844 representation; the functioning mobile surface was checked at390×844 with the same aspect ratio. The small phone320×568 was additionally verified.

| Comparison | Evidence | Disposition |
| --- | --- | --- |
| Outcome copy | Hero concept and `01-hero-desktop.png` | Same concrete title “Wieder trocken. Bis zur fertigen Wand.”, explicit service/location, Meisterbetrieb evidence, callback action and user-confirmed reply promise. Mobile supporting sentence is intentionally shorter. |
| Typography | Hero/form concepts, live screenshots and computed CSS | Instrument Serif title plus DM Sans support line. Body18px; large labelled fields. Actual font family verified loaded. Generated bold/uppercase branding was rejected in favour of the existing real wordmark. |
| Palette and photo | Hero concept and live screenshot | White/charcoal/stone retained. Same real photograph, readable left-side contrast shading, explicit Symbolbild caption. No generated project photograph introduced. |
| Technical hierarchy | Technical concept and `02-technical-desktop.png` | Large labelled four-layer principle illustration beside three short expandable explanations. The illustration is labelled as a principle. No numerical readings or fictional monitoring. |
| Annotation and framing | Production floor asset, desktop/mobile render | Leaders and labels checked against the four layers. The insulation leader was adjusted after initially landing too low; tint/blend removed to keep the asset's natural stone background. Mobile labels enlarged to11–12px. |
| Container and responsive spacing | Concept and native/mobile screenshots | Open ruled explanations, no card grid. Existing page margins retained deliberately; service coverage below the illustration, compact cost/completion assurance row above. No horizontal overflow at390/320px. |
| Enquiry effort | Form concept and `04-callback-form.png` | One screen, two required fields, optional situation default Unklar. Original mandatory radio/Weiter step removed. Correct preview disclosure and privacy wording retained instead of the mockup's invented consent language and unrelated postcode. |
| Motion | Live clicks/scroll/keyboard, CSS and JS inspection | Masked finite headline reveal; photo settling and scroll framing; one-time section reveals; native drawer and accordion motion. Contact controls usable immediately. Reduced-motion branches retained; OS preference emulation was not available through IAB. |

Above-fold rendered copy was checked against the refinement brief: headline, service line, local credential, action, phone alternative, reply promise and photo caption. Deliberate deviations from generated mocks: real wordmark and nav, source-backed explanatory wording, shorter mobile deck, accurate privacy/operator disclosure, page margins, and no invented service links/search/project pages.

The chosen refinement was visually checked against its concepts with these documented adaptations. No material accidental clipping, overflow, missing asset or inert primary control remained in the inspected views. This does not claim a measured conversion uplift or that the generated mockup is a pixel-identical source.

## Core flow and published checks

1. Opening — callback action visible on a fresh320×568 page, bottom446.5px; title begins168.7px. Direct calling remains accessible. No overflow.
2. Technical explanation — first/second/third sections open; an expanded section closes through Enter. The actual current paragraph and aria-expanded state change together.
3. Callback — native dialog opens with heading focus. Required fields are exactly phone and postcode. Optional situation default is Unklar. Close/focus return and mobile menu tested.
4. Submission and confirmation — live mobile test entered only synthetic phone/postcode and pressed Enter. D1 saved problem Unklar; notification marked sent with no delivery error. Confirmation reference `E3EBC7BE` appeared with the promised callback and explicit separation from an on-site visit.
5. Email — Resend get-email returned **delivered** to the user's registered Googlemail/Gmail mailbox. Subject `[TEST] Bautrocknung: Unklar · 22529`. Body clearly labels SYSTEMTEST / not a real customer / do not call back, and includes the new response target. Disposable synthetic D1 row deleted after verification; the labelled test email remains as evidence.
6. Browser logs — fresh live session has no error/warning logs. Engineering asset loaded; fonts and18px body confirmed.
7. Worker tests — all seven pass: safe idempotency/retries, validation and foreign-origin rejection, atomic request limits, persistence/mail failure retry, private admin/status update, retention/static security headers, retry-window boundary.

SLA scope: two business hours was explicitly confirmed by the user. It is a human callback promise; email delivery was verified, human callback timing was not. Physical drying duration remains the source-backed1–3/2–4-week guidance rather than being conflated with contact speed.
