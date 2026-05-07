# Brand-Abhängigkeiten (Legacy → SovereignCMS)

## Legacy (`legacy/physio-source`)

- **`BrandShell` / `BrandProvider` / `ThemeSyncFromPath`**: marken- und themenabhängige Hülle.
- **`brandAssets`**, **`BrandToggle`**, font- und Farbpresets aus Supabase/Theme-Pipeline.
- **Metadaten** und Copy mit Kundenbezug (Seitentitel, Beschreibungen).

## SovereignCMS (Zielbild)

- **Keine** feste Kundenmarke in `apps/*` oder `packages/ui`.
- Theming und White-Label gehören in **Mandanten-Konfiguration** (später: DB/Config-Service) und in **theme-Tokens** im Renderer — nicht in hardcodierten Komponenten aus Legacy.

## Migrationshinweis

Beim Übernehmen von UI-Bausteinen aus Legacy: zuerst **neutralisieren** (Props für Logo, Farben, Schrift), dann an **`TenantContext` / Seiten-Metadaten** binden.
