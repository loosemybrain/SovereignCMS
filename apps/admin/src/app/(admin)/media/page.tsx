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
import { getAdminRuntime } from "@/lib/get-admin-runtime"
import { MediaPickerDemo } from "@/components/media-picker-demo"

export default async function MediaPage() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? undefined
  const { runtime, tenant } = getAdminRuntime({ host })

  const assets = await runtime.mediaPersistence.listMediaAssets({
    tenantId: tenant.tenantId,
  })

  const imageCount = assets.filter((a) => a.type === "image").length
  const videoCount = assets.filter((a) => a.type === "video").length
  const documentCount = assets.filter((a) => a.type === "document" || a.type === "other").length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Medien"
        title="Bibliothek"
        description="URL-basierte Assets pro Mandant — ohne Datei-Upload in dieser Ansicht."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Bilder"
          value={imageCount}
          description="Assets vom Typ Bild"
          icon={<ImageIcon className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
        <AdminStatCard
          title="Videos"
          value={videoCount}
          description="Assets vom Typ Video"
          icon={<Video className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
        <AdminStatCard
          title="Dokumente"
          value={documentCount}
          description="Dokumente und Sonstiges"
          icon={<FileText className="h-5 w-5" strokeWidth={2} />}
          showAnimation={false}
        />
      </div>

      <CreateMediaAssetForm tenantId={tenant.tenantId} />

      <AdminSectionCard
        variant="glass"
        title="Bibliothek"
        description={`${assets.length} Asset(s) für Tenant ${tenant.tenantId}. Hinweis: InMemory pro Request — Liste nach Anlegen ggf. aktualisieren.`}
      >
        <AdminDataTable>
          <AdminDataTableHeadRow>
            <AdminDataTableTh>Titel</AdminDataTableTh>
            <AdminDataTableTh>Typ</AdminDataTableTh>
            <AdminDataTableTh>URL</AdminDataTableTh>
            <AdminDataTableTh>Alt</AdminDataTableTh>
            <AdminDataTableTh>Status</AdminDataTableTh>
            <AdminDataTableTh>Aktualisiert</AdminDataTableTh>
          </AdminDataTableHeadRow>
          <AdminDataTableBody>
            {assets.length === 0 ? (
              <AdminDataTableRow hover={false}>
                <AdminDataTableCell className="px-4 py-10" colSpan={6}>
                  <AdminEmptyState
                    title="Keine Media-Assets"
                    description="Lege ein URL-basiertes Asset über das Formular oben an."
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

      <AdminSectionCard variant="default" title="Picker-Demo" description="Entwickler-Vorschau der Media-Picker-Komponente.">
        <MediaPickerDemo tenantId={tenant.tenantId} />
      </AdminSectionCard>
    </div>
  )
}
