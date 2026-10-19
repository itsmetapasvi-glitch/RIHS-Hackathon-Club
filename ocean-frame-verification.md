# Mobile ocean renderer

The previous mobile MP4 seek path remained laggy on the organizer's Safari phone. The mobile scroll renderer now draws frames extracted from the same ten-second ocean source into one opaque canvas. The separate hero still loops normally; desktop still scrubs the original MP4. This changes mobile delivery, not the ocean scene or scroll narrative.

## Bounds and fallback

- All 240 original source frames are delivered, at 24 source frames per second. Portrait: 540x720, 4,839,920 bytes across 240 WebP files. Landscape: 960x540, 7,606,778 bytes across 240 files. Frames were extracted from the existing ocean source at WebP quality 78.
- Twelve decoded frames maximum, three outstanding image/decode requests maximum. The requested frame is prioritized, with directional lookahead. Obsolete requests are cancelled after flings. Unneeded bitmaps are explicitly closed.
- Paints are requested only when a new usable frame arrives or the scroll target changes; no permanent canvas animation loop. Prefetch stops when inactive or in a hidden tab. Canvas resolution is independent of phone device-pixel-ratio to avoid unnecessary large buffers.
- ImageBitmap is used when available, with a decoded HTML image fallback. A sequence/canvas failure switches back to the existing mobile MP4. Reduced motion creates no animated canvas or video path.
- No MP4 currentTime assignments occur in the active mobile frame renderer. The hero and scroll renderers retain their coordinated handoff and visibility handling.

## Verification

- Production build, preview build and content verification pass. Both output folders contain exactly 240 numbered WebP frames in each orientation, including first and last frames.
- Automated renderer checks pass for exact forward/reverse frame selection, rapid direction changes, cache and concurrency limits, reaching idle without runaway prefetch, inactive suspension, ImageBitmap and HTML image paths, load-error reporting and disposal.
- Chromium mobile preview: About deep link settles on the requested frame; normal reverse scrolling reaches frame 82 with a 12-frame cache and zero pending loads; fast forward settles on frame 195; passing the schedule boundary reaches frame 239. Canvas opacity is 1 after readiness; no scrub video element is present on the mobile frame path.
- Portrait uses 540x720, landscape 960x540. No horizontal overflow at the checked phone size. Desktop at 1440x900 has no canvas, uses the original ocean.mp4 and lands About at 0px. No browser warnings/errors were reported.
- Existing desktop source files, event content, countdown, navigation and sponsor presentation are preserved. No Git push performed.

These checks verify rendering behavior and resource bounds in Chromium. They are not a physical iPhone Safari frame-rate benchmark. The LAN preview is available for the organizer's on-phone confirmation.
