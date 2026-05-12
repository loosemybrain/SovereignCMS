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

    <div className="flex min-h-screen flex-col">

      <PublicPreviewBadge previewEnabled={previewEnabled} />

      <PublicLayoutShell header={header} footer={footer} previewEnabled={previewEnabled}>

        <article className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-10">

          <header className="text-sm text-gray-500">

            <span className="font-medium text-gray-800">{page.title}</span>

            {" · "}

            <span>

              {tenant.displayName} ({tenant.id}) · {page.locale}

            </span>

            {page.status === "draft" && previewEnabled && (

              <span className="ml-2 inline-block px-2 py-1 bg-amber-100 text-amber-900 text-xs rounded">

                Draft

              </span>

            )}

          </header>

          {seo.description && (

            <p className="text-sm text-gray-600 italic">{seo.description}</p>

          )}

          <div className="flex flex-col gap-4">

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

