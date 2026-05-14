import { headers } from "next/headers"
import { CreateMediaAssetForm } from "@/components/create-media-asset-form"
import { ContentStatusBadge } from "@/components/content-status-badge"
import { AdminDataTable, AdminDataTableHeadRow, AdminDataTableTh, AdminEmptyState, AdminPageHeader } from "@/components/admin-ui"
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

      <AdminDataTable>
        <AdminDataTableHeadRow>
          <AdminDataTableTh>Title</AdminDataTableTh>
          <AdminDataTableTh>Type</AdminDataTableTh>
          <AdminDataTableTh>URL</AdminDataTableTh>
          <AdminDataTableTh>Alt</AdminDataTableTh>
          <AdminDataTableTh>Status</AdminDataTableTh>
          <AdminDataTableTh>Updated</AdminDataTableTh>
        </AdminDataTableHeadRow>
        <tbody className="divide-y admin-border">
          {assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10">
                <AdminEmptyState
                  title="Keine Media Assets"
                  description="Erstelle ein URL-basiertes Asset ueber das Formular oben."
                />
              </td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset.id} className="admin-row-hover">
                <td className="px-4 py-3 admin-text">{asset.title}</td>
                <td className="px-4 py-3 admin-text-muted">{asset.type}</td>
                <td className="max-w-[14rem] break-all px-4 py-3 font-mono text-xs admin-text-muted">
                  {asset.url}
                </td>
                <td className="px-4 py-3 admin-text-muted">{asset.alt ?? "—"}</td>
                <td className="px-4 py-3">
                  <ContentStatusBadge status={asset.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs admin-text-muted">{asset.updatedAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </AdminDataTable>

      <div className="mt-8 border-t admin-border pt-8">
        <MediaPickerDemo tenantId={tenant.tenantId} />
      </div>
    </div>
  )
}
