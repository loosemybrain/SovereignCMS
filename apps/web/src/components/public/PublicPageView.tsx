import type { PublicPagePayload } from "@/lib/load-public-page"
import { PublicBlockRenderer } from "@/components/public/PublicBlockRenderer"

export function PublicPageView({ tenant, page, blocks }: PublicPagePayload) {
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-6 p-10">
      <header className="text-sm text-gray-500">
        <span className="font-medium text-gray-800">{page.title}</span>
        {" · "}
        <span>
          {tenant.displayName} ({tenant.id}) · {page.locale}
        </span>
      </header>
      <div className="flex flex-col gap-4">
        {blocks.map((block) => (
          <PublicBlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </article>
  )
}
