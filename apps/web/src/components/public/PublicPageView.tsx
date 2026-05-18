import type { PublicPagePayload } from "@/lib/load-public-page"

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
}: PublicPagePayload) {
  const previewEnabled = previewContext.mode === "enabled"

  return (
    <div className="pub-site">
      <PublicPreviewBadge previewEnabled={previewEnabled} />
      <PublicLayoutShell header={header} footer={footer} previewEnabled={previewEnabled}>
        <article className="pub-page">
          <header className="pub-page-meta">
            <span className="font-medium">{page.title}</span>
            {" · "}
            <span>
              {tenant.displayName} ({tenant.id}) · {page.locale}
            </span>
            {page.status === "draft" && previewEnabled ? (
              <span className="ml-2 inline-block rounded px-2 py-0.5 text-xs bg-amber-100 text-amber-900">
                Draft
              </span>
            ) : null}
          </header>

          {seo.description ? <p className="pub-page-lead">{seo.description}</p> : null}

          <div className="pub-block-stack">
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
        </article>
      </PublicLayoutShell>
    </div>
  )
}
