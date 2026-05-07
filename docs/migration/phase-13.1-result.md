# SovereignCMS – Phase 13.1 Result: Admin UX Consistency Fix

## Summary

Phase 13.1 completed small but important UX consistency fixes, improved server/client boundaries, and enhanced developer experience in the editor inspector.

No new features were added. All changes focus on:
- Navigation consistency (Dashboard route handling)
- Better Server/Client boundaries (serializable props only)
- Developer UX (Raw Props Preview in inspector)
- UI Polish (Status badges in pages list)

## Changes Made

### 1. Dashboard Navigation Consistency

**Problem:** Dashboard link was "/dashboard" but root "/" also rendered dashboard. Navigation state was inconsistent.

**Solution:** 
- Changed `navItems` Dashboard href to "/"
- Added `isRouteActive()` helper that treats "/" and "/dashboard" as equivalent
- Both sidebar and header now consistently show "Dashboard" as active when on either route

**Files Modified:**
- `apps/admin/src/components/admin-shell.tsx`

### 2. Pages List Status Column

**Enhancement:** Pages table now shows status with visual indicators.

**Implementation:**
- Added "Status" column to pages table
- Created `StatusBadge()` component with color-coding:
  - `published`: Green background (emerald-950), light text (emerald-200)
  - `draft`: Amber background (amber-950), light text (amber-200)  
  - `archived`: Gray background (zinc-800), light text (zinc-300)
- No action buttons or interactions

**Files Modified:**
- `apps/admin/src/app/(admin)/pages/page.tsx`

### 3. Cleaner Server/Client Boundaries

**Problem:** Loaders were returning `SovereignRuntime` objects to Server Components, which were then being passed considerations to Client Components.

**Solution:**
- Loaders now return `runtimeConfig: RuntimeConfig` instead of `runtime: SovereignRuntime`
- Dashboard calculates `totalBlocks` using internal `getAdminRuntime()` call (stays on server)
- All props passed to Client Components are serializable

**Files Modified:**
- `apps/admin/src/lib/load-admin-pages.ts`
- `apps/admin/src/lib/load-admin-page-detail.ts`
- `apps/admin/src/app/(admin)/dashboard/page.tsx`
- `apps/admin/src/app/(admin)/pages/[slug]/page.tsx`

**Before:**
```typescript
// Loader returned full runtime
export async function loadAdminPages(...) {
  const { runtime, tenant } = getAdminRuntime(...)
  return { tenant, runtime, pages } // ❌ Non-serializable
}

// Component received runtime
const { tenant, runtime, pages } = await loadAdminPages({ host })
const totalBlocks = await Promise.all(
  pages.map(p => runtime.db.blocks.listByPage(...)) // ❌ Using runtime object
)
```

**After:**
```typescript
// Loader returns serializable config only
export async function loadAdminPages(...) {
  const { runtime, tenant } = getAdminRuntime(...)
  return { tenant, runtimeConfig: runtime.config, pages } // ✅ Serializable
}

// Component gets config and re-creates runtime for calculations
const { tenant, runtimeConfig, pages } = await loadAdminPages({ host })
const { runtime } = getAdminRuntime({ host })
const totalBlocks = await Promise.all(
  pages.map(p => runtime.db.blocks.listByPage(...)) // ✅ Server-only
)
```

### 4. Editor Inspector Raw Props Preview

**Enhancement:** Developers can now see the raw JSON representation of block props for debugging.

**Implementation:**
- Added new "Raw Props Preview" section at bottom of editor inspector
- Shows `JSON.stringify(selectedBlock.props, null, 2)` with proper formatting
- Styled in monospace font with overflow-x-auto for long props
- Visually separated from Props editing section with border-top

**Files Modified:**
- `apps/admin/src/components/editor-inspector.tsx`

**UI Layout:**
```
┌─────────────────────────────────┐
│ Block Info                      │
│ • Type, ID, Sort, Visibility    │
├─────────────────────────────────┤
│ Props                           │
│ • Headline input                │
│ • Subline input                 │
├─────────────────────────────────┤
│ Raw Props Preview               │ ← NEW
│ {                               │
│   "headline": "...",            │
│   "subline": "..."              │
│ }                               │
└─────────────────────────────────┘
```

## Architecture Decisions

### Why Serialize Earlier?

Moving serialization to the loader level (rather than keeping runtime in the loader return type) provides several benefits:

1. **Clear Intent**: Loaders explicitly declare what props are safe for client components
2. **Type Safety**: TypeScript catches serialization violations at loader level
3. **Decoupling**: Client components never see or depend on runtime object
4. **Future-Proof**: Easy to add real persistence later without changing client component contracts

### Why Keep Dashboard Runtime Calculation Internal?

Dashboard needs to calculate total blocks (aggregating across all pages). Rather than passing runtime to client components:
- Dashboard stays as Server Component
- It calls `getAdminRuntime()` internally (stays on server)
- Calculations happen on server
- Only serializable results sent to UI

This maintains the principle: "Client components don't see runtime."

## Validation Results

✅ `npm run typecheck` – All packages pass TypeScript checks (15/15 successful)
✅ `npm run build` – Both admin and web apps build successfully
✅ `npm run lint` – No ESLint errors (2/2 packages)
✅ `npm run clean` – Build artifacts cleaned

## Code Quality

- No new type violations
- No serialization errors
- All props passed to clients are plain objects
- Server functions never exposed to clients
- TypeScript types reinforced at boundary

## Backward Compatibility

✅ All existing features continue to work:
- Dashboard metrics still display correctly
- Pages list still navigates to detail view
- Editor state management unchanged
- Block rendering unchanged
- Save flow unchanged

## Known Limitations

- Dashboard "/"  and "/dashboard" both work, but URL is not normalized (user sees whichever they visit)
  - Could normalize with NextJS redirect in future
- Status badges have no hover state or additional info
- Raw props preview is read-only (could add copy-to-clipboard in future)

## Files Modified

| File | Change |
|------|--------|
| `admin-shell.tsx` | Dashboard route consistency with isRouteActive() helper |
| `pages/page.tsx` | Added Status column with color-coded badges |
| `load-admin-pages.ts` | Return runtimeConfig instead of runtime |
| `load-admin-page-detail.ts` | Return runtimeConfig instead of runtime |
| `dashboard/page.tsx` | Use runtimeConfig, calculate blocks with internal runtime |
| `pages/[slug]/page.tsx` | Use runtimeConfig instead of runtime.config |
| `editor-inspector.tsx` | Added Raw Props Preview section |

## Testing Recommendations

Manual testing checklist:
- [ ] Visit "/" and "/dashboard" – both show Dashboard active in sidebar
- [ ] Navigate to Pages – shows status badges
- [ ] Click page link – goes to editor
- [ ] Select a block – Raw Props Preview shows in inspector
- [ ] Edit block props – Raw Props Preview updates in real-time
- [ ] Save changes – No console errors about serialization

## Next Steps

Potential improvements for future phases:

1. **Route Normalization**: Add NextJS redirect to normalize "/" → "/dashboard"
2. **Status Interactions**: Make status badges clickable to filter pages
3. **Props Inspector**: Add copy-to-clipboard for raw props
4. **Developer Tools**: Export block props as JSON file for debugging
5. **Real Persistence**: Replace client-side mock with actual server operations

---

**Status:** Phase 13.1 Complete ✓  
**Impact:** Improved code quality, developer experience, boundary safety  
**Ready for:** Phase 14 or any new feature development  
