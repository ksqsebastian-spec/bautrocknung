# Guided B2C enquiry refinement — 6 October 2026

The user asked for an authored interface informed by real Mobbin UI and by the three linked repositories. This refinement retains the selected Cover-inspired identity while replacing passive reassurance with optional, useful guidance.

## Repository inspection

- [Impeccable](https://github.com/pbakaus/impeccable): read the current README, `.agents/skills/impeccable/SKILL.md`, `reference/craft-floor.md` and `reference/onboard.md`. Applied product-truth separation, fewer generic containers, meaningful choice states, clear next actions and context before asking for contact details. Its launcher/hooks were not installed or run; this is source-guided design work, not a claim that its automated detector ran.
- [Agent-Reach](https://github.com/Panniantong/Agent-Reach): inspected the README, capability routing and installation boundaries. It is research-access infrastructure, not a UI kit. Existing browsing and connected Mobbin tools already provided the necessary access; no browser-cookie access, new authentication or system installation was needed.
- [Ponytail](https://github.com/DietrichGebert/ponytail): read README and `skills/ponytail/SKILL.md`. Applied its native-platform-first approach: existing HTML dialog, radio controls, select, form validation, CSS and a small shared state function. No new dependencies or parallel implementations of the email/backend pipeline.

## Actual Mobbin research

Eleven successful current-session plugin calls searched web/iOS flows, individual screens and website sections. Returned previews were visually inspected, including irrelevant results. Full returned metadata is saved at `../research/journey/mobbin-results.json`. Selected high-resolution references were also saved and inspected. None is used as a website asset.

| Reference | Pattern used | Boundary |
| --- | --- | --- |
| [Angi: starting a project](https://mobbin.com/flows/a182469e-a3a7-42d8-bb55-d1225713a4b6) | Plain-language situation choices, native radio selection and clear field purpose | Four voluntary choices; omit its long qualification and purchase sequence |
| [Square: booking an appointment](https://mobbin.com/flows/6992da62-212e-4947-991d-588142829394) | Retained summary beside/above contact details and explicit next steps after submission | No invented available slots, price, payment or sign-in |
| [Airtasker: selecting a package](https://mobbin.com/flows/e103ed67-553b-4e0c-a23f-ef0948f30904) | Explain what happens after an enquiry before commitment | No marketplace comparison, compulsory message or upsell |
| [Urban Company: requirements](https://mobbin.com/screens/685267da-5db1-4bec-a871-6c7ae342a5d4) | Progressive disclosure and a persistent primary action | No subscription/package complexity |
| [YLLW: your needs](https://mobbin.com/sites/sections/a2aa1c5d-223c-474d-8fa2-057e94fa2739) | Restrained ruled stages and an architectural service tone | Use sourced service facts rather than its furniture offer |
| [Selfridges: appointment flow](https://mobbin.com/flows/e5cf516c-6b42-4bb9-b0c2-291623dc0124) | Calm typography, request context and explicit confirmation | No four-stage wizard for a two-field callback |
| [Zocdoc: booking](https://mobbin.com/flows/fcd6461e-af19-4ca9-9864-8b21c286888c) | Editable contextual details and clear validation | No medical-style personal data or false immediate availability |
| [Jobber: client request](https://mobbin.com/flows/13bc2f40-c708-4405-89a3-3a6e72376e07) | Request status and distinction between enquiry and work scheduling | Its portal, date preferences and upload fields add unnecessary first-contact effort |

Thumbtack results included project management and account onboarding, rather than the precise hiring flow requested. Those were inspected but not represented as evidence of its complete hiring funnel. A web search mentioning Zocdoc returned Selfridges/Square; the separate iOS query actually returned Zocdoc. An Aesop section query returned Shader/PayPal/Air; it did not return Aesop. Shopee's promotional marketplace and Analogue's dense matrix were rejected for this older, worried audience.

## Value equation mapped to the journey

Official sources: [The Value Equation](https://www.acquisition.com/training/offers4), [pricing and value checklist](https://www.acquisition.com/files/pricing-value-checklist.pdf).

- Desired outcome: dry, restored rooms, expressed immediately and carried into the relevant situation plan.
- Perceived likelihood: local Meisterbetrieb, own equipment, measurement before choosing a procedure, written cost framework, documented final result, one accountable company. Genuine case studies are still missing; the interface cannot manufacture this evidence.
- Time delay: the user-supplied two-business-hour callback, followed by a clear next human step. No promise that a physical drying process taking weeks can be accelerated to hours.
- Effort and sacrifice: optional orientation before contact, a remembered situation with an edit affordance, only phone/postcode required, no account or photos, and cost boundaries explained before sending.

These are design decisions applying the framework. Conversion improvement has not been measured and is not asserted.

## Visual and interaction changes

One situation question leads to a relevant explanation. A labelled cost/measurement/documentation plan sits beside it on desktop and below it on mobile. The selected situation carries into the callback form; changing it synchronises the page's selection and plan. Direct callback buttons bypass guidance. A water-damage selection distinguishes technical drying from a running leak needing a responsible emergency service.

Removed the generated floor render from served assets. The technical explanation now uses a deliberately flat, labelled cross-section with no fictitious data. Removed decorative section indices and unused style families. Rectangular contact controls, ruled rows, a quiet summary and finite state transitions replace generic pill/card repetition. Existing real architectural photography is retained and labelled Symbolbild.

## Concept and fidelity ledger

Layout-only working concepts: `../research/journey/section-concept.png` and `form-concept.png`. They are not served images. The first section concept and chosen Mobbin references were inspected with `view_image` before implementation. The form concept was also inspected with `view_image`. Final IAB screenshots were compared at native 1440×1000 and 390×844 sizes.

Compared points: two-column composition, heading/body hierarchy, ruled choice anatomy, selected state, stone plan/summary surfaces, rectangular CTA geometry, contact-field spacing and visible next-step information. The hero's factual headline and promise were preserved; the visible guide link was added. The form headline intentionally changed from “Wir rufen Sie zurück.” to “Ihr nächster Schritt.” as specified in the new concept.

Intentional deviations: native self-hosted fonts wrap text differently from the generated mockup; actual preview-recipient/privacy copy is retained instead of the mockup's shortened wording; mobile uses a full-screen native dialog to keep controls and disclosures together; the native radio's checked state includes a restrained row tint. These implement the readable, functional design rather than generated typography artifacts. No generated images are served.

Material defects corrected in browser review: header contrast at the hero boundary, final form reassurance below the mobile fold, cumulative anchor offset, duplicate floating CTA covering a visible contact action, and browser-default English postcode validation. See JOURNEY-QA.md for verification evidence.
