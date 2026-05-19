# Public Block Harmonization — Phase 64

## Purpose

Phase 63 introduced the public surface system (spacing, containers, typography, interaction, focus, and fallback primitives). Phase 64 applies that system consistently across existing public block renderers and chrome (header, footer, forms, embeds) so the public site reads as one cohesive experience.

This phase harmonizes presentation only. It does not change the public rendering architecture, editor data model, block schemas, or server actions.

## Scope

### In scope

- `PublicBlockRenderer` — hero, text, CTA, feature-grid, image-text, contact-form, external-embed
- `public-contact-form.tsx`, `public-external-embed.tsx`, `external-media-gate.tsx`
- `public-header.tsx`, `public-footer.tsx` (chrome cohesion)
- Extensions to `public-surface-system.css` for block-specific layout helpers that remain system-level (hero, split, feature grid, embed shell, form stack, chrome footer)

### Out of scope

- New block types, presets, or schemas
- Dynamic inspector fields or custom CSS/JS fields
- Visual builder, runtime layout engines, API routes, database migrations
- External dependencies
- Auth/admin guard changes
- Passing `RuntimeConfig` into Client Components

## Public surface extensions (Phase 64)

Phase 64 extended `apps/web/src/styles/public-surface-system.css` with shared primitives used by multiple blocks:

| Class / token group | Role |
|---|---|
| `.pub-section`, `.pub-section--white`, `.pub-section--subtle` | Section shell and background variants |
| `.pub-h1` … `.pub-h3`, `.pub-eyebrow`, `.pub-lead`, `.pub-body` | Editorial typography rhythm |
| `.pub-content-narrow`, `.pub-content-wide`, `.pub-content-center` | Content max-widths aligned to Phase 63 tokens |
| `.pub-hero*`, `.pub-split`, `.pub-media-frame` | Hero and image-text layout |
| `.pub-feature-grid--2/3/4`, `.pub-card` | Feature grid density |
| `.pub-actions`, `.pub-stack-header` | CTA and section headers |
| `.pub-fallback`, `.pub-notice` | Calm empty/error states |
| `.pub-embed-shell`, `.pub-consent-panel` | External embed and consent gate |
| `.pub-form-*`, `.pub-field` | Contact form rhythm |
| `.pub-chrome*`, `.pub-chrome-footer*` | Header/footer interaction and hierarchy |

## Block harmonization patterns

### Shared section wrapper

`PubSection` in `PublicBlockRenderer.tsx` wraps most blocks in:

- `pub-section` + white/subtle variant
- `pub-container` + `pub-section-py` or `pub-section-py-sm`

Hero remains a full-bleed `pub-section pub-hero` without the inner wrapper pattern so media can span the viewport.

### Media governance

Hero and image-text use `normalizeMediaReference` from core. Invalid media shows a calm notice or `PubFallback`; no raw unsafe URLs are rendered.

### Empty content

Blocks with no meaningful content return `null` (no fake placeholder sections). Partial content (e.g. feature grid with headline but no items) uses `PubFallback` with editorial copy.

### CTA and links

Primary/secondary buttons use `pub-btn-primary` / `pub-btn-secondary` with `pub-interactive` and `pub-focusable`. Links are only rendered when `isValidHref` passes.

### Backward compatibility

All existing block props remain supported, including `itemsJson` on feature-grid and legacy `imageUrl` / `mediaUrl` fields. No prop renames or removals.

## Relationship to Phase 63

Phase 63 defined the surface system and first-pass block updates. Phase 64 completes alignment: removes remaining block-local spacing/typography drift, unifies fallbacks, and documents the harmonized public block layer.

## Validation expectations

After implementation, the monorepo should pass `npm run typecheck`, `npm run lint`, and `npm run build` with results recorded in `docs/migration/phase-64-result.md`.
