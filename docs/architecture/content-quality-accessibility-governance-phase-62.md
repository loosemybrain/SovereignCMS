# Phase 62: Content Quality & Accessibility Governance

## Purpose

Phase 62 deepens the **non-blocking** publish governance layer introduced in Phase 60. Checks help editors improve accessibility readiness, content completeness, link hygiene, basic SEO, and navigation integrity — without workflows, blocking publish, AI, or generic rule engines.

## Philosophy

- **Guidance, not certification** — messages are editorial hints, not WCAG/BITV audit results.
- **Non-blocking** — editors can save, change status, and publish regardless of issue count.
- **`readyToPublish`** means no `critical` severity in the current in-memory scan, not a permission gate.
- **Pure, local checks** — no DOM parsing, network requests, link crawling, or content mutation.

## Check categories

| Category | Examples |
|----------|----------|
| `accessibility` | Missing alt text, generic alt, vague link labels, consent/submit labels |
| `content` | Empty blocks, CTA/link mismatches, unsafe URL schemes, embed format |
| `editorial` | Missing headlines, short copy, duplicate CTA labels, grid density |
| `media` | Invalid URLs, external media, missing embed URL |
| `seo` | Page title, slug, SEO title/description |
| `navigation` | Empty nav labels, invalid external hrefs, page not in menu |

## Accessibility (readiness only)

- Renderable media without alt → `warning`
- Generic alt (`image`, `bild`, `photo`, …) → `info`
- Vague link labels (`click here`, `hier klicken`, `mehr`, …) → `info`
- Empty prominent headlines → `warning` / `editorial`
- External embed without title or consent copy → `warning`

No compliance claims are made.

## Content completeness

Per block type (CTA, feature grid, image+text, hero, text, contact form, external embed): defensive checks on known prop keys only; malformed props do not throw.

## Link hygiene

Known fields: `primaryHref`, `secondaryHref`, `ctaHref`, `href`, `embedUrl` (where appropriate).

- Unsafe schemes (`javascript:`, `data:`, …) → `critical`
- Label without URL / URL without label → `warning`
- Hash-only `#` → `info`
- External HTTPS on user-facing CTAs → `info`

No broken-link crawling or availability checks.

## SEO hygiene

When page metadata is available: title, slug validation, SEO title/description emptiness. No metadata generation or SEO engine.

## Navigation integrity

When navigation items are loaded server-side for the page editor: empty labels, invalid external hrefs, optional “page not in navigation” hint. No navigation crawler or DB queries from client governance code.

## Implementation map

| Layer | Path |
|-------|------|
| Core helpers | `packages/core/src/governance-helpers.ts` |
| Core types/sort | `packages/core/src/publish-governance.ts` |
| Block checks | `apps/admin/src/lib/content-governance.ts`, `governance-checks.ts` |
| Page checks | `apps/admin/src/lib/page-governance.ts` |
| UI | `apps/admin/src/components/admin-ui/publish-governance-panel.tsx` |

## Explicit non-goals

- Approval workflows, blocking publish, AI validation
- Runtime schema engines, generic validation builders
- API routes, migrations, new block types/presets
- Public rendering, auth guards, server action changes
- Auto-fixing or mutating content during validation
- Passing `RuntimeConfig` into client components

## Future expansion (optional)

- Localized issue message catalogs
- Field-scoped `scope: "field"` for inspector deep links
- Media library asset-level governance on the media admin page
- Optional policy layers on top of signals (not replacing them)

## Related

- Phase 60 — publish governance foundation
- Phase 61 — editorial orientation UX
