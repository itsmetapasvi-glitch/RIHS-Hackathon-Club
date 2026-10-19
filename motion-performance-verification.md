# Motion and navigation refinement

## Implementation

- One Lenis instance, driven by the existing GSAP ticker. Font/layout refreshes are coordinated rather than independently repeated by several animation components.
- Initial fragment placement happens in layout effects before rendering. A late font correction runs only if the visitor has not interacted. About/Theme destinations use stable scene geometry rather than the currently translated panel position.
- Long section jumps use a short native view transition, with a bounded wait for the destination video frame. Short jumps retain smooth scrolling. Keyboard navigation and reduced motion use immediate placement and preserve focus.
- Entry reveals initialize before paint, avoid replaying already visited content during responsive rebuilds, and finish destination reveals during direct section navigation. The timeline rail, chapter choreography, sponsor ribbon and ocean entrance remain.
- Video seeking is demand-driven and coalesces to the latest requested frame. No permanent video-seek animation loop. Offscreen and hidden-tab work pauses; the hero video stays unloaded on initial deep links until needed.
- Portrait derivatives retain 1080px vertical resolution, 24fps and six-frame keyframes. At 812x1080 they decode about 58% fewer pixels than the desktop 1920x1080 source. This is a pixel-count comparison, not a frame-rate benchmark. Portrait delivery is limited to narrow portrait viewports.
- Removed the redundant full-content alpha mask, perspective/backface treatment, small text rotations and sponsor backdrop blur. The visible ocean, sponsor panels, imagery, typography and expressive animations remain.
- All four built pages retain render-blocking module entries and preload the active display/body fonts. Same-origin page navigation opts into native view-transition crossfades; browsers without support retain normal working navigation.

## Checks performed

- Production build, private preview build and content verification pass. Verification also checks render-ready entries and both new portrait media files in both outputs.
- Browser: Register to About and Sponsor to Theme land with section top at 0px, arrival transform at identity, readable headings and decoded ocean frames around 6.8s / 8.4s. The hero video remains readyState 0 on a fresh About deep link.
- Desktop same-page Schedule jump lands at its 28px offset with all heading words visible. Back returns to Theme at 0px. Contact to Schedule navigation was exercised.
- Mobile 392x844: menu opens, Theme navigation closes it and lands within 1px of target. The selected ocean asset reports 812x1080. No horizontal overflow. Normal ocean scrolling updates video time; reverse scrolling returns to the correct earlier frame.
- Desktop resize after mobile reloads the desktop media and keeps content visible. Sponsor ribbon remains visible with white panels and white/gold Markivia artwork. FAQ expand interaction exposes the answer correctly. No browser warnings or errors were reported during this pass.
- Reduced-motion paths reviewed: native scroll owner, no scrubbed film/pinned entrance, no entrance reveals, no page crossfade, static sponsor logos. Live OS reduced-motion switching was not re-exercised in this pass.
- Original desktop media SHA256 hashes remain C9888B0DBF3535E8B9025F408B95DF802334FBEFF03F44DD8510E5AFBCEE35F3 (ocean) and CE2B83595BEC00CD16F4D41BEFB9C71B7EADF6BF0E05CC706E6BBF5CCA60DA05 (hero).

No physical-device performance profile or sustained FPS benchmark was taken. Device GPU/video decoding and browser support still affect perceived smoothness. No publication or Git push was performed.

Native transition behavior reference: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
