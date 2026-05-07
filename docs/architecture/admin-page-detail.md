# Admin Page Detail

## Ziel

Die Admin-Detailansicht laedt eine einzelne Seite sowie deren Blockliste tenant-aware ueber die Runtime-Schicht.

## Datenpfad

1. Route `apps/admin/src/app/pages/[slug]/page.tsx` liest `host` aus `next/headers`.
2. Loader `loadAdminPageDetail({ host, slug })` nutzt `getAdminRuntime({ host })`.
3. Seitenabfrage erfolgt ueber `runtime.db.pages.findBySlug({ tenantId, locale, slug })`.
4. Blockabfrage erfolgt ueber `runtime.db.blocks.listByPage({ tenantId, pageId })`.

## Tenant Scope

Tenant-Kontext kommt ausschliesslich aus `AdminTenantContext` (ENV/Host/Fallback).
Alle Detailabfragen sind tenant-scoped.

## Entkopplung

Die Admin-App erzeugt keine konkreten Adapter und greift nicht direkt auf DB-Clients zu. Sie verwendet nur Runtime-Vertraege.

## Ausblick

Ein spaeterer Editor kann auf diesem Read-Model aufbauen, indem er dieselben tenant-scoped Ladepfade um Write-Operationen erweitert.