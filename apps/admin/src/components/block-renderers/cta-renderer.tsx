import type { CmsBlock } from "@sovereign-cms/core"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function CtaAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const eyebrow = asString(props.eyebrow)
  const headline = asString(props.headline, "(ohne headline)")
  const body = asString(props.body)
  const primaryLabel = asString(props.primaryLabel)
  const secondaryLabel = asString(props.secondaryLabel)
  const align = asString(props.align, "center")

  return (
    <div className="space-y-3">
      <div className={`text-sm ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && (
          <p className="text-xs font-medium text-gray-500 uppercase">{eyebrow}</p>
        )}
        <p className="font-semibold text-gray-900">{headline}</p>
        {body && (
          <p className="text-sm text-gray-600 mt-1">{body}</p>
        )}
      </div>

      <div className={`flex gap-2 ${align === "center" ? "justify-center" : "justify-start"}`}>
        {primaryLabel && (
          <button
            disabled
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded font-medium cursor-not-allowed"
          >
            {primaryLabel}
          </button>
        )}
        {secondaryLabel && (
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-900 text-sm rounded font-medium cursor-not-allowed"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
