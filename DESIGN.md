# Hantke Bautrocknung — design and offer brief

Audience: Hamburg homeowners aged 30–60, leaning older, often worried and in a hurry. Premium competence without complexity. One primary action, readable controls, a visible telephone alternative. No fake availability, ratings, savings, or project photography.

## Source of business facts

https://www.maler-hantke.de/bautrocknung-hamburg — read in the live browser on 2026-10-06.

- Tomas Hantke Malermeister GmbH, Hamburg, Meisterbetrieb since 2002.
- Hamburg West and North; telephone +49 178 357 00 38, weekdays.
- Technical drying, moisture measurement, insulation-layer and screed drying, construction drying, painting restoration.
- Own drying equipment, one point of contact, measurements and a drying report.
- Written cost framework after inspection and before equipment setup; costs by equipment count/run time and labour.
- Surface/room drying typically 1–3 weeks; insulation layers typically 2–4 weeks, depending on the construction and moisture.
- Free, non-binding quotation. Inspection cost clarified on the telephone. These are different promises.
- No source evidence for 24/7 availability, instant dispatch, fixed prices, confirmed online slots or an existing customer portal.

Potentially overbroad diagnostic claims on the source (e.g. musty smells necessarily originate under screed, cold flooring proves moisture, no health effects) are deliberately not repeated.

## Actual Mobbin research

Multiple focused calls returned and visually inspected website-section previews and booking-screen previews across Hims, Sweetgreen, re_, Square, 7shifts, Daylight, Ease, Biograph, Superpower, Function, Linear, Stripe and Urban Company. Not every search result was relevant; Sui/Fiverr are rejected as poor matches. Screenshots are references, not licensed assets for reuse.

Chosen references:

- Biograph hero: https://mobbin.com/sites/sections/20c4600f-d3e9-49b5-afad-b94dcb8fd0e9 — precise hierarchy, photographic authority, generous whitespace.
- Biograph process: https://mobbin.com/sites/sections/fd4a8ae0-654b-4887-842f-120212774d02 — understandable stages and outcome-led explanation.
- Biograph FAQ: https://mobbin.com/sites/sections/c4c8f9dc-bc7f-44ad-9612-8359df493dcc — restrained ruled rows.
- Superpower hero: https://mobbin.com/sites/sections/df4f87d6-9616-4bd7-bbf1-1b8eba189c68 — striking single visual, minimal actions.
- Function pricing: https://mobbin.com/sites/sections/f5d5c740-7af0-4718-9893-3b8e80e39eed — clarify the value included. Do not borrow its medical or price claims.
- Daylight process: https://mobbin.com/sites/sections/cc6060b4-6c08-4e60-9927-809d8d181f09 — editorial warmth and clear sequencing.
- Linear exploded layers: https://mobbin.com/sites/sections/f8b93019-f62b-4e58-8f0d-e577baa204f3 — inspiration for an original explanatory floor-layer diagram. No fictitious monitoring dashboard.
- Sweetgreen hero: https://mobbin.com/sites/sections/a7dbacd8-c85d-459f-b06f-635450c43365 — real image as strong focal point, simple primary action.
- Urban Company selected requirements: https://mobbin.com/screens/b7e8961a-25c9-49c8-aa5c-2e9e2d4c92e6 — explicit choice state, persistent next action. Remove subscription upsells.
- OpenTable booking preview: https://mobbin.com/flows/a3d61cfa-8a9c-42b3-b38e-1c5433744cfa — visible selection, clear confirmation. Preview showed add-ons that are deliberately omitted. Full end-to-end flow was not tested.

## Value equation

Dream outcome: a dry, restored home and normal everyday life.
Perceived likelihood: named local Meisterbetrieb, own equipment, measured completion, written documentation, single accountable contact.
Time delay: very short callback request; clearly distinguish speed of making contact from physical drying, which takes weeks.
Effort/sacrifice: no account, no provider comparison, no long damage report, no compulsory photos, one team through restoration, written cost framework before commitment.

No guarantee of zero friction or conversion performance is made. Mobile usability and the submission/read-back path must be verified.

## Current direction: Cover-inspired redesign

The user rejected the original orange/forest/SVG design and explicitly chose Cover. The current production design follows Cover's full-screen architectural presentation and sparse editorial layout, with real images and a straightforward service action. Earlier references above are research history, not the current aesthetic.

