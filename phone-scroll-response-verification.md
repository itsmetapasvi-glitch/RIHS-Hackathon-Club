# Direct phone scroll and caption separation

The organizer clarified that the iPhone 16 experience felt delayed rather than visibly dropping frames, and that text overlapped. This pass addresses those specific behaviors while retaining the mobile frame renderer and the original ocean imagery.

- Removed two extra requestAnimationFrame handoffs between ScrollTrigger progress and a cached canvas frame. A ready frame now draws within the scroll update. Asynchronous image completion still schedules its paint safely. The renderer regression check now asserts synchronous painting of a cached destination.
- Phone hero and three chapter captions now live in normal document flow above the sticky ocean background. Each caption has a distinct viewport-height reading section; there are no absolutely stacked phone captions, crossfades between overlapping text layers, or scroll-driven hero opacity/translation. Native page scrolling moves the words directly with the gesture.
- Desktop retains its original three overlaid/choreographed chapters, hero treatment and video scrub. Mobile keeps all three chapter messages, the full ocean sequence and forward/reverse navigation.
- Fixed landscape countdown column sizing that could extend about two pixels beyond the viewport.

Production and preview builds and verification pass. The renderer checks include cache/concurrency limits, forward/reverse frame selection, immediate cached-frame painting, idle suspension, error fallback and cleanup.

Browser layout checks: at 393x852 the hero occupies its own 852px region and the chapter regions are consecutive, non-intersecting 852px sections. There are zero fixed/absolute chapter overlay nodes on mobile. At 320x568 and 780x390, every caption's contents fit inside its own reading section. No horizontal overflow after the landscape timer correction. About deep links retain the expected 28px offset. Desktop at 1440x900 retains three original overlay chapters, no phone-flow chapters, and the original video renderer.

These are Chromium geometry and rendering-contract checks, not measured iPhone Safari timing. The phone preview is updated for the organizer's next device check. No Git push performed.

Background guidance: WebKit's [power and rendering guidance](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/) explains why reducing scroll-event work and painting matters. No browser-engine bug is asserted as the cause here.
