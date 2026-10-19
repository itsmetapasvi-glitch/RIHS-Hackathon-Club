# RIHS Hackathon 2027

React / TypeScript / Vite / GSAP / Lenis / Lucide. Four routes: /, /register/, /sponsor/, /contact/.

## Local preview

Run start-preview.cmd with Node installed. The current local design preview is http://127.0.0.1:5180/. The server supports direct routes and video range requests.

## Build and verify

npm.cmd ci
npm.cmd run build
npm.cmd run build:preview
npm.cmd run verify

Public delivery is dist/. Private design preview is dist-preview/. Only confirmed sponsors appear in the public build. The preview contains Chick-fil-A and Markivia Digital with no visible confirmation captions; no status or tier is invented.

## Current art direction

An open header, ocean footage, Crimson Text editorial display, Inter interface/body typography, ivory information surfaces, navy and rich aquatic blue. Both font families were verified in Healing Minds' live styles and are self-hosted under included SIL OFL licenses. The loading intro stays removed.

The hero and scroll clips remain separate. The hero loops at the top; scrolling crossfades into the existing 1080p scroll-controlled video, and returning to the top resumes hero playback. OceanArrival adds a reversible rising page surface over the actual final video frame. The same video element stays pinned behind it, and completion is gated on the decoded end of the clip. No replacement ocean image is used. It owns no second scroll driver. Reduced motion and media failures use a static, readable normal-flow fallback. Native cursor, menu focus/lock, anchors and all route actions remain supported.

See premium-design-notes.md and premium-verification.json for the latest design decisions and verification. Earlier refinement reports document prior stages.

## Content

January 9, 2027, 9 AM–3 PM Pacific. Check-in 8:30 AM; building 9:15 AM–12:15 PM; submissions due 12:15 PM. Free participation; capacity 100. RIHS cafeteria, 16601 Riptide Wy, Lathrop, CA 95330. Advisor: kwone@bantasd.org.

Participant and sponsor deadlines remain December 6, 2026. Exact cutoff times remain independently unset in src/event.ts.

Participant: https://forms.gle/Tdr3m6frKN5pmfBTA
Sponsor: https://forms.gle/FLytMPMBTxQf9oVL7

Previously, the available signed-in browser displayed an access request after resolving both short URLs to responder forms. Signed-out access has not been verified; universal inaccessibility is not claimed. No editor URL ships. No external permissions or form submissions were changed.

All five tiers and 30 benefits/conditions are retained. The supplied three-page sponsorship PDF is served unchanged; its previously noted cutoff/link differences have not been applied to website configuration.

This refinement is local. No commit, push or deployment was performed.

Latest corrections: challenge uses a pale aquatic-blue field after ivory About; venue uses ivory after dark FAQ. Decorative venue RIHS 2027 artwork removed. Registration/sponsor application bands span the viewport and keep readable column widths on wide screens. See actual-video-fix.md for verification.


## Scroll handoff and sponsor ribbon refinement

About now follows scroll position directly, without waiting on a video-ready event and catching up over 400ms. It rises linearly over 125svh, settles after anchor jumps, and reverses over the actual video. Both supplied MP4s are unchanged. The video seeks the latest Lenis position without another lagging interpolation clock. The ocean chapters now share 300svh (320svh on small screens), providing more reading distance and carrying the last chapter to the video endpoint.

The manual pause control and saved override were removed as requested. System reduced-motion support remains. Initial font loading cannot restore an old hash after user interaction.

Preview sponsors use a continuous ribbon of rounded white glass panels. Only DIGITAL in Markivia is gold. Copies are hidden from assistive technology and contain no repeated links. Keyboard focus holds the ribbon; reduced motion presents a static row. Sponsor confirmation filtering is unchanged.

See scroll-handoff-verification.md for checks and limitations. No commit or push was performed.


## Latest: ocean blend, confirmed sponsors, and native cursor

The rising surface now retains balanced ocean gutters until the final part of its entrance. Top and side alpha gradients blend ivory into the actual ocean video; those masks resolve completely when the section settles. The custom cursor component and its pointer listeners/styles have been removed.

Chick-fil-A and Markivia Digital were both confirmed by the organizer on October 18, 2026. Their configurable records are now confirmed, so both logos appear in standard production builds as well as previews. Future unconfirmed records remain filtered from publication. Only DIGITAL in the Markivia wordmark is gold.

Verified in production mode on the home page, with mobile and desktop viewport checks, normal cursor behavior, settled anchor state, readable gradient edges, and no horizontal overflow. Both builds and content verification pass. These corrections are included in the website source.


Latest width correction: the rising ivory section spans the viewport throughout its entrance, with square solid sides/corners. Side masks, inset gutters, scale and tilt were removed at the organizer's request; only the top-edge ocean blend and vertical scroll rise remain. No ocean media was modified. This supersedes the earlier balanced-gutter description.


Markivia contrast correction: MARKIVIA is white and DIGITAL gold on a compact navy backing inside the existing white glass sponsor panel. Sponsor panels remain white; ribbon motion and links are unchanged.


Latest hero cleanup: removed the Scroll to explore cue and the trailing dot after 2027 in the hero heading. Production and preview builds, content verification, and browser inspection passed before publication.