Primary live reference: https://buildcover.com/ — inspected on desktop and mobile, including its opening, architecture detail sections and enquiry pattern. Additional affluent-US references and captured evidence are in `../research/LUXURY-REFERENCES.md`.

Actual successful Mobbin section searches on 2026-10-06, previews visually inspected:

- Rivian cinematic opening: https://mobbin.com/sites/sections/facc6157-46bc-426a-b6a3-7cd1eab98d6d — immersive image, minimal overlaid controls.
- Rivian sunset opening: https://mobbin.com/sites/sections/1d38221a-d507-4087-a879-6249a946af94 — sparse headline and direct action.
- Rivian R1S: https://mobbin.com/sites/sections/542092f3-a589-4909-8f3f-630089abe4f0 — large product photography and deliberate scale.
- In Common With workshop: https://mobbin.com/sites/sections/5f24a8f8-e6b5-4008-872e-e3d7ab369c55 — material photography and editorial explanation.
- In Common With interior: https://mobbin.com/sites/sections/a87f2a50-8a78-4193-b491-5589059041fa — full architectural frame and quiet type.
- In Common With FAQ: https://mobbin.com/sites/sections/40b53245-94f5-4f33-aa44-39490dc2fb31 — restrained ruled questions.

These references were returned by the Mobbin plugin. Cover was inspected directly; no claim is made that Mobbin returned Cover. No reference screenshots or proprietary assets are used as website assets.

## Tokens and composition

White #ffffff, charcoal #232722, stone #f1f0eb, muted text #60635e and thin rules #d7d9d3. Self-hosted Instrument Serif regular for all editorial headings; DM Sans regular for readable content and controls. Desktop 56px side margins, mobile 20–24px. Main section spacing 110px desktop / 68px mobile. Pill contact actions; no decorative card grids or badges.

Hero: full-screen real interior photograph, neutral top/bottom contrast gradient, transparent navigation, two-line headline “Ihr Zuhause. Wieder in Ruhe.”, explicit service/location, primary “Hilfe anfordern”, phone alternative. Architectural images are labelled Symbolbild.

Downstream: services with a large interior image and three open descriptions; measured three-stage process on stone; ruled FAQ; full-image closing action; factual footer. Mobile stacks content, keeps direct calling visible and reveals a compact contact bar after the opening help action scrolls out of view.

## Motion

Finite 4-second image settling and staggered entry, native-scroll photographic parallax and rounded framing, header contrast transition, one-time section reveals and ruled-step reveals, animated native details, a 480ms enquiry drawer entry / 200ms dismissal and 350ms form-step transitions. No scroll hijacking, looping media, loading ceremony or fake video controls. All motion respects prefers-reduced-motion; content is visible if script enhancement fails.

## Concept prompt set

Built-in Image Gen was used for layout mockups only, before implementation. Saved four separate concepts in `../research/cover-concepts/`: hero.png, services.png, process.png and faq.png. No generated raster is served by the website.

Shared prompt: premium California architecture like Cover, German Hantke Bautrocknung, Instrument Serif headings / DM Sans 18px UI, white-charcoal-stone, readable for age30–60, code-native controls, supplied unmodified real photo, no invented ratings, guarantees, badges, orange buttons or diagrams.

Hero prompt: full-bleed supplied interior, minimal transparent Hantke / Leistungen / Ablauf / Fragen / Hilfe anfordern header; lower-left exact headline and service line; white pill help action and phone; Symbolbild caption.
Services prompt: “Trocken ist erst der Anfang.” centered with short one-team explanation; large real interior beside open ruled Wände & Decken / Estrich & Dämmschicht / Putz & Anstrich descriptions.
Process prompt: stone surface, “Ein Anruf. Ein klarer Plan.” left, explanation right; three open numbered steps Persönlich klären / Gezielt trocknen / Sauber abschließen; dark callback action.
FAQ prompt: “Gut zu wissen.” left, ruled questions right; photographic closing “Der erste Schritt ist einfach.” with white help action and factual footer.

Generated explanatory text was replaced with verified service wording wherever it invented guarantees, cost certainty or health claims. The generated process font drifted from the requested typography; implementation consistently uses the specified Instrument Serif across all sections.
