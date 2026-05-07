# Admin UX Shell Architecture

## Overview

The Admin application provides a professional, multi-tenant CMS management interface. Phase 13 refined the shell architecture and editor layout to support modern admin workflows while maintaining strict Server/Client boundaries and no persistence logic.

## Shell Structure

### Components

#### `AdminShell` (Client Component)
Main layout wrapper that provides:
- **Sidebar Navigation**: Always-visible vertical navigation with active state indicator
- **Sticky Header**: Page context and tenant info
- **Main Content Area**: Max-width constrained content region

Properties:
- `children: React.ReactNode` - Page content
- `tenant: AdminTenantContext` - Current tenant info
- `runtimeConfig: RuntimeConfig` - Serializable runtime config (not the full runtime object)

#### `DashboardCard` (Client Component)
Reusable metric card component:
- Title (uppercase, small)
- Large value (monospace)
- Optional description
- Variants: "default" | "highlight"

Usage:
```tsx
<DashboardCard
  title="Pages"
  value={pages.length}
  description="Total CMS pages"
/>
```

#### `PageEditorClient` (Client Component)
Main editor interface with:
- Blocks preview area (left column)
- Sticky inspector (right column)
- Save controls
- Dirty state management

Props:
- `page: CmsPage`
- `blocks: CmsBlock[]`
- `tenant: AdminTenantContext`
- `runtimeConfig: RuntimeConfig`

### Navigation Structure

```
Dashboard (/)
├─ Overview metrics
├─ Runtime config display
└─ Pages count & blocks count

Pages (/pages)
├─ Table listing all pages
├─ Title (clickable → detail)
├─ Slug, Locale, Status, Updated
└─ Empty state handling

Page Detail (/pages/[slug])
├─ Header with metadata badges
├─ Back link to pages list
├─ Block editor area
│  ├─ Blocks list (left)
│  └─ Sticky inspector (right)
└─ Save controls & status

Media (/media) [Placeholder]
Settings (/settings) [Placeholder]
```

## Data Flow

### Dashboard
```
Server Component
  ↓
loadAdminPages()
  ↓
getAdminRuntime()
  ↓
Tenant resolved from ENV/Host
  ↓
runtime.db.pages.listByTenant()
  ↓
Pass serializable props to Client
  ↓
DashboardCard components render
```

### Page List
```
Server Component
  ↓
loadAdminPages({ host })
  ↓
Pass page[] to Client
  ↓
Table renders with Link to detail
  ↓
Click navigates to [slug] route
```

### Page Editor
```
Server Component (/pages/[slug])
  ↓
loadAdminPageDetail({ slug, host })
  ↓
Fetch page + blocks from runtime.db
  ↓
Pass to PageEditorClient
  ↓
Client: useEditorState() manages draft state
  ↓
User edits blocks locally
  ↓
Client-side mock persistence (no DB write)
```

## Layout Patterns

### Sidebar Layout
```
┌─────────────────────────────────────┐
│ LOGO    │                           │
│ Tenant  │                           │
├─────────┤     Main Content          │
│ Nav     │                           │
│ Items   │                           │
│ ...     │                           │
├─────────┤                           │
│ Config  │                           │
│ Info    │                           │
└─────────────────────────────────────┘
```

### Editor Layout
```
┌───────────────────────────────────────────────┐
│ Save Controls & Status                        │
├─────────────────────────┬─────────────────────┤
│ Blocks List             │ Sticky Inspector    │
│                         │ (top: 8 = 2rem)     │
│ • Block 1 (selected)    │                     │
│ • Block 2               │ Block Info:         │
│ • Block 3               │ • Type              │
│                         │ • ID                │
│                         │                     │
│                         │ Props Editor:       │
│                         │ • Input fields      │
│                         │                     │
│                         │ Meta:               │
│                         │ • Tenant            │
│                         │ • Source            │
│                         │ • DB Adapter        │
└─────────────────────────┴─────────────────────┘
```

## Styling Approach

### Color Scheme
- Background: `bg-zinc-950` / `bg-zinc-900`
- Borders: `border-zinc-800`
- Text: `text-zinc-100` / `text-zinc-400`
- Accents: `blue-600` / `blue-900`
- Status: `text-emerald-400` (saved), `text-amber-400` (dirty), `text-red-400` (error)

