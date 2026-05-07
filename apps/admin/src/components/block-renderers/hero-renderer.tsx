import type { CmsBlock } from "@sovereign-cms/core"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function HeroAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline, "(ohne headline)")
  const subline = asString(props.subline)

  return (
    <div>
      <p>
        <span className="font-medium">headline:</span> {headline}
      </p>
      <p>
        <span className="font-medium">subline:</span> {subline || "-"}
      </p>
    </div>
  )
}
