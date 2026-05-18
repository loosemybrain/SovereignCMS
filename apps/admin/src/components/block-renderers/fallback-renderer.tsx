import type { CmsBlock } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"

export function FallbackAdminRenderer({ block }: { block: CmsBlock }) {
  return (
    <div className={bp.stack}>
      <p className={bp.body}>
        <span className="font-medium admin-text">type:</span> {block.type}
      </p>
      <p className={bp.body}>
        <span className="font-medium admin-text">id:</span> {block.id}
      </p>
      <p className={bp.noticeWarning}>
        <span className="font-medium">Hinweis:</span> Kein Admin Renderer registriert
      </p>
    </div>
  )
}
