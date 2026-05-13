# Phase 52.1: Inspector Governance Hardening

**Note**: Phase 52.1 follows Phase 52 (Controlled Repeater Foundation). It stabilizes the inspector with modularization and adds lightweight content governance warnings.

## Overview

Phase 52.1 makes two key improvements:

1. **Modularized Inspector Fields**: Split the large `inspector-field-renderer.tsx` into small static field components for better maintainability.
2. **Lightweight Content Governance**: Add non-blocking editor-only warnings to help editors improve block content quality.

This phase does NOT introduce:
- A generic validation framework
- Publishing constraints
- New block types
- Presets

## Philosophy

Inspector governance warnings are **editor-only, non-blocking hints** that help content creators understand best practices without enforcing rigid rules. They serve as a friendly guide, not a policy enforcer.

## Modularized Field Rendering

### Structure

The inspector field renderer has been split into static field components:

- `apps/admin/src/components/inspector/fields/text-field.tsx`
- `apps/admin/src/components/inspector/fields/textarea-field.tsx`
- `apps/admin/src/components/inspector/fields/select-field.tsx`
- `apps/admin/src/components/inspector/fields/media-field.tsx`
- `apps/admin/src/components/inspector/fields/simple-list-field.tsx`

The main router (`inspector-field-renderer.tsx`) uses a switch statement to delegate to the appropriate component.

### Benefits

- **Maintainability**: Each field type has its own file and is easier to understand.
- **Scalability**: Adding new field types is straightforward.
- **Testability**: Individual field components can be tested in isolation.
- **No dynamic registry**: Static imports prevent lazy-loading complexity.

### Behavior Preserved

- All existing field types continue to work identically.
- Accessibility labels and ARIA attributes are preserved.
- Placeholder text, disabled states, and constraints (minItems/maxItems) work as before.
- Field update handling remains deterministic.

## Content Governance System

### Core Concept

The governance system provides non-blocking warnings for block content:

```typescript
type GovernanceWarning = {
  id: string
  severity: "info" | "warning"
  message: string
  fieldPath?: string
}

function getBlockGovernanceWarnings(block: CmsBlock): GovernanceWarning[]
```

### Key Properties

- **Editor-only**: Governance logic lives in admin code, not runtime.
- **Non-blocking**: Warnings do not prevent saving or publishing.
- **Deterministic**: Pure function, no side effects.
- **Lightweight**: No external dependencies or generic frameworks.

### UI Rendering

Warnings render in the inspector under "Content Hinweise" (Content Hints) when available:

- **Info severity**: Blue background, light styling.
- **Warning severity**: Amber background, more prominent styling.
- **No warnings**: Section is not rendered (keep UI clean).

## Warnings by Block Type

### CTA

- ⚠️ **Warning**: No headline
- ℹ️ **Info**: Primary button label without href
- ℹ️ **Info**: Primary button href without label
- ℹ️ **Info**: Secondary button label without href
- ℹ️ **Info**: Secondary button href without label

### Feature Grid

- ⚠️ **Warning**: No headline
- ⚠️ **Warning**: No valid items
- ⚠️ **Warning**: Duplicate item IDs
- ℹ️ **Info**: Grid item has no title
- ℹ️ **Info**: Grid item has no description

### Image + Text

- ⚠️ **Warning**: No headline
- ℹ️ **Info**: Image without alt text
- ℹ️ **Info**: CTA button label without href
- ℹ️ **Info**: CTA button href without label

### Contact Form

- ℹ️ **Info**: No consent text
- ℹ️ **Info**: No recipient email specified

### External Embed

- ⚠️ **Warning**: No provider specified
- ℹ️ **Info**: No embed URL

### Hero & Text

- ⚠️ **Warning**: No headline/body

## Feature Grid Item Governance

Simple-list repeater items are validated within the governance system:

- Empty titles and duplicate IDs are detected and warned about.
- Warnings do not prevent saving malformed items.
- Editors can keep invalid items and fix them later if needed.

This preserves flexibility while providing guidance.

## What Phase 52.1 Does NOT Include

❌ **Generic Validation Framework**: Rules are hardcoded per block type, not schema-driven.  
❌ **Publish Blocking**: Warnings never prevent publishing or saving.  
❌ **Runtime Governance**: All checks happen in admin, not public runtime.  
❌ **Legal/Compliance Claims**: Warnings are friendly hints, not legal assurances.  
❌ **New Block Types**: Only existing blocks receive warnings.  
❌ **Presets**: No preset library or configuration system.  
❌ **API Routes**: No new endpoints.  
❌ **Database Migrations**: No schema changes.

## Files Modified

### Admin App

- `apps/admin/src/components/inspector/inspector-field-renderer.tsx`: Refactored to use modular components
- `apps/admin/src/components/inspector/fields/text-field.tsx`: New (text input)
- `apps/admin/src/components/inspector/fields/textarea-field.tsx`: New (textarea input)
- `apps/admin/src/components/inspector/fields/select-field.tsx`: New (select dropdown)
- `apps/admin/src/components/inspector/fields/media-field.tsx`: New (media picker)
- `apps/admin/src/components/inspector/fields/simple-list-field.tsx`: New (simple-list repeater)
- `apps/admin/src/components/editor-inspector.tsx`: Integrated governance warnings
- `apps/admin/src/lib/content-governance.ts`: New (governance logic)

### Documentation

- `docs/architecture/inspector-governance-phase-52-1.md`: This file
- `docs/migration/phase-52-1-result.md`: Implementation results

## Next Steps

Future phases may introduce:

- **Phase 53+**: Preset library for block configurations
- **Phase 54+**: Controlled array editor enhancements
- **Phase 55+**: Additional governance checks as patterns emerge

## Conclusion

Phase 52.1 stabilizes the inspector architecture and adds lightweight, non-blocking content guidance. Editors see helpful hints without enforcement, maintaining flexibility while encouraging best practices.

All hard rules followed. Existing blocks remain unaffected. Public rendering is unchanged.
