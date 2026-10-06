# Guided enquiry verification — 6 October 2026

Public URL: https://hantke-bautrocknung-preview.ksqsebastian.workers.dev/

Published through the connected Cloudflare plugin. Final upload: 2026-10-06 10:15:37 UTC, HTTP 200, etag `b1ec4ef7fefd838f65e91b8c9f00c12cc99ee9b93d2ab614d2e0a383d62916ea`. Existing D1, sender, recipient and encrypted secret bindings were preserved.

## Functional verification

- `npm test`: all seven backend tests passed, covering persistence/idempotency, origin/input rejection, atomic rate limits, mail recovery, protected admin status changes, retention/security headers and the retry-window boundary.
- `npm run build`: 14 self-hosted assets; generated floor raster removed. JavaScript syntax and Git diff whitespace checks passed.
- IAB local and live paths: all four native radio choices update relevant guidance. Selecting a situation carries the corresponding backend enum into the contact form. Editing it through the native select also updates the page. Direct callback opens the form without requiring guidance. Closing restores focus.
- Native keyboard ArrowDown moved from the construction choice to “Ich bin noch unsicher” and updated the plan. Technical accordion opens the final measurement/report explanation. Native dialog isolates focus.
- Invalid postcode remained in the form and showed the German five-digit message. The original phone pattern was not enforced by Chromium; escaping the parentheses fixed native pattern validation. A three-digit phone now stays invalid with the German minimum-seven-digit message.
- Live guided mobile submission used the explicit system-test phone `0000000000`, postcode 22529 and “Feuchte Wand”. Confirmation reference `643D0332`. D1 stored the correct situation with `notified=sent`, no delivery error. Resend email `01a110b0-0b5f-7388-b3ae-acdc6e230eca` was independently retrieved through the plugin with status **delivered**. Its body contained the correct situation and the two-business-hour callback target. The disposable test row was removed; the clearly labelled test email remains in the owner's mailbox.
- The final publication after that submission only corrected client validation/caption details; no submission, storage or mail-delivery code changed.

## Responsive and visual verification

Screenshots saved through the built-in IAB screenshot API, not simulated renders. Source concepts and final screenshots were inspected using `view_image`; composition, typography, choice anatomy, selected state, summary surface, CTA shape and field spacing were compared. Intentional deviations and the copy comparison are recorded in JOURNEY-DESIGN.md.

- 1440×1000: two-column guidance, no document overflow, self-hosted fonts loaded, solid header readable after the hero.
- 390×844: guidance stacks in order; selected plan action ends around y=664, with the duplicate floating action hidden while the section's button is visible. No document overflow. Full-screen callback places both required fields, summary, actual recipient/privacy disclosures, submit and final reassurance within the viewport.
- 320×568: document width remains 320; hero callback ends at y=446.5. The image caption was shortened to “Symbolbild” on mobile to remove its overlap with the guide link. The form remains full-width and scrollable on the shorter screen.
- Finite hero/state transitions and existing native-scroll motion preserved. Reduced-motion handling is implemented in CSS/JS; no OS preference was changed during verification.

Evidence: `../research/journey/live-desktop.png`, `live-plan-mobile.png`, `live-form-mobile.png`, `live-320.png`, `live-technical-desktop.png` and `live-confirmation.png`. Prior captures prefixed `before-` show the incumbent design. The Mobbin result archive records eleven current-session successful calls with 34 distinct returned references: 15 flows, 12 screens and 7 website sections. Flow previews were inspected; the third-party transactions themselves were not executed.

## Practical limits

This is a functioning project preview, not Hantke's operating website. Notifications go to the project owner's mailbox. No genuine project photographs or customer case studies have been supplied. The two-business-hour reply target is the user's commitment; exact daily operating hours, real staff availability and physical drying completion are not inferred. Conversion uplift has not been measured.
