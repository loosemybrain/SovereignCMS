# Phase 63 — Public Experience Systemization: Result

## Summary

Phase 63 introduced a systematic public surface layer to the public rendering app (`apps/web`), addressing inconsistent spacing, uneven block presentation, mixed interaction quality, and accessibility gaps in the public-facing experience.

No new block types, adapters, server actions, API routes, external dependencies, runtime layout engines, or visual builders were added.

---

## Changes Delivered

### New: Public Surface System (`apps/web/src/styles/public-surface-system.css`)

A single CSS file defining:
- Spacing rhythm tokens (`--pub-section-py`, `--pub-section-py-sm`)
- Container width tokens (`--pub-container-max`: 80rem, `--pub-content-max`: 44rem, `--pub-wide-max`: 64rem)
- Surface and border tokens
- Motion governance tokens (`--pub-motion-dur: 180ms`, `--pub-motion-ease`)
- Focus ring tokens (`--pub-focus-color`: blue-500, 2px width, 2px offset)
- `@media (prefers-reduced-motion: reduce)` — globally reduces `--pub-motion-dur` to 0ms and suppresses all animation durations
- Utility classes: `.pub-container`, `.pub-section-py`, `.pub-section-py-sm`, `.pub-section + .pub-section` separator, `.pub-prose`, `.pub-interactive`, `.pub-card`, `.pub-btn-primary`, `.pub-btn-secondary`, `.pub-field`

Imported in `apps/web/src/app/globals.css`.

### Changed: `PublicPageView.tsx`

- Removed the constraining `article.max-w-2xl.p-10` wrapper that was preventing full-width block layouts
- Removed the debug header exposing `tenant.id`, `tenant.displayName`, and `page.locale` publicly
- Moved draft badge and SEO description to preview-mode-only visibility
- Blocks now flow full-width; each block manages its own container and vertical spacing

### Changed: `PublicBlockRenderer.tsx`

- **Hero**: Redesigned from a card (image above, text below in padded box) to a full-bleed section. With image: background overlay with gradient for text legibility; `minHeight: 420px`; text anchored to bottom via flexbox. Without image: clean white section with large editorial typography. H1 scales from `text-4xl` to `text-6xl`.
- **Text**: Wrapped in a proper `<section>` with `pub-container`, `pub-section-py`, and `pub-prose` reading-width constraint. No longer a bare `<p>` in the page flow.
- **CTA**: Full-width section with subtle `bg-subtle` background for visual differentiation. Buttons use `pub-btn-primary` / `pub-btn-secondary`. Eyebrow uses `text-blue-700 tracking-widest`. Mobile: buttons wrap with `flex-wrap`.
- **Feature Grid**: Grid items use `pub-card` class (with hover elevation). Heading/intro area constrained to `max-w-2xl`. Column grid improved: `sm:grid-cols-2 lg:grid-cols-3/4` for better mobile layout.
- **Image-Text**: Container widened, image uses `aspect-ratio: 4/3` with `object-cover`. Gap improved (`gap-10 lg:gap-16`). Graceful fallback: renders a muted placeholder with an image icon when no image is available.
- **Contact Form**: Now rendered in a contained `max-w-2xl` section within `pub-section-py-sm`. Form card border removed (form fields handle their own surface).
- **External Embed**: Wrapped in `pub-section`. Aspect ratio embed uses inline styles for 16:9 ratio.
- All blocks: `pub-section` outer element; `pub-container` inner; `pub-interactive` on interactive elements.

### Changed: `public-contact-form.tsx`

- All inputs/textarea replaced with `pub-field` class (consistent focus ring, min-height, disabled state)
- Submit button uses `pub-btn-primary pub-interactive`
- Labels use explicit `htmlFor` matching unique IDs (`cf-name`, `cf-email`, etc.)
- Required fields announce `(required)` to screen readers via `.sr-only` span alongside visible asterisk
- Phone label displays "(optional)" in subdued text rather than relying on placeholder alone
- Honeypot hidden via `position: absolute; left: -9999px` with `aria-hidden="true"` rather than layout-affecting absolute position
- `noValidate` added to `<form>` to allow custom validation messaging
- `autoComplete` attributes added to name, email, and phone fields

