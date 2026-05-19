import { headers } from "next/headers"
import { FileText, Image as ImageIcon, Video } from "lucide-react"
import { CreateMediaAssetForm } from "@/components/create-media-asset-form"
import { ContentStatusBadge } from "@/components/content-status-badge"
import {
  AdminDataTable,
  AdminDataTableBody,
  AdminDataTableCell,
  AdminDataTableHeadRow,
  AdminDataTableRow,
  AdminDataTableTh,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
} from "@/components/admin-ui"
import { formatAdminMessage, getAdminMessages } from "@/lib/admin-i18n"
import { getAdminUiLocale } from "@/lib/admin-i18n/server"
import { resolveAdminOperationalReadScope } from "@/lib/resolve-admin-operational-read-scope"
import { MediaPickerDemo } from "@/components/media-picker-demo"

export default async function MediaPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, scope } = resolveAdminOperationalReadScope({
    host,
    operation: "media:read",
  })

  const t = getAdminMessages(await getAdminUiLocale())
  const m = t.media
  const ml = t.mediaLibrary
  const c = t.common

  const assets = await runtime.mediaPersistence.listMediaAssets({
    tenantId: scope.tenantId,
  })

  const imageCount = assets.filter((a) => a.type === "image").length
  const videoCount = assets.filter((a) => a.type === "video").length
  const documentCount = assets.filter((a) => a.type === "document" || a.type === "other").length

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={m.eyebrow} title={m.title} description={m.description} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title={ml.imagesTitle}
          value={imageCount}
          description={ml.imagesDescription}
          icon={<ImageIcon className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
        <AdminStatCard
          title={ml.videosTitle}
          value={videoCount}
          description={ml.videosDescription}
          icon={<Video className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
        <AdminStatCard
          title={ml.documentsTitle}
          value={documentCount}
          description={ml.documentsDescription}
          icon={<FileText className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
      </div>

      <CreateMediaAssetForm tenantId={scope.tenantId} />

      <AdminSectionCard
        variant="glass"
        title={ml.libraryTitle}
        description={formatAdminMessage(ml.libraryDescription, {
          count: String(assets.length),
          tenant: scope.tenantId,
        })}
      >
        <AdminDataTable>
          <AdminDataTableHeadRow>
            <AdminDataTableTh>{ml.fieldTitle}</AdminDataTableTh>
            <AdminDataTableTh>{ml.fieldType}</AdminDataTableTh>
            <AdminDataTableTh>{ml.fieldUrl}</AdminDataTableTh>
            <AdminDataTableTh>{ml.fieldAlt}</AdminDataTableTh>
            <AdminDataTableTh>{c.status}</AdminDataTableTh>
            <AdminDataTableTh>{c.updated}</AdminDataTableTh>
          </AdminDataTableHeadRow>
          <AdminDataTableBody>
            {assets.length === 0 ? (
              <AdminDataTableRow hover={false}>
                <AdminDataTableCell className="px-4 py-10" colSpan={6}>
                  <AdminEmptyState
                    title={ml.emptyAssetsTitle}
                    description={ml.emptyAssetsDescription}
                  />
                </AdminDataTableCell>
              </AdminDataTableRow>
            ) : (
              assets.map((asset) => (
                <AdminDataTableRow key={asset.id}>
                  <AdminDataTableCell>{asset.title}</AdminDataTableCell>
                  <AdminDataTableCell className="admin-text-muted">{asset.type}</AdminDataTableCell>
                  <AdminDataTableCell className="max-w-56 break-all font-mono text-xs admin-text-muted">
                    {asset.url}
                  </AdminDataTableCell>
                  <AdminDataTableCell className="admin-text-muted">{asset.alt ?? "—"}</AdminDataTableCell>
                  <AdminDataTableCell>
                    <ContentStatusBadge status={asset.status} />
                  </AdminDataTableCell>
                  <AdminDataTableCell className="whitespace-nowrap text-xs admin-text-muted">
                    {asset.updatedAt}
                  </AdminDataTableCell>
                </AdminDataTableRow>
              ))
            )}
          </AdminDataTableBody>
        </AdminDataTable>
      </AdminSectionCard>

      <AdminSectionCard
        variant="default"
        title={ml.pickerDemoTitle}
        description={ml.pickerDemoDescription}
      >
        <MediaPickerDemo tenantId={scope.tenantId} />
      </AdminSectionCard>
    </div>
  )
}
