# RIHS Hackathon — ocean/editorial refinement

## Direction and preservation

Evolved the existing four-route site: ocean technology identity, open header and pill actions, existing RIHS logo, centered About, actual sponsor marks, direct forms, schedule and accurate content. No loading intro or mode switch was reintroduced. No Git commit, push or deployment.

Both MP4s, event.ts and the supplied sponsorship PDF remain byte-identical to the previous approved local version. Ocean video quality, hero handoff, serialized seeking and reverse playback are retained. The final seek now includes the last frame, and the live video remains pinned through the content entrance. No sponsor status, event fact, tier benefit or URL was changed.

## The ocean-to-page moment

OceanArrival is a separate, scoped GSAP component. Once the ocean reaches its final frame, a page surface rises from below, scales from 0.86 to 1 and gently flattens from a 7-degree perspective on desktop. Native CSS sticky positioning holds the background steady. On compact screens the rise remains, with less scaling and no perspective rotation. The timeline follows scroll directly in both directions; it adds no competing scroll driver.

The original scroll video now stays sticky through the entire content entrance. The derived WebP backdrop has been removed. The content waits until the real video has reached its final decoded frame; then the page rises over that same video element. The old image-backed transition was replaced because it obscured footage before the end. Other heading choreography, timeline progress, image wipes/parallax, FAQ, menu and cursor behavior remain.

Reduced motion presents the static hero and a normal-flow information page. If videos fail, the same fallback disables the overlap and transforms. Anchor links to About land on the settled surface and retain focus and URL behavior. No duplicate About copy or hidden alternative content.

## Verified reference typography

Inspected https://healingminds.pl/ directly, including live computed styles and inline @font-face declarations:

| Role | Actual reference style | RIHS implementation |
| --- | --- | --- |
| Display | Crimson Text 400; hero 129px / 0.9, tracking -0.04em | Same licensed family; responsive 49–116px hero |
| Editorial headings | Crimson Text 400; 56–90px, tracking -0.03 to -0.04em | Same family, restrained regular/italic hierarchy |
| Body | Inter 400; 18px / 1.5 | Same family, 14–17px by role and viewport, generous leading |
| Small navigation | Inter 600; 12px / 1.4, tracking +0.11em | Inter 500, compact uppercase navigation |

The actual reference font families were identified, not guessed. Both are available under SIL OFL 1.1. Files are self-hosted with font-display: swap and regular display/body preloads. Licenses are included in public/fonts. No reference business copy or imagery was reused. Exact loaded font rules and measurements are recorded in premium-verification.json.

## Color system

| Token | Color | Purpose |
| --- | --- | --- |
| Paper | #f4f2e9 | Soft ivory information surfaces |
| Ink | #0b3542 | Primary text and controls |
| Ocean | #124d60 | Rich aquatic surfaces and editorial emphasis |
| Navy | #082d3a | Schedule and footer |
| Secondary ink | #285461 | Readable supporting text on ivory |
| Light text | #d4e7e4 | Supporting text on ocean/navy |
| Seafoam | #b6d5cb | Restrained emphasis on dark surfaces |

Solid-surface text combinations tested at 5.93:1–12.94:1 contrast. This measures the palette, not a formal accessibility certification or every pixel of photographic backgrounds. Dull gray typography overrides were reset into semantic surface colors. The existing style sheets now sit in one legacy cascade layer; premium.css owns the current typography and palette without specificity escalation.

About uses ivory; challenge uses a contrasting pale aquatic-blue field. The schedule has a shaped navy entrance. Sponsors form a light interlude. Dark aquatic FAQ is followed by an ivory venue call to action and the navy footer. The decorative venue RIHS 2027 artwork was removed at the user’s request. Photo overlays serve readability; no generic startup gradients, glass cards or decorative orbit graphics were added.

## Composition and interaction refinement

| Before | After | Why |
| --- | --- | --- |
| Ocean fades into an ordinary downward page scroll | Reversible rising page surface with restrained depth | Makes the handoff intentional |
| Heavy sans display and competing blues | Verified editorial serif/sans pairing and shared tokens | Cohesive hierarchy |
| Gray supporting type | Rich blue or balanced pale text | Clear, confident readability |
| Large boxed WATER label and tier panels | Image caption, open process and cleaner native tier rows | Stronger image/text relationships |
| Date wraps in mobile facts | Compact tabular fact typography with stable wrapping | Avoids clipping and orphaned digits |

## Checks and limitations

- Public build, private preview build, TypeScript and project verification passed.
- Event countdown boundaries, background timestamp recovery, independent December 6 deadlines, schedule, all tiers/30 benefits, eight route metadata variants, public PDF/media and new font/license assets passed.
- Browser inspection: 1280/1440px desktop; 768px tablet home; 390px mobile routes; 375×667 short-phone hero. No observed horizontal overflow or visible text clipping; intentionally screen-reader-only headings excluded.
- Actual forward and reverse arrival inspected, including mobile. Fixed sticky spacing during implementation, then confirmed stage top stays at 0 while the surface approaches and recedes.
- About anchor URL/focus, skip link, menu scroll lock/Escape, FAQ disclosure, contact email copy, native sponsor details and direct forms retained/checked.
- User reduced-motion toggle removes videos and rise transforms, switches to native scrolling, and restores the full experience when enabled again. OS preference wiring inspected; no OS-level emulation or physical-device/Safari claim.
- A temporary local server deliberately denied both videos. Static hero, normal-flow About and registration navigation remained usable. The temporary server was stopped afterward.
- Returning to the top resumes the original 1920×1080 hero loop. Built-preview console showed no warnings/errors for the inspected routes.
- External form permissions were not changed or reverified signed out. The supplied PDF remains unchanged, including previously noted document/settings differences.

Preview: http://127.0.0.1:5180/. This is local, unpushed work.