### Changed: `external-media-gate.tsx`

- Consent gate redesigned: centered on a muted background with `minHeight: 280px`
- Added a shield icon for visual clarity
- Button uses `pub-btn-primary pub-interactive`
- Removed hard-coded border/rounded classes in favour of surface system tokens

### Changed: `public-external-embed.tsx`

- Error state: neutral, calm message ("This embed cannot be displayed") without technical details. Uses surface system tokens.
- Aspect ratio implementation uses inline styles (position-based) for reliable cross-browser 16:9 ratio.
- `rounded-xl` and border use surface tokens.

### Changed: `public-footer.tsx`

- Link classes extracted to constants (`linkBase`, `legalLinkBase`) for consistency
- All links use `pub-interactive` for consistent motion
- `focus-visible` rings added to all footer links
- Phone number wrapped in `<a href="tel:...">` for mobile tap-to-call
- Contact address uses `whitespace-pre-line` to respect newlines in address strings
- Social links: `aria-label` now includes `(opens in new tab)` for external links
- Section separators tidied; copyright margin reduced from `mt-10` to `mt-8`
- `border-t border-zinc-700` on footer changed to `border-zinc-800` to match internal dividers

### New: `docs/architecture/public-experience-system-phase-63.md`

Architecture document covering: surface system philosophy, spacing rhythm, container system, motion governance, accessibility presentation, section hierarchy, mobile UX principles, fallback state philosophy, and interaction hierarchy.

---

## Validation Results

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ 15/15 packages passed, 0 errors |
| `npm run lint` | ✅ 0 errors (2 pre-existing warnings in admin, unrelated to this phase) |
| `npm run build` | ✅ Both apps compiled and built successfully |

Pre-existing lint warnings (not introduced in Phase 63):
- `apps/admin/src/components/admin-ui/admin-avatar.tsx` — `<img>` element warning
- `apps/admin/src/components/create-media-asset-form.tsx` — unused variable warning

---

## Limitations

- **Hero image text contrast**: The gradient overlay approach provides good legibility for most images, but very bright images may still result in lower contrast for the headline. A `textShadow` or explicit dark overlay could be added in a future phase if tenant images require it.
- **Block background variety**: Blocks share white/subtle-gray backgrounds. Background selection (per-block) would require CMS schema additions and is out of scope for this phase.
- **Typography system**: Body font remains `system-ui`. A tenant font system (Google Fonts / self-hosted variable fonts) would require adapter work and is a future concern.
- **Navigation mobile search**: The mobile nav is a simple toggle panel. A slide-in drawer or focus-trap implementation would improve mobile UX further but was out of scope.
- **Feature card links**: Feature grid items do not currently link anywhere (the CMS schema has no `href` per item). If item-level links are added in a future phase, `pub-card` hover states will be appropriate.

---

## Acceptance Criteria — Status

| # | Criterion | Status |
|---|---|---|
| 1 | Public surface system exists | ✅ |
| 2 | Public spacing rhythm is more consistent | ✅ |
| 3 | Public section transitions are more cohesive | ✅ |
| 4 | Typography rhythm is improved | ✅ |
| 5 | Public interactions/motion feel more cohesive | ✅ |
| 6 | Public accessibility presentation is improved | ✅ |
| 7 | Mobile spacing/readability is improved | ✅ |
| 8 | Block presentation consistency is improved | ✅ |
| 9 | Public fallback states are calmer and more graceful | ✅ |
| 10 | Navigation/footer cohesion is improved | ✅ |
| 11 | Existing CMS schemas still work | ✅ |
| 12 | Existing public rendering still works | ✅ |
| 13 | Auth/admin behavior remains unchanged | ✅ |
| 14 | Server actions remain unchanged | ✅ |
| 15 | No animation framework added | ✅ |
| 16 | No external dependency added | ✅ |
| 17 | No API route added | ✅ |
| 18 | No database migration added | ✅ |
| 19 | No runtime layout engine added | ✅ |
| 20 | RuntimeConfig not passed to Client Components | ✅ |
| 21 | typecheck/lint/build results documented honestly | ✅ |
