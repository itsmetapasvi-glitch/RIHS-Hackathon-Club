# Ocean blend and sponsor visibility verification

- Replaced the shrinking card-like border with even masked gutters (4.5vw, capped at 110px). Gutters remain open through 72% of the rise, then resolve to a full-width surface.
- Added transparent-to-ivory top/side gradients over the actual final video frame. No replacement imagery or video edits.
- Desktop observed progress 0.5198 and 0.7196; balanced 64.8px inset at 1440px. Video at 9.999 of 10 seconds during rise.
- Mobile 390x844 observed progress 0.5845, 18px gutters, 40px top blend, 36px content padding; readable text and no horizontal overflow.
- Verified settled sections have identity transform and no active mask after section navigation.
- Removed Cursor component, pointer listeners and decorative cursor CSS. DOM contains no cursor ring or dot; body uses native auto cursor.
- User confirmed Chick-fil-A and Markivia Digital. Updated both records to confirmed; retained the confirmed/unconfirmed configuration type and public filtering.
- Opened the actual standard production build on port 5183. Both sponsor links/logos rendered at opacity 1. Sponsor ribbon remains animated; only DIGITAL gold.
- Production build, preview build and verification passed. No physical-device or reduced-motion emulation check in this pass; existing static fallback remains in source.
- Latest corrections are local; no new commit or push.


## Follow-up: full-width ivory

Removed the side masks/gutters and entrance scale/tilt. The entire rising surface stays at x=0 and matches document width, with zero corner radius. Top-only gradient remains and resolves completely at the endpoint. Desktop browser observed at 0.6500 progress: left 0, right 1429.6, document width 1430; transform scale 1 and no rotation. Production build, private-preview build and content verification passed again. No video or sponsor changes in this correction; no commit/push.


## Markivia wordmark contrast

Updated to white MARKIVIA and gold DIGITAL on a compact navy backing, preserving the white sponsor panels. Browser verified computed colors: white rgb(255,255,255), gold rgb(214,177,92), navy rgb(11,53,66), outer panel white at 0.93 alpha. Both builds and verification passed again.
