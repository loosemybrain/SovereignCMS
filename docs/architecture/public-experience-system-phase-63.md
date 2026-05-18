# Phase 63: Public Experience Systemization

## Philosophy

The public site shares the same CMS content as the admin editor, but visitors need a **calm, cohesive reading experience** — not a separate visual builder or layout engine. Phase 63 systemizes surfaces, spacing, typography, motion, and interaction through **CSS primitives** and targeted component class updates.

## Public surface system

**File:** `apps/web/src/styles/public-surface-system.css`

Controlled tokens and classes:

| Area | Primitives |
|------|------------|
| Spacing | `--public-space-block`, section padding via `pub-page`, `pub-block-stack` |
| Containers | `pub-container` (chrome), `pub-page` / `--public-content-wide` (body) |
| Surfaces | `pub-block`, `pub-card`, `pub-form-surface` |
| Typography | `pub-heading-hero`, `pub-heading-section`, `pub-body`, `pub-text-block` |
| Interaction | `pub-btn`, `pub-link`, `pub-interactive` (buttons only for lift) |
| Chrome | `pub-chrome`, `pub-chrome-link`, `pub-chrome-btn` |
| Fallbacks | `pub-fallback-media`, `pub-notice--*` |

Imported from `apps/web/src/app/globals.css`. No runtime theme engine.

## Section hierarchy

1. **Chrome** — header/footer (`pub-container`, zinc palette unchanged in spirit).
2. **Page** — `pub-page` article with meta + `pub-block-stack`.
3. **Blocks** — `pub-block` sections with consistent radius, border, shadow.
4. **Text-only** — `pub-text-block` without heavy card chrome for long-form flow.

## Motion governance

- Transitions use `--public-transition-fast` (140ms).
- Subtle `translateY(-1px)` on **primary/secondary buttons only** when motion is allowed.
- `@media (prefers-reduced-motion: reduce)` disables transitions and transforms.
- No animation framework.

## Accessibility presentation

- `focus-visible` outlines on buttons, links, and form fields.
- Minimum touch targets on `pub-btn` and `pub-chrome-link` (~2.5–2.75rem).
- Form labels, `role="alert"` / `role="status"` preserved on contact form.
- Calmer error/success notices — not alarmist red panels.

No WCAG/BITV certification claims.

## Mobile UX

- Fluid padding via `clamp()` on page and block inner areas.
- `pub-block-stack` gap increases slightly from `md` breakpoint.
- CTA actions wrap with `pub-actions`; full-width submit on contact form.
- Header mobile panel uses `pub-chrome-btn` and vertical nav spacing.

## Fallback states

- Hero / image-text use `normalizeMediaReference` (aligned with admin governance).
- Missing media: `pub-fallback-media` with editorial copy (no lorem).
- Invalid media: `pub-notice--danger` (short message).
- Empty feature grid: muted notice when headline/intro exist without items.
- Invalid embed: calm danger notice before iframe.

## Interaction governance

- Primary CTAs: `pub-btn--primary`.
- Secondary: `pub-btn--secondary`.
- Chrome links: no hover lift — color transition only.
- External embed: consent gate uses same button system.

## Explicit non-goals

- Visual page builder, layout engine, dynamic theming
- New block types, presets, API routes, migrations
- Admin/editor architecture changes
- `RuntimeConfig` in client components

## Related

- Phase 59 — media normalization
- Phase 62 — governance (public presentation only, not audit engine)
