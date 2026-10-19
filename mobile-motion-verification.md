# Phone layout and motion repair

## Changes

- Compact layouts / touch-first devices use native browser scrolling. Lenis remains the single desktop smoothing owner. Mobile long jumps avoid full-page snapshot transitions; short jumps use browser scrolling, with interruption-safe focus handling.
- The mobile content entrance uses normal document flow over the same sticky ocean. It replaces the nested sticky/transformed content plane on phones, preserving the ocean and rising-content direction without the large moving layer. Desktop entrance choreography remains.
- The last ocean chapter stays readable until About approaches, then clears before the first heading can overlap it. Heading and schedule reveals animate coherent blocks on mobile instead of many independent words and child elements.
- Browser-toolbar height changes no longer force the mobile ScrollTrigger layout to rebuild. Scrollbar observers rebuild on width changes only. Orientation/source changes clean up owned work; initial fragment placement does not replay at every breakpoint.
- Portrait videos are now 540x720 H.264 Constrained Baseline, 24fps. Hero: 2,494,952 bytes (previous portrait: 12,178,051). Ocean: 5,367,951 bytes (previous portrait: 9,775,377). Both retain their full 10 seconds. The scrubbed ocean has 240 independently decodable keyframes; seeking is capped to the source's 24fps and coalesces to the latest target.
- Landscape phone assets are 960x540, 24fps: hero 4,124,338 bytes; ocean 7,850,069 bytes. Desktop sources remain unchanged.
- Sponsor ribbon groups and panels have explicit widths, no wrapping/shrinking, and contained artwork. Mobile uses four groups rather than eight, smaller white panels, and fewer large transformed pixels. Markivia remains white MARKIVIA / gold DIGITAL. The ticker pauses outside the viewport and in background tabs.
- The mobile hero sizes to its content, avoiding the previous grid overflow that pushed its date into the header. Header logo proportions are explicit; timer and buttons remain readable.

## Verification

- Production / preview builds and event/content verification pass. All four mobile media files are checked in both build outputs.
- Chromium preview at 320x568, 375x667 and 390x844: no horizontal page overflow; sponsor panels occupy one row with a measured 16px gap and no intersections. Wordmark content stays within its backing; both sponsor logos remain separate and readable.
- At 375x667 the date is below the 87px header, the hero fits its content, and the countdown is visible. Header logo keeps its aspect ratio.
- At 780x390 the native scroll owner selects the 960x540 landscape asset. Portrait selects 540x720.
- At 320px, Register, Sponsor and Contact have no horizontal overflow and no primary buttons outside the viewport.
- Registration menu to Theme closes the dialog, removes the scroll lock and lands at the expected 28px offset with no hidden heading content.
- Forward/reverse ocean navigation was inspected. At the handoff, the last story chapter remains visible before About enters; the story clears before About/Theme occupy the screen. No nested sticky surface or transformed content plane exists in the compact layout.
- Full 10-second, 24fps Baseline encodes and 240 ocean keyframes verified with FFmpeg. These are asset/decoder-work checks, not phone FPS benchmarks.
- Reduced-motion code retains native scrolling, static ocean fallback, visible content and static sponsor logos. Live reduced-motion hardware switching was not retested in this pass.

The available preview browser is Chromium on Windows. Physical iPhone Safari, Android Chrome, low-power modes and sustained real-device frame timing could not be exercised here. The repair targets portable native scrolling, stable viewport units, Baseline H.264 and explicit flex geometry for both browsers; physical Safari confirmation remains necessary. Changes are local, not pushed.
