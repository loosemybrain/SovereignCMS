import type { CmsBlock } from "@sovereign-cms/core"

export function FallbackAdminRenderer({ block }: { block: CmsBlock }) {
  return (
    <div className="space-y-1">
      <p>
        <span className="font-medium">type:</span> {block.type}
      </p>
      <p>
        <span className="font-medium">id:</span> {block.id}
      </p>
      <p>
        <span className="font-medium">Hinweis:</span> Kein Admin Renderer registriert
      </p>
    </div>
  )
}
