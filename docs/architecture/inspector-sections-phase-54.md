# Phase 54: Inspector section foundation

**Status:** Implemented  
**Scope:** Admin block inspector UI only — static grouping of fields into labeled sections.

## Purpose

As block definitions gain more fields, governance hints, and repeaters, a single flat list becomes hard to scan. Phase 54 introduces **one-level static sections** so editors see a predictable grouping without a dynamic form engine.

## What was introduced

### Controlled section keys

Defined in `packages/core/src/content-modeling.ts` as `InspectorSectionKey`:

- `content`
- `media`
- `actions`
- `layout`
- `advanced`

Optional on each `StructuredInspectorFieldDefinition`:

- `section?: InspectorSectionKey`

If `section` is omitted, the **admin inspector defaults to `content`**.

There are **no** arbitrary section ids, no nested sections, and no runtime-loaded section definitions.

### Static labels (admin)

File: `apps/admin/src/components/inspector/inspector-sections.ts`

German labels only, fixed order array `INSPECTOR_SECTION_ORDER`, and helpers `resolveInspectorSectionKey` / `bucketInspectorFieldsBySection`. No tenant or locale branching.

### Rendering

`apps/admin/src/components/editor-inspector.tsx` (`PropsEditing`):

1. Field-level validation summary (unchanged).
2. Governance warnings (non-blocking, unchanged), **above** all field sections.
3. For each section key in fixed order, if the block has at least one field in that section, a simple heading + field list is rendered. Empty sections are skipped.

`InspectorFieldRenderer` and individual field components are unchanged; they receive the same field definitions as before (with an extra optional `section` property).

## What was explicitly not introduced

- No dynamic form builder or schema-driven inspector layout engine.
- No accordion, no persisted expand/collapse, no drag-and-drop, no animation system.
- No change to public rendering or saved block payload shapes.
- No new block types, presets, API routes, migrations, or external dependencies.

## Registry

`apps/admin/src/block-definitions/registry.ts` assigns `section` per field for existing blocks. Legacy `fieldGroups` / `groupId` on those definitions were removed where they duplicated the new grouping; `fieldGroups` remains optional on `AdminBlockDefinition` for compatibility.

## Related types

- Core: `InspectorSectionKey`, `StructuredInspectorFieldDefinition.section`
- Admin: `InspectorFieldDefinition` (extends core shape with concrete `type` union)
