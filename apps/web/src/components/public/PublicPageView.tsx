import type { PublicPagePayload } from "@/lib/load-public-page"

import { PublicTenantAppearanceStyles } from "@/components/public-tenant-appearance-styles"
import { PublicLayoutShell } from "@/components/public-layout-shell"
import { PublicBlockRenderer } from "@/components/public/PublicBlockRenderer"
import { PublicPreviewBadge } from "@/components/public-preview-badge"

export function PublicPageView({
  tenant,
  page,
  blocks,
  seo,
  previewContext,
  footer,
  header,
  contactEmail,
  appearanceCss,
}: PublicPagePayload) {
  const previewEnabled = previewContext.mode === "enabled"

  return (
    <div className="flex min-h-screen flex-col">
      <PublicTenantAppearanceStyles css={appearanceCss} />
      <PublicPreviewBadge previewEnabled={previewEnabled} />
      <PublicLayoutShell header={header} footer={footer} previewEnabled={previewEnabled}>
        {/* Draft indicator — visible only in preview mode */}
        {previewEnabled && page.status === "draft" && (
          <div className="pub-container py-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Draft preview — {page.title}
            </span>
          </div>
        )}

        {/* SEO description — only shown in preview to aid editorial review */}
        {previewEnabled && seo.description && (
          <div className="pub-container pb-2">
            <p className="text-sm italic text-gray-400">{seo.description}</p>
          </div>
        )}

        {/* Blocks flow full-width; each block manages its own container and spacing */}
        <div>
          {blocks.map((block) => (
            <PublicBlockRenderer
              key={block.id}
              block={block}
              tenantId={tenant.id}
              locale={page.locale}
              pageId={page.id}
              settingsContactEmail={contactEmail}
            />
          ))}
        </div>
      </PublicLayoutShell>
    </div>
  )
}
