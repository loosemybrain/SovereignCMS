# Phase 1 — Ergebnis

## Monorepo

Das Repository wurde zu einem **npm-Workspace-Monorepo** mit **Turborepo** umgebaut: `apps/admin`, `apps/web`, `packages/*` (core, tenancy, auth, db, storage, ui, config), `adapters/*` (Skelette).

## Legacy

Die frühere Next.js-Anwendung liegt unter **`legacy/physio-source`** und ist **nicht** Teil der Workspaces. Sie dient ausschließlich als technische Referenz beim späteren Übernehmen von Mustern — nicht als Produktlieferung.

## Hygiene (Phase 1.2)

- Build-Artefakte (`.next`, `.turbo`, `*.tsbuildinfo`) werden ignoriert und gehören nicht in den Arbeitsstand.
- `.gitignore` wurde für Builds, Abhängigkeiten und Geheimnisse gehärtet.

## Grenzen nach Phase 1

- Kein mandantenfähiger Laufzeitpfad in den Apps; nur Struktur und Verträge.
- Keine produktive Datenbank- oder Auth-Anbindung.
