# RIHS Hackathon 2027

Four-page React/TypeScript/Vite website. Routes: /, /register/, /sponsor/, /contact/.

## Preview

Run start-preview.cmd with Node installed. The built preview needs no dependency installation. The supplied server supports direct page routes and video range requests. A running local preview in this session uses http://127.0.0.1:5180/.

## Build

npm.cmd ci
npm.cmd run build
npm.cmd run build:preview
npm.cmd run verify

The public build is dist/. The private design preview is dist-preview/. Only sponsor records marked confirmed are shown in the public build. Preview includes Chick-fil-A and Markivia Digital, without visible status captions. No tier or confirmation has been invented.

## Current design

An open transparent header follows the supplied navigation reference, with separate registration and sponsorship pill actions. The loading intro has been removed; the hero is available immediately. Secondary pages use pale neutral backgrounds, navy panels, and clear action groups. Footer uses the same dark blue as the schedule and FAQ. All five sponsorship tiers and 30 benefits/conditions are retained.

The ocean component and MP4 remain unchanged, verified by SHA-256. Hero countdown targets 2027-01-09T09:00:00-08:00, recovers after background pauses, and changes state at 9 AM and 3 PM Pacific. Reduced-motion preferences remain supported. Native cursor is always available.

## Event and forms

Event: January 9, 2027, 9 AM to 3 PM Pacific. Check-in 8:30 AM. Build 9:15 AM to 12:15 PM; submissions due 12:15 PM. Free participation, capacity 100. Venue: RIHS cafeteria, 16601 Riptide Wy, Lathrop, CA 95330. Advisor: kwone@bantasd.org.

Both application deadlines remain December 6, 2026. Exact cutoffs remain unset and independently configurable in src/event.ts.

Participant: https://forms.gle/Tdr3m6frKN5pmfBTA
Sponsor: https://forms.gle/FLytMPMBTxQf9oVL7

Both supplied short links were observed resolving to published responder URLs. The available signed-in browser still displayed You need access for both. Signed-out browser access has not been checked; no universal inaccessibility is claimed. The website uses direct form buttons and contact help. No participant editor URL is shipped. No account changes or form submissions were made.

## Verification

Both builds and eight page metadata variants pass. Countdown boundaries, independent deadline handling, schedule, all tier benefits and public assets are verified by scripts/verify.mjs. Browser checks cover responsive layouts, direct form targets, tier disclosure, contact navigation/copy, dark footer and removed orbit artwork. No physical-device test, formal performance score or public deployment is claimed.

The public sponsorship guide contains corrected event facts and no QR codes or internal budget. Reports: verification.json and browser-verification.json.
