# Migration von der Legacy-Referenz

Die Legacy-App liegt **außerhalb** der npm-Workspaces. Zum lokalen Starten:

```bash
cd legacy/physio-source
npm install
npm run dev
```

Alternativ vom Monorepo-Root: `npm run dev:legacy` (setzt voraus, dass dort bereits `npm install` gelaufen ist).

1. Code gezielt aus `legacy/physio-source` in passende **packages/** oder **apps/** übernehmen.
2. Supabase-/Vercel-spezifische Annahmen hinter **adapters/** kapseln, nicht in `packages/db` oder `packages/core` fest verdrahten.
3. Kunden-Branding, Demo-Inhalte und Fach-Domänenlogik der Physio-App nicht übernehmen.
4. Tests und API-Routen pro App neu verdrahten, sobald die Adapter implementiert sind.
