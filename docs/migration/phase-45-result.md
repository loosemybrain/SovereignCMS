# Phase 45 — Ergebnis (Public Header & Navigation UX)

## Geänderte / neue Dateien

- `packages/runtime/src/public-header-view-model.ts` — Typen für Header- und Locale-Links inkl. `active`
- `packages/runtime/src/public-header-mapping.ts` — `mapSettingsToPublicHeaderViewModel`
- `packages/runtime/src/index.ts` — Exports
- `apps/web/src/lib/load-public-page.ts` — `currentPath`, `header` im Payload
- `apps/web/src/components/public-header.tsx` — Client-Header mit Desktop-/Mobile-Navigation und Locale-Switcher
- `apps/web/src/components/public-layout-shell.tsx` — optionaler Wrapper: Header, `main`, Footer
- `apps/web/src/components/public/PublicPageView.tsx` — Preview Badge, Shell mit Inhalt; Entfall der separaten `PublicNavigation`-Leiste zugunsten des Headers
- `docs/architecture/public-header-navigation-ux.md`
- `docs/migration/phase-45-result.md`

## Header ViewModel

`PublicHeaderViewModel` bündelt Identity, Navigationslinks mit Active-Flag und Locale-Links mit Active-Flag.

## Header Mapping

`mapSettingsToPublicHeaderViewModel` vergleicht `currentPath` mit jedem Navigations-`href` und erzeugt Locale-Links durch Ersetzen des ersten Pfadsegments.

## Public Header Integration

`loadPublicPage` liefert `header` zusätzlich zu `footer`. `PublicPageView` rendert: Preview Badge → Header (über Shell) → Artikelinhalt → Footer.

## Mobile Navigation

Einfaches Ein-/Ausblenden per CSS-Klassen; ohne zusätzliche Libraries.

## Bekannte Grenzen

- Locale-Switcher zeigt Kurz-Codes (z. B. `de`, `en`); längere **Labels** aus `SupportedLocale.label` sind im ViewModel nicht enthalten (bewusst schlank gehalten).
- Die frühere eigenständige Komponente `PublicNavigation` wird auf der Seitenansicht nicht mehr verwendet; sie kann bei Bedarf später entfernt oder für andere Layouts wiederverwendet werden.

## Empfehlung für Phase 46

Optional: Anzeige der Locale-**Labels** im Switcher, separates konfigurierbares Footer-Menü, oder Fokus-Management beim Öffnen des Mobile-Menüs (ohne schwere „Drawer“-Abhängigkeit).
