# Phase 44 — Ergebnis (Footer Foundation)

## Geänderte / neue Dateien

- `packages/runtime/src/public-footer-view-model.ts` — Typen `PublicFooterLink`, `PublicFooterViewModel`
- `packages/runtime/src/public-footer-mapping.ts` — `mapSettingsToPublicFooterViewModel`
- `packages/runtime/src/index.ts` — Re-Exports
- `apps/web/src/lib/load-public-page.ts` — lädt Tenant Settings, baut `footer`
- `apps/web/src/components/public-footer.tsx` — `PublicFooter`
- `apps/web/src/components/public/PublicPageView.tsx` — Footer unter dem Artikel
- `apps/admin/src/components/settings-editor.tsx` — Hilfetexte Legal Slugs + Social Links
- `docs/architecture/footer-foundation.md`
- `docs/migration/phase-44-result.md`

## Footer ViewModel

Enthält `siteName`, `tagline`, `contact` (email, phone, address), `legalLinks`, `navigationLinks`, `socialLinks`, `year`.

## Footer Mapping

`mapSettingsToPublicFooterViewModel` kombiniert Settings, übergebene Navigation als `{ label, href }[]` und `locale` für Legal-URLs.

## Public Footer Component

Semantisches `<footer>`, getrennte `<nav>`-Bereiche mit den geforderten `aria-label`-Werten; leere Sektionen werden ausgelassen; Copyright-Zeile mit Jahr.

## Public Loader

`loadPublicPage` ruft `settingsPersistence.getTenantSettings` auf und gibt serialisierbares `footer` mit zurück (kein Runtime-Objekt an den Client).

## Bekannte Grenzen

- Navigation im Footer spiegelt dieselben Einträge wie die Hauptnavigation; keine separate „Footer-Menü“-Konfiguration.
- Social Links sind im Admin noch nicht editierbar (Hinweis im Settings Editor).

## Empfehlung für Phase 45

Optional: dedizierte Footer-Navigation oder reduzierte Link-Menge aus der Navigation-Konfiguration; Bearbeitung von Social Links im Admin; erweiterte Barrierefreiheit (Landmarks, Skip-Link-Kohärenz).
