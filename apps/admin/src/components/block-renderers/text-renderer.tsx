import type { CmsBlock } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function TextAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const body = asString(props.body, "(ohne body)")

  return (
    <p className={bp.body}>
      <span className="font-medium admin-text">body:</span> {body}
    </p>
  )
}
