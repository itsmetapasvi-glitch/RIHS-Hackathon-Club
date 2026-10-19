# RIHS refinement — October 18, 2026

All six requested stages were applied in order. The established open header, Geist typography, navy/ice palette, centered About, dark schedule/FAQ/footer, sponsor preview rules, route structure and event content remain.

## Implemented

- Replaced only the scroll clip with the supplied 1920×1080 video. Encoded H.264 at CRF 16, six-frame keyframes, no audio, fast-start metadata. The separate hero clip is byte-identical. Handoff, seeking, scene heights and reverse-scroll behavior remain unchanged.
- Three ocean text chapters connect the challenge, project formats and 12:15 PM submission deadline to the descent. Added no event claims.
- Ocean imagery, stepped challenge composition, coordinated headings, image wipes, timeline progress and section-specific entrances replace blanket fades.
- One Lenis instance uses one GSAP ticker callback; native touch, native reduced motion, keyboard navigation, anchors, focus and dialog scrolling remain supported. Owned callbacks, effects and listeners clean up.
- Clearer focus, safe-area spacing, decorative icon semantics, readable labels, direct form links and keyboard-immediate actions.
- Pointer menu/FAQ transitions, fast press feedback and a cursor decoration that sleeps when idle. The native cursor stays available.

## Interaction review

| Before | After | Why |
| --- | --- | --- |
| Cursor runs continuously | Frames only while moving or settling | Lower idle work |
| Abrupt menu | Pointer-only 240ms entrance | Spatial feedback |
| Little press feedback | 140ms restrained press | Fast response |
| Abrupt FAQ answer | Pointer-only 180ms entrance | Clarify expansion |

## Guideline findings resolved

- src/App.tsx:35 — idle cursor frame loop; now event-driven and canceled when hidden.
- src/App.tsx:61 — dialog background scrolling; now explicit native lock plus Lenis stop/start.
- src/site-motion.ts:29 — empty hero target on secondary pages; guarded.
- src/refinement.css:79 — secondary navigation inherited a pale foreground; corrected to navy.
- src/refinement.css:85 — narrow hero intrinsic grid width clipped countdown; minmax(0,1fr) and bounded children.

Source: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md (fetched this session).

## Verification

- TypeScript, public build, private preview build and project verify command passed.
- Countdown before/at 9 AM, after 3 PM, background timestamp recovery, both independent December 6 deadlines and unset exact cutoff times passed.
- Schedule, capacity, form URLs, all five tiers/30 benefits, eight page metadata variants, public downloads and media checks passed.
- Browser: desktop four routes at 1440px; mobile routes at 390px, narrow hero at 375px; tablet home at 768px; default-width ocean chapters. No observed horizontal document overflow or broken images.
- Menu nested scrolling, background lock, Escape focus restoration, sponsor disclosure, FAQ pointer/keyboard expansion, contact email/copy, skip link, PageDown, Home/End and anchor focus checked.
- User reduced-motion mode removes both videos, switches to the static poster and native scrolling; restoring full motion remounts playback/scroll ownership. OS preference wiring and CSS were inspected; OS emulation and physical devices were not tested.
- First, second and third story chapters observed during actual scrolling; both videos report 1920×1080. Returning to top resumes hero playback.
- Built-preview console has no new warnings/errors in inspected routes. The initial empty-target development warning was fixed.
- Hero clip, supplied sponsorship PDF and event configuration hashes match the baseline. The scroll clip and extracted scroll poster are the authorized replacements.
- Four local routes and sponsorship download returned HTTP 200. Video supports byte-range delivery.

## Preservation and limits

No existing visual feature or ocean animation was removed. The old single dive quote and generic blanket reveals were replaced with purposeful text/choreography. The previously removed loading intro stays removed.

The Impeccable context engine was unavailable; its documented direct-context fallback was used. No physical-device, Safari, automated WCAG certification or formal performance score is claimed. External form permissions were not changed or reverified signed out. The supplied PDF remains unchanged, including its previously noted differences from website settings.

Local only: no commit, push, deployment, external message or form submission.
