# Phase 60: Publish Governance Foundation

## Philosophy

Publish governance in SovereignCMS is **editorial-first** and **non-blocking**. It helps teams understand publish readiness (accessibility, media integrity, content completeness, SEO metadata) without enforcing approval workflows, automated fixes, or publish interception.

Editors remain in control: they can save drafts, transition status, and publish regardless of governance signals.

## Non-blocking governance

- Governance issues are **hints**, not gates.
- No approval chains, role engines, or API enforcement layers were added.
- `readyToPublish` means **no critical-severity issues** in the current in-memory scan — not a system permission to publish.

## Severity model

| Severity   | Meaning |
|-----------|---------|
| `info`    | Optional improvement; low risk if ignored temporarily |
| `warning` | Should be reviewed; quality or accessibility concern |
| `critical`| Integrity or safety issue (e.g. invalid media URL, missing embed URL, invalid canonical) — still non-blocking |

`readyToPublish === true` when `critical === 0`.

## Category model

| Category        | Typical scope |
|----------------|---------------|
| `accessibility`| Alt text, readable media |
| `media`        | URLs, embeds, assets |
| `content`      | CTAs, empty blocks, grid items |
| `navigation`   | Reserved for future page/navigation checks |
| `seo`          | Page metadata, canonical URL |
| `editorial`    | Headlines, consent copy, provider labels |

## Publish-readiness semantics

1. **Block-level** checks run via `getBlockGovernanceIssues()` (admin).
2. **Page-level** checks aggregate blocks plus title/SEO via `getPageGovernanceIssues()`.
3. **Summary** via `summarizeGovernanceIssues()` in `@sovereign-cms/core` (pure, no I/O).

Structured types live in `packages/core/src/publish-governance.ts`.

## UI surfaces

- **Publish governance panel** — page-oriented list grouped by severity, category icons, optional block focus.
- **Inspector** — block-scoped issues for the selected block (unchanged workflow, structured issues).
- **Editor toolbar** — calm readiness line (no modal, no intercept).

## Why no approval workflow

Enterprise CMS products often conflate *quality signals* with *permission to publish*. Phase 60 deliberately separates them:

- Quality signals scale with content models and locales.
- Approval workflows require org-specific policy, audit, and identity — out of scope here.
- Blocking publish in the editor would fight the existing draft/save/status model without database-backed policy.

Future phases may add optional policy layers **on top of** these semantics, not replace them.

## Extensibility

- Add new block checks in `apps/admin/src/lib/content-governance.ts` by returning `PublishGovernanceIssue[]`.
- Add page checks in `apps/admin/src/lib/page-governance.ts`.
- Keep helpers pure; no RuntimeConfig in client components.
- Do not introduce generic schema validators or AI analysis in this foundation.

## Related phases

- Phase 52.1 — inspector governance warnings (predecessor)
- Phase 59 — media normalization (`normalizeMediaReference`)