### Hierarchy
- **Page titles**: `text-4xl font-bold`
- **Section headers**: `text-lg font-semibold`
- **Card values**: `text-3xl font-bold font-mono`
- **Labels**: `text-xs uppercase tracking-wide`

### Interactive States
- Hover: Background color shift + subtle border change
- Active: Blue background + border + ring
- Disabled: Muted colors, cursor-not-allowed
- Transitions: `duration-200` for smooth feedback

## Server/Client Boundaries

### What Server Components Do
- Load data from runtime
- Resolve tenant
- Fetch pages and blocks
- Handle 404/errors
- Pass serializable props to clients

### What Client Components Do
- Render UI
- Handle clicks and interactions
- Manage local state (selectedBlockId, draftBlocks, isDirty)
- Dispatch inspector updates
- Show status indicators

### Critical: No Serialization Violations
✓ `runtimeConfig: RuntimeConfig` - plain object, serializable
✓ `tenant: AdminTenantContext` - plain object, serializable
✓ `page: CmsPage` - plain object, serializable
✓ `blocks: CmsBlock[]` - plain array, serializable

✗ `runtime: SovereignRuntime` - contains functions, NOT serializable
✗ Callback functions - not serializable
✗ Database adapters - not serializable

## Save Flow (Client-Side Mock)

Current architecture for Phase 13:
```
User edits block props
  ↓
updateBlockProps() in PageEditorClient
  ↓
mergeProps() combines old + new props
  ↓
setDraftBlocks() updates local state
  ↓
setIsDirty(true)
  ↓
User clicks "Save"
  ↓
handleSave() called
  ↓
clientEditorPersistence.savePageDraft()
  ↓
Mock delay (500ms)
  ↓
setIsDirty(false)
  ↓
setLastSavedAt(timestamp)
  ↓
UI shows "Last saved: ..."
```

**Important**: This does NOT persist to database or any backend. It's a client-side mock that demonstrates the save flow pattern. Future phases will replace this with:
- Server Actions (preferred for Next.js)
- API routes (/api/save-draft)
- Real database writes

## Performance Considerations

### Sticky Inspector
- Uses `sticky` positioning for smooth scrolling
- Minimal reflow on interaction
- Inspector width fixed on desktop (prevents layout shift)

### Table Rendering
- Server-side filtering (no client-side sorting yet)
- Simple <table> element (no complex virtualization)
- Suitable for <100 pages per tenant

### Memoization
Not currently implemented, but could optimize:
- DashboardCard components (if many cards)
- Block list items (if many blocks)
- Inspector when selectedBlock is null

## Accessibility

Current state:
- ✓ Semantic HTML (table, nav, header)
- ✓ Focus visible borders (blue)
- ✓ Proper heading hierarchy
- ✓ Link styling (underline on hover)
- ✗ ARIA labels not yet added
- ✗ Keyboard navigation not optimized
- ✗ Screen reader support minimal

Future improvements:
- Add ARIA attributes to interactive elements
- Implement keyboard shortcut hints
- Test with screen readers
- Add focus traps in modal dialogs (future)

## Internationalization (i18n)

Current implementation:
- UI text hardcoded in English
- Date formatting: locale-specific (JavaScript defaults)
- No translation layer

Future approach:
- Use `next-intl` or similar
- Extract all strings to i18n config
- Support multi-language admin interface

## Extension Points

### Adding New Routes
1. Create route in `/apps/admin/src/app/(admin)/`
2. Add to `navItems` in `AdminShell`
3. Server Component for data loading
4. Client Component for interactivity

### Adding Dashboard Cards
```tsx
<DashboardCard
  title="New Metric"
  value={someValue}
  description="Optional context"
  variant="highlight"
/>
```

### Adding Block Types
1. Create renderer in `apps/admin/src/components/block-renderers/`
2. Add to registry in `admin-block-renderer-registry.tsx`
3. Add prop inputs to `editor-inspector.tsx`

## Known Limitations & TODOs

### Current
- No drag-drop block reordering
- No bulk block operations
- No page template support
- Media library not implemented
- Settings page not implemented
- No user preferences/settings

### Save/Persistence
- Client-side mock only (no real DB)
- No optimistic updates
- No undo/redo
- No version history
- No autosave

### UX/Polish
- No loading skeletons
- No animations
- No tooltips/help text
- No search/filter on pages
- No pagination (assumes <100 pages)

---

**Last Updated**: Phase 13
**Maintenance**: Update this document when adding new routes, modifying data flow, or changing layout patterns.
