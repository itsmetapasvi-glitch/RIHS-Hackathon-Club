# Asset sources

- Ocean scroll video: `Ocean_Clean_No_Logo_No_Audio_v2 (1).mp4`, supplied by the user on October 18. Replaces the earlier 720p delivery with 1920x1080 H.264, CRF 16, six-frame keyframes and fast-start metadata; no audio. Scroll poster extracted from the replacement. Hero video remains separate and unchanged.
- RIHS official logo: page 2 of the user's official-logo PDF. Original lettering/proportions preserved; a transparent delivery version is used for light/dark contexts.
- Chick-fil-A preview mark: [official website header asset](https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/04/Chick-fil-A-header-logo.svg). This is an unconfirmed preview placeholder, not a sponsorship claim.
- Geist: [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/geist), originally [Vercel Geist](https://github.com/vercel/geist-font). Self-hosted weights 400/500/600/700; SIL OFL included in `public/fonts/Geist-OFL.txt`.
- Icons: Lucide React, the existing project dependency.
- Hero composition reference only: [Bluewater Capital Group](https://bluewater-capitalgroup.com/).
- Typeface and footer reference: [Do More Growth](https://www.domoregrowth.com/) and the user's supplied screenshots. No business copy, company address, calendar, or unrelated links are reused.

- Surface hero: Ocean_Waves_Logo_Removed_Muted.mp4, supplied by the user on October 18. H.264 video is remuxed without re-encoding, audio omitted, with fast-start metadata; a new poster is extracted.
- Downloadable sponsorship guide: RIHS_Hackathon_2027_Sponsorship_Proposal_Final (1).pdf, supplied by the user on October 18; served unchanged.

- Premium typography: Healing Minds live computed styles verified Crimson Text 400 display (129px/0.9 hero, 56–90px headings, -0.03 to -0.04em) and Inter 400 body (18px/1.5) / 600 small navigation (12px/1.4, +0.11em). Reused those actual families, self-hosted. Crimson Text Latin regular/italic from the site's Google Fonts declarations; Inter Latin 400/500/600 from its Framer font declarations. SIL OFL licenses from the official google/fonts repository are included in public/fonts. No reference imagery or business content is reused.
- Animated ocean exit: the original scroll MP4 remains visible through its actual final frame. The derived ocean-depth image was removed; no replacement backdrop is used. Existing video posters remain only for loading/static accessibility and error fallback.
