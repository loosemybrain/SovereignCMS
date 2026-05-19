"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"
import { useAdminI18n } from "@/components/admin-i18n-provider"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function TextAdminRenderer({ block }: { block: CmsBlock }) {
  const { messages } = useAdminI18n()
  const l = messages.blockPreview
  const props = asRecord(block.props)
  const body = asString(props.body, l.emptyBody)

  return (
    <p className={bp.body}>
      <span className="font-medium admin-text">{l.body}:</span> {body}
    </p>
  )
}
