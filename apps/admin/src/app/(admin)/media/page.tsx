import { headers } from "next/headers"
import { CreateMediaAssetForm } from "@/components/create-media-asset-form"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { AdminCard, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { MediaPickerDemo } from "@/components/media-picker-demo"

export default async function MediaPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })

  const assets = await runtime.mediaPersistence.listMediaAssets({
    tenantId: tenant.tenantId,
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media"
        description="Tenant-aware media assets (locale-neutral). Liste kommt vom Server; neue Assets erscheinen erst nach Refresh, da InMemory pro Request nicht geteilt wird."
      />

      <CreateMediaAssetForm tenantId={tenant.tenantId} />

      <AdminCard className="p-0 overflow-hidden border-2 border-blue-900/50 bg-blue-950/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b admin-border admin-surface-muted">
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Title</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Type</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">URL</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Alt</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Status</th>
              <th className="px-6 py-3 text-left font-medium admin-text-muted">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y admin-border">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8">
                  <AdminEmptyState
                    title="Keine Media Assets"
                    description="Erstelle ein URL-basiertes Asset ueber das Formular oben."
                  />
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-zinc-900/40">
                  <td className="px-6 py-4 admin-text">{asset.title}</td>
                  <td className="px-6 py-4 admin-text-muted">{asset.type}</td>
                  <td className="px-6 py-4 admin-text-muted font-mono text-xs break-all max-w-[14rem]">
                    {asset.url}
                  </td>
                  <td className="px-6 py-4 admin-text-muted">{asset.alt ?? "—"}</td>
                  <td className="px-6 py-4">
                    <ContentStatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-4 admin-text-muted whitespace-nowrap text-xs">
                    {asset.updatedAt}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminCard>

      <div className="mt-8 pt-8 border-t border-zinc-700">
        <MediaPickerDemo tenantId={tenant.tenantId} />
      </div>
    </div>
  )
}
