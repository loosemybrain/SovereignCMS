# Public Experience System — Phase 63

## Philosophy

The public surface is the tenant's face to the world. It must feel calm, readable, and consistent — not clever. The goal of the public experience system is to provide a shared set of spacing, motion, and surface primitives that all public components draw from, so that visual consistency comes from the system rather than from per-component heroics.

This system is deliberately minimal. It defines what is needed to create a coherent public page experience; it does not attempt to be a design system, a theming engine, or a utility-class framework.

## Surface System — `apps/web/src/styles/public-surface-system.css`

The surface system is a single CSS file imported at the top of `globals.css`. It exposes CSS custom properties (tokens) and a small set of utility classes.

**Tokens defined:**
- `--pub-section-py` / `--pub-section-py-sm` — section vertical rhythm
- `--pub-container-max` / `--pub-content-max` / `--pub-wide-max` — container widths
- `--pub-surface-bg` / `--pub-surface-bg-subtle` / `--pub-surface-bg-muted` — surface backgrounds
- `--pub-surface-border` / `--pub-surface-border-subtle` — border tokens
- `--pub-shadow-card` / `--pub-shadow-card-hover` — elevation levels
- `--pub-motion-dur` / `--pub-motion-ease` — motion tokens
- `--pub-focus-color` / `--pub-focus-width` / `--pub-focus-offset` — focus ring tokens

**Utility classes:**
- `.pub-container` — consistent max-width and horizontal padding across breakpoints, matches the header (80rem / 1280px)
- `.pub-section-py` / `.pub-section-py-sm` — vertical section padding with mobile reduction
- `.pub-section + .pub-section` — automatic subtle separator between adjacent sections
- `.pub-prose` — reading-width constraint (44rem) with editorial line-height
- `.pub-interactive` — shared transition declaration for interactive elements
- `.pub-focusable` — consistent focus-visible ring
- `.pub-card` — standard card surface with hover elevation
- `.pub-btn-primary` / `.pub-btn-secondary` — button primitives with 44px min-height for touch
- `.pub-field` — form input/textarea base style with focus ring

## Spacing Rhythm

All public sections share a consistent vertical rhythm:
- Full sections: `pub-section-py` = 5rem desktop / 3rem mobile
- Compact sections (forms, embeds): `pub-section-py-sm` = 3rem desktop / 2rem mobile
- Section separators: 1px border (`--pub-surface-border-subtle`) between adjacent `.pub-section` elements

The previous `max-w-2xl p-10` article wrapper has been removed. Blocks are now full-width and manage their own container width via `.pub-container`, which mirrors the header and footer at 80rem.

## Motion Governance

Motion is governed entirely through CSS custom properties:
- `--pub-motion-dur: 180ms` — short enough to feel responsive, long enough to be legible
- `--pub-motion-ease: cubic-bezier(0.4, 0, 0.2, 1)` — standard ease-in-out

`@media (prefers-reduced-motion: reduce)` sets `--pub-motion-dur: 0ms` and suppresses all animation/transition durations globally. No component needs to handle this individually.

The `.pub-interactive` class is used on all interactive elements (links, buttons, cards) to apply the shared transition declaration. Direct `transition-colors` inline Tailwind usage is avoided.

## Accessibility Presentation

- **Focus rings**: All interactive elements use a consistent 2px solid blue-500 ring with 2px offset. The `.pub-focusable` class and button/link classes all apply `focus-visible` rings (not `focus`, to avoid ring on mouse click).
- **Touch targets**: Buttons and inputs have `min-height: 44px` via `pub-btn-primary`, `pub-btn-secondary`, and `pub-field`.
- **Contrast**: Primary buttons use `blue-700` (#1d4ed8) on white, which passes WCAG AA. Secondary buttons use gray-900 on gray-100 (passes AA). Footer uses zinc-400 on zinc-950 for body text, zinc-100 for headings.
- **Semantic HTML**: `<section>` for content blocks, `<header>` inside sections only where appropriate, `<address>` for contact info, `aria-label` on all `<nav>` elements, `aria-hidden="true"` on decorative SVGs.
- **Form labels**: All form inputs have explicit `<label htmlFor>` associations. Required fields declare `(required)` to screen readers via `.sr-only` span in addition to the visible asterisk.
- **Reduced motion**: Handled globally at the CSS variable level; no component overrides needed.

## Section Hierarchy Philosophy

Public pages are composed of full-width sections that flow top to bottom. Each section is responsible for its own:
- Vertical padding (via `.pub-section-py`)
- Container width (via `.pub-container`)
- Background treatment

The hero section breaks from the container pattern intentionally: its image spans the full viewport width and the content sits inside the container. All other sections use the container for both the heading/text and any grid content.

Blocks do not use card borders at the section level. Card borders are reserved for grid items (feature cards) and form containers. This prevents the "stack of cards" anti-pattern where every section looks like a floating tile.

## Mobile UX Principles

- Section padding halves on screens below 640px via the surface system CSS media query.
- The hero `minHeight: 420px` shrinks gracefully on mobile since the image covers the full section.
- Button groups use `flex-wrap` so stacked buttons on narrow screens remain readable.
- Form inputs use `pub-field` which enforces `min-height: 44px` for ergonomic touch targets.
- The `pub-container` padding is 1rem on mobile, 1.5rem at sm, 2rem at lg — consistent with the header.

## Fallback State Philosophy

Public content can have missing images or empty fields. The system handles these gracefully:
- **Missing image in image-text block**: Renders a muted placeholder container with a neutral image icon. Does not show a broken image state or an empty space.
- **Invalid embed URL**: Renders a neutral message ("This embed cannot be displayed") without exposing technical error details to end users.
- **Consent gate**: Shows a calm, centered gate with a shield icon, clear description, and a single primary action. Not alarmist.
- **Empty optional fields**: All optional fields (subline, eyebrow, intro, etc.) are simply omitted — no empty elements are rendered.

## Interaction Governance

The interaction hierarchy is:
1. **Primary actions** (CTAs, form submit): `pub-btn-primary` — blue-700 background, white text, hover darkens to blue-800
2. **Secondary actions** (secondary CTA): `pub-btn-secondary` — gray-100 background, gray-900 text, gray-300 border, hover deepens both
3. **Navigation links**: zinc-300→zinc-100 on hover (header), zinc-400→zinc-100 (footer) — subtle, directional
4. **Cards** (feature grid): box-shadow elevation increase + border darkens on hover — communicates interactivity without movement
5. **Inline links**: No animated underlines; standard underline with offset on focus

All hover states use only `color`, `background-color`, `border-color`, `box-shadow`, and `opacity`. No `transform: scale` or layout-affecting transitions are used on content elements to avoid CLS and motion sensitivity issues.
