# Phase 46 — Ergebnis (Footer Navigation & Social Management)

## Geänderte / neue Dateien

- `packages/core/src/navigation.ts` — `NavigationScope`, `scope` auf `NavigationItem`, optionales `scope` in `CreateNavigationItemInput`
- `packages/core/src/index.ts` — Export `NavigationScope`
- `packages/db/src/contracts.ts` — `listByTenant` mit optionalem `scope`
- `packages/db/src/in-memory-adapter.ts` — Scope auf bestehenden Items, Demo Footer Items, Filter/Sort/Dedupe-Logik create
- `packages/runtime/src/navigation-persistence.ts` — `listNavigationItems` mit `scope`
- `packages/runtime/src/public-navigation-resolution.ts` — `resolveNavigation({ scope })`, Default `main`
- `packages/runtime/src/public-footer-mapping.ts` — Dedupe Footer-Nav gegen Legal-Links und intern nach `href`
- `apps/web/src/lib/load-public-page.ts` — getrennte Auflösung Main vs. Footer
- `apps/web/src/components/public-footer.tsx` — Social: http(s) extern mit `target="_blank"` und `rel="noreferrer"`, interne Pfade mit `Link` + Preview
- `apps/admin/src/actions/create-navigation-item.ts` / `load-navigation-items.ts` — Scope-Guards
- `apps/admin/src/lib/client-navigation-persistence.ts` — Scope in List-Input
- `apps/admin/src/components/create-navigation-item-form.tsx` — `defaultScope`, `lockScope`, Scope-Select
- `apps/admin/src/app/(admin)/navigation/page.tsx` — lädt nur `scope: "main"`
- `apps/admin/src/app/(admin)/footer-navigation/page.tsx` — neue Admin-Seite
- `apps/admin/src/components/admin-shell.tsx` — Sidebar-Eintrag Footer Navigation
- `apps/admin/src/components/settings-editor.tsx` — Social Links CRUD + Validierung vor Save
- `docs/architecture/footer-navigation-social-management.md`
- `docs/migration/phase-46-result.md`

## Navigation Scope

Ermöglicht getrennte Listen für Header und Footer ohne gemeinsame Duplikat-Labels zwischen Scopes.

## Admin Footer Navigation Page

`/footer-navigation` mit Locale-Switcher, Formular mit gesperrtem Footer-Scope und Tabelle der Footer-Items.

## Social Links Editor

Hinzufügen, Bearbeiten, Entfernen; Save sendet `socialLinks` mit; Validierung: nicht-leeres Label und `validateExternalHref`.

## Public Footer Anpassung

Footer ViewModel nutzt nur Footer-Scope-Navigation; Legal unverändert; Mapping vermeidet doppelte `href`.

## Bekannte Grenzen

- Locale-Labels im Footer-Admin entsprechen der bestehenden Navigation-UX (keine Extra-Felder).
- Postgres/Supabase-Adapter bleiben Platzhalter; Scope-Felder müssen bei echter DB später in Tabellen abgebildet werden.

## Empfehlung für Phase 47

Optional: Sortierung bearbeiten (ohne DnD), oder Footer-Spalten-Konzept erst nach stabiler Datenhaltung.
