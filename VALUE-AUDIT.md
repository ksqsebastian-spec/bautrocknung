# B2C design audit and value equation refinement

Date: 2026-10-06. Product: the live Hantke Bautrocknung design preview. Task: understand the service, judge whether to trust it and request a callback quickly. Target audience30–60, leaning older. This audit used newly captured live screenshots from this run, not previous screenshots.

## Framework and source

Hormozi's value equation concerns the desired outcome and perceived likelihood of achieving it, weighed against waiting time and customer effort/sacrifice. His official checklist explicitly calls for progress visibility and convenience, as well as testimonials and proven cases:

- Official lesson: https://www.acquisition.com/training/offers4
- Official pricing/value checklist: https://www.acquisition.com/files/pricing-value-checklist.pdf

The critique below is the designer's application of that framework, not a measured conversion study.

## Current-run journey findings

1. **Opening: attractive, insufficiently concrete.** The architectural composition communicates quality and a desirable feeling. But “Ihr Zuhause. Wieder in Ruhe.” does not state the complete deliverable. The first viewport has no Meisterbetrieb credential, completion evidence or clear callback deadline. “Hilfe anfordern” leaves the next step open to interpretation. Mobile spends substantial space on illustrative photography before explaining the offer.

![Opening on mobile](/Users/kerimseehafer/Documents/ChatGPT/B2C/research/value-audit/02-opening-mobile.png)

2. **Situation selection: usable but unnecessary effort.** Large radio targets, good labels and native dialog focus. Yet a required category and separate Weiter action stand between the customer and the two details needed for a callback. The server already accepts Unklar. This step does not deliver a useful answer in return for the effort.

![Mandatory situation step](/Users/kerimseehafer/Documents/ChatGPT/B2C/research/value-audit/03-situation-step.png)

3. **Contact: appropriately minimal, expectations revealed late.** Phone/postcode are clear. But the callback meaning of “help” and the preview recipient boundary appear only now. The form does not say when someone will reply. The small privacy/disclosure text needs to stay legible; screenshots alone cannot establish accessibility compliance.

![Contact step before refinement](/Users/kerimseehafer/Documents/ChatGPT/B2C/research/value-audit/04-contact-step.png)

4. **Technical explanation: too much decoration before evidence.** A second illustrative interior photo occupies the next viewport. It does not explain hidden moisture, the drying method or how completion is verified. The useful service facts are farther down.

![Decorative service introduction](/Users/kerimseehafer/Documents/ChatGPT/B2C/research/value-audit/05-service-explanation.png)

All screenshots above were captured in Browser/IAB, saved, opened with view_image and accepted before use. The desktop opening is also saved as `../research/value-audit/01-opening-desktop.png`.

## Changes by value lever

| Lever | Previous weakness | Implemented improvement |
| --- | --- | --- |
| Desired outcome | An attractive feeling without a concrete deliverable | “Wieder trocken. Bis zur fertigen Wand.” and one accountable team from measurement through restoration. |
| Perceived likelihood | Local credentials and measurement evidence were buried | Meisterbetrieb since2002 in the hero; a labelled floor principle illustration; measure / choose drying / document result; own equipment; completion measurement and report. |
| Time delay | No reply commitment; contact speed and physical drying were not distinguished | User confirmed a callback within two business hours. The promise appears with the CTA, in the form, process, FAQ, success message and operator email. It applies to a callback, not technician arrival or faster physical drying. |
| Effort and sacrifice | Mandatory diagnosis step and extra Weiter action | One-screen callback form, two required fields, optional situation defaulting to Unklar. Direct calling remains visible. Cost-of-inspection clarity and a written cost framework reduce commitment uncertainty. |

The new two-business-hour commitment was explicitly supplied by the user in this run. It is not claimed as an existing public-source fact or as a tested human-response SLA. Business-hour counting is explained in the FAQ; an on-site visit is arranged separately.

## Technical and visual direction

The Cover-inspired architectural character remains. The headline now combines the existing editorial serif with a direct sans line. A short masked word reveal adds polish, while contact controls are usable immediately. Existing finite photo motion, native scroll framing and reduced-motion support remain.

A generated **schematic illustration** replaces the second decorative interior; the architectural photographs remain real. It shows the usual conceptual order of covering, screed, insulation and structure, not the construction of a particular customer home. It is labelled Prinzipdarstellung / Bodenaufbau kann abweichen. No numeric readings, case history, live equipment data or project photographs are invented.

Actual fresh Mobbin calls returned and visually inspected these Rivian references:

- Stage/category control: https://mobbin.com/sites/sections/0a91dbdc-148e-4b04-91fd-c76cf43e4262 — technology/performance/design selector and concise explanations.
- Isolated product presentation: https://mobbin.com/sites/sections/30139d57-f919-4d36-90cc-0b5e097f8617 — tangible product and concise factual hierarchy.

Mobbin did not supply the floor cutaway. Its model was generated as an original labelled educational asset. No Rivian measurements, metrics or screenshots were imported into the website.

## Evidence limits

A screenshot audit can identify ambiguity, hierarchy and interaction effort; it cannot prove a conversion uplift. Real customer cases, reviews and authentic equipment/team photographs would provide stronger outcome evidence than an illustrative interior and a schematic. They have not been fabricated. Human compliance with the callback promise must be maintained by the team; the system sends the request and target to the operator, it does not make an automatic phone call.
