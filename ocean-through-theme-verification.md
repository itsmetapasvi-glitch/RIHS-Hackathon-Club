# Ocean through About and Theme - verification

Implementation:
- Retained both original MP4s. The existing 10-second ocean clip maps across the whole ocean journey up to the schedule; no longer or re-encoded clip needed. Narrative text retains its reading span.
- About and Theme share the actual video background. A dark ocean tint provides text contrast; secondary-text contrast over a worst-case white frame is 4.76:1 before the existing additional shade.
- About uses centred layout and equal vertical padding. Removed the separate water-picture figure; preserved all theme text and three steps.
- Schedule has a square straight top boundary.
- Corrected nested anchor positions for About and Theme. Kept one Lenis instance/frame driver and scoped GSAP ownership.
- Subtle native scrollbar follows the current section's surface through one scoped IntersectionObserver, with cleanup and resize handling.
- All four routes reference /favicon.svg?v=crest-2027. Native vector crest traces the organizer-supplied artwork into two paths with no background rectangle.

Browser evidence:
- Desktop 1440x900 About: top/bottom whitespace 178.14/178.14px; film 6.799s at progress 0.6800.
- Desktop Theme anchor: top ~0px; film 8.399s at progress 0.8400; no challenge image; no horizontal overflow.
- Near schedule: film 9.676s, ocean journey bottom and schedule top both 171.4px; radius 0px.
- Mobile 390x844 About: top/bottom whitespace 76.59/76.60px; film 6.706s; no horizontal overflow.
- Mobile Theme: correct destination; height 999.95px; film 8.213s. Content remains readable and scrollable. Reverse scrolling checked.
- SVG crest inspected in browser: two paths, zero rectangles. Route favicon references checked in generated HTML.
- Native scrollbar colour measured as a muted light thumb on the dark ocean track; surface tracking inspected at the schedule.

Checks: production build, private-preview build and verify passed. Verify covers event/countdown boundaries, dates, deadlines, all tiers, eight route metadata variants, new favicon links/assets, downloads and media.

Limitations: browser viewport checks rather than physical mobile hardware. Static reduced-motion/video-error paths reviewed in source, without preference emulation or injected media failure in this pass. No commit or push of this latest work.


Schedule transition polish: a full-width gradient behind the text resolves the last 252px of ocean on a 900px desktop viewport (236px on an 844px mobile viewport) into the exact schedule navy. No new scroll distance or animation loop; straight edge retained, video unchanged. Desktop/mobile inspection confirmed readable last-step copy and no horizontal overflow. Builds and verification passed; not pushed.
