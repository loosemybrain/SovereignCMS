# Fix: React Renderer Invocation Error

**Status**: ✅ Complete  
**Date**: May 6, 2026  
**Issue**: "Expected a constant size argument for each invocation of useMemoCache"

## Problem

React Components wurden direkt als Funktionen aufgerufen statt über JSX gerendert:

```typescript
// ❌ WRONG – Calling a component like a function
return definition.adminRenderer(block)
```

Dies verstößt gegen React-Regeln und führt zu Compilation-Fehlern mit React's memo caching system.

## Root Cause

Die `AdminBlockRenderer` Type war als Function-Signature definiert:

```typescript
// ❌ BEFORE – Function type
export type AdminBlockRenderer = (block: CmsBlock) => JSX.Element
```

Dies führte dazu, dass Entwickler die Komponente als normale Funktion aufrufen würden.

## Lösung

### 1. Type als ComponentType definieren

```typescript
// ✅ AFTER – Component type
import type { ComponentType } from "react"

export type AdminBlockRenderer = ComponentType<{
  block: CmsBlock
}>
```

Dies signalisiert deutlich, dass es sich um eine React Component handelt.

### 2. Alle Renderer-Funktionen anpassen

**Vorher**:
```typescript
export function HeroAdminRenderer(block: CmsBlock) {
  return <div>...</div>
}
```

**Nachher**:
```typescript
export function HeroAdminRenderer({ block }: { block: CmsBlock }) {
  return <div>...</div>
}
```

Alle Renderer:
- `HeroAdminRenderer`
- `TextAdminRenderer`
- `FallbackAdminRenderer`

### 3. Renderer-Registry über JSX rendern

**Vorher**:
```typescript
export function renderAdminBlock(block: CmsBlock) {
  const definition = getAdminBlockDefinition(block.type)
  if (!definition) {
    return FallbackAdminRenderer(block)
  }
  return definition.adminRenderer(block)  // ❌ Direct invocation
}
```

**Nachher**:
```typescript
export function renderAdminBlock(block: CmsBlock) {
  const definition = getAdminBlockDefinition(block.type)
  if (!definition) {
    return <FallbackAdminRenderer block={block} />  // ✅ JSX
  }
  const Renderer = definition.adminRenderer
  return <Renderer block={block} />  // ✅ JSX
}
```

## Auswirkungen

### Geänderte Dateien

1. `apps/admin/src/components/block-renderers/types.ts`
   - Type `AdminBlockRenderer` neu als `ComponentType<{ block: CmsBlock }>`

2. `apps/admin/src/components/block-renderers/hero-renderer.tsx`
   - Signature: `({ block })` statt `(block)`

3. `apps/admin/src/components/block-renderers/text-renderer.tsx`
   - Signature: `({ block })` statt `(block)`

4. `apps/admin/src/components/block-renderers/fallback-renderer.tsx`
   - Signature: `({ block })` statt `(block)`

5. `apps/admin/src/components/admin-block-renderer-registry.tsx`
   - Rendern via JSX statt direkter Funktionsaufruf
   - Pattern: `<Renderer block={block} />`

### Keine Änderungen nötig

- `apps/admin/src/block-definitions/registry.ts` – Komponenten werden korrekt referenziert (nicht aufgerufen)
- `apps/admin/src/components/page-editor-client.tsx` – Nutzt bereits `renderAdminBlock()` via JSX

## Validierung

✅ **TypeScript**: `npm run typecheck` → EXIT 0  
✅ **Build**: `npm run build` → EXIT 0  
✅ **Linting**: `npm run lint` → EXIT 0  
✅ **No Errors**: Alle Dateien ohne Linter-Fehler  

## React Best Practices

Diese Änderung folgt React-Best-Practices:

1. **Components sind nicht Funktionen** – Sie sollten als JSX gerendert werden, nicht aufgerufen
2. **Props-Struktur** – Props als Objekt übergeben, nicht als einzelne Argumente
3. **Type Safety** – `ComponentType<Props>` ist die richtige TypeScript-Signatur für React Components
4. **Memo Compatibility** – React's internal optimization systems (wie useMemoCache) funktionieren nur mit JSX-Rendering

## Testing

Um sicherzustellen, dass Renderer funktionieren:

```typescript
// In any component:
const block = { /* ... */ }
const element = renderAdminBlock(block)
// element is now valid JSX that React can render
```

## Keine Verhaltensänderungen

Die Änderung ist **rein syntaktisch**. Das Rendering-Ergebnis ist identisch:

- Blocks werden weiterhin korrekt gerendert
- Props werden weiterhin korrekt übergeben
- Fallback-Rendering funktioniert weiterhin

---

**Result**: All React invocation rules now followed ✅
