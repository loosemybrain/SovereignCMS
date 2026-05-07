# Admin Shell Architecture

## Übersicht

SovereignCMS Admin basiert auf einer **Shell + Layout Group Struktur**:

```
(admin) Route Group
    ↓
(admin)/layout.tsx (LoadsRuntime)
    ↓
AdminShell Component (Sidebar + Header)
    ↓
Dashboard / Pages / Media / Settings Routes
```

## AdminShell Component

`apps/admin/src/components/admin-shell.tsx`:

- **Sidebar**: Logo, Navigation, Runtime-Config
- **Header**: Current Section Title, Tenant Info
- **Main Area**: Children Content

Props:
- `children`: Page Content
- `tenant`: AdminTenantContext
- `runtime`: SovereignRuntime

## Route Group (admin)

```
src/app/(admin)/
  layout.tsx              → LoadsRuntime, renders AdminShell
  page.tsx                → redirects to /dashboard
  dashboard/
    page.tsx              → Dashboard Cards
  pages/
    page.tsx              → Pages List
    [slug]/
      page.tsx            → Page Editor
  media/                  → Placeholder
  settings/               → Placeholder
```

## Keine Duplikation von Runtime

Runtime wird **einmal** im `(admin)/layout.tsx` geladen und an AdminShell weitergegeben.

Alle Children erhalten Zugriff über Layout-Kontext oder direkt über Props.

## Navigation

Minimal:
- Dashboard
- Pages
- Media (Placeholder)
- Settings (Placeholder)

Nutzt `usePathname()` zur aktiven Routen-Markierung.

## Dashboard Card Component

`apps/admin/src/components/dashboard-card.tsx`:

Props:
- `title`: Label
- `value`: Hauptmetrik
- `description`: Optional
- `variant`: "default" | "highlight"

Keine Echarts, keine APIs, keine Fake-Metrics. Echte Daten nur.

## Vorbereitung für echte CMS-UX

- Shell-Struktur stabil für zukünftige Features
- Runtime-aware (alle Adapter sichtbar)
- Sidebar erweiterbar für neue Navigation
- Header bereit für Workflows/Actions
