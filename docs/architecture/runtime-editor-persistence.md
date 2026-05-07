# Runtime Editor Persistence

## Übersicht

Der Editor spricht **nur mit der Runtime**, nicht direkt mit DB oder Persistierungs-Adaptern. Die Runtime kapselt die EditorPersistence-Strategie ein.

## Architektur

```
PageEditorClient
    ↓
runtime.editorPersistence.savePageDraft(input)
    ↓
[Runtime] EditorPersistence Interface
    ↓
[Currently] Mock (500ms delay)
[Future] API Route
[Future] Direct DB Write
```

## Persistence im Runtime

In `packages/runtime/src/editor-persistence.ts`:

```typescript
export function createEditorPersistence(): EditorPersistence {
  return {
    async savePageDraft(input): Promise<SavePageDraftResult> {
      // Currently: Mock mit console.log
      // Later: Kann auf API oder DB switchen
    }
  }
}
```

In `createRuntime()`:

```typescript
editorPersistence: createEditorPersistence()
```

## PageEditorClient Integration

```typescript
type PageEditorClientProps = {
  runtime: SovereignRuntime
  // ...
}

const result = await runtime.editorPersistence.savePageDraft({
  tenantId: tenant.tenantId,
  pageId: page.id,
  blocks: draftBlocks,
})
```

## Vorteile dieser Struktur

- **Entkopplung**: Editor kennt keine DB oder Repository
- **Austauschbar**: EditorPersistence kann leicht swapped werden
- **Testbar**: Mock-Adapter für Dev/Test
- **Erweiterbar**: Später API/DB ohne Editor-Code-Änderung

## Noch immer Mock-Only

- ✗ Keine echte Persistierung
- ✗ Keine API Route
- ✗ Keine DB Writes
- ✓ Vorbereitet für Phase 12+ (API Integration)

## Wichtig: Kein Repository Direct Write

- ✗ Kein `runtime.db.pages.update(...)`
- ✗ Kein `runtime.db.blocks.update(...)`
- ✓ Nur EditorPersistence-Adapter
