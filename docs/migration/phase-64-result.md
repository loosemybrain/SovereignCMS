# Phase 64 — Public Block Harmonization: Result

## Summary

Phase 64 harmonized existing public block renderers and chrome components to the public surface system introduced in Phase 63. Presentation is now consistent across hero, text, CTA, feature-grid, image-text, contact-form, external-embed, and header/footer.

No new block types, presets, schemas, API routes, database migrations, external dependencies, dynamic inspector systems, or custom CSS/JS fields were added. Public rendering architecture, server actions, auth/admin guards, and the editor data model were not changed.

---

## Changes Delivered

### Extended: `apps/web/src/styles/public-surface-system.css`

Added system-level primitives for block harmonization:

- Section variants (`.pub-section`, `--white` / `--subtle`)
- Typography scale (`.pub-h1` … `.pub-body`, `.pub-eyebrow`, `.pub-lead`)
- Content width helpers (`.pub-content-narrow`, `.pub-content-wide`, `.pub-content-center`)
- Hero (`.pub-hero*`), split layout (`.pub-split`), media frame (`.pub-media-frame`)
- Feature grid column modifiers (`.pub-feature-grid--2/3/4`)
- Fallback and notice surfaces (`.pub-fallback`, `.pub-notice`)
- Embed shell and consent panel (`.pub-embed-shell`, `.pub-consent-panel`)
- Form stack (`.pub-form-*`)
- Chrome footer/header link treatments (`.pub-chrome*`, `.pub-chrome-footer*`)

### Refactored: `PublicBlockRenderer.tsx`

- Introduced `PubSection` and `PubFallback` helpers for shared section rhythm
- **Hero**: `normalizeMediaReference`; full-bleed `pub-hero`; invalid-only media shows calm notice; `aria-hidden` on decorative media when no text
- **Text**: `pub-prose` + narrow centered content; empty body returns `null`
- **CTA**: `pub-section--subtle`, typography stack, `pub-actions`, safe href gating, focus-visible on links
- **Feature grid**: normalized items + `itemsJson` fallback; `pub-card` grid; empty items use `PubFallback`
- **Image-text**: `pub-split` responsive layout; media governance fallbacks; CTA with safe href
- **Contact form / external embed**: wrapped in `PubSection` with appropriate content widths

### Updated: supporting components

- `public-contact-form.tsx` — `pub-h2`, `pub-lead`, `pub-form-*`, `pub-field`, `pub-btn-primary`, `pub-notice`
- `public-external-embed.tsx` — `pub-notice`, `pub-embed-shell`
- `external-media-gate.tsx` — `pub-consent-panel`, shared button/typography classes
- `public-footer.tsx` — `pub-chrome-footer`, `pub-chrome-footer-link`, divider tokens
- `public-header.tsx` — already used `pub-chrome-link` / `pub-chrome-btn` (now defined in surface CSS)

### New documentation

- `docs/architecture/public-block-harmonization-phase-64.md`

---

## What Was Not Changed

| Area | Status |
|---|---|
| Block types / presets | Unchanged |
| CMS schemas | Unchanged |
| Server actions (contact submit) | Unchanged |
| Auth / admin guards | Unchanged |
| Public page routing / `PublicPageView` architecture | Unchanged |
| RuntimeConfig in Client Components | Not introduced |
| Third-party dependencies | None added |

---

## Validation Results

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ 15/15 packages passed, 0 errors |
| `npm run lint` | ✅ 0 errors |
| `npm run build` | ✅ `apps/web` and `apps/admin` built successfully |

Pre-existing lint warnings (not introduced in Phase 64):

- `apps/admin/src/components/admin-ui/admin-avatar.tsx` — `<img>` element warning
- `apps/admin/src/components/create-media-asset-form.tsx` — unused variable warning
- `apps/admin/src/lib/admin-i18n/index.ts` — unused import warning

---

## Acceptance Criteria — Status

| # | Criterion | Status |
|---|---|---|
| 1–7 | Hero, text, CTA, feature-grid, image-text, contact-form, external-embed harmonized | ✅ |
| 8 | Header/footer/navigation more cohesive | ✅ |
| 9 | Public mobile spacing improved | ✅ |
| 10 | Focus-visible behavior strong | ✅ |
| 11 | Calmer fallback states | ✅ |
| 12 | Block props backward-compatible | ✅ |
| 13–19 | No new blocks/presets/schema/API/deps/inspector/CSS-JS | ✅ |
| 20–23 | Editor, architecture, tenant/brand, locale preserved | ✅ |
| 24 | RuntimeConfig not in Client Components | ✅ |
| 25 | typecheck/lint/build documented honestly | ✅ |

---

## Limitations

- Dedicated legal *block* types are not in the public block renderer; legal pages use standard text blocks and footer legal links.
- Hero CTA links are not part of the current hero schema; CTA block handles button hierarchy separately.
- Feature grid items still have no per-item links in schema.
- Visual QA on real tenant content (bright hero images, long German copy) remains a manual check.
