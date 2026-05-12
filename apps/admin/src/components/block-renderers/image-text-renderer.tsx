import type { CmsBlock } from "@sovereign-cms/core"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

/**
 * Check if URL is internal (starts with /).
 */
function isInternalImageUrl(url: string): boolean {
  return url.startsWith("/")
}

/**
 * Check if URL is external HTTPS.
 */
function isExternalHttpsUrl(url: string): boolean {
  return url.startsWith("https://")
}

export function ImageTextAdminRenderer({ block }: { block: CmsBlock }) {
  const props = asRecord(block.props)
  const headline = asString(props.headline)
  const body = asString(props.body)
  const imageUrl = asString(props.imageUrl)
  const imageAlt = asString(props.imageAlt)
  const imagePosition = asString(props.imagePosition, "right")
  const ctaLabel = asString(props.ctaLabel)

  // Admin preview: load internal images, show placeholder for external HTTPS
  const isInternal = isInternalImageUrl(imageUrl)
  const isExternalHttps = isExternalHttpsUrl(imageUrl)
  const hasValidImageUrl = imageUrl && (isInternal || isExternalHttps)

  return (
    <div className="space-y-3">
      {hasValidImageUrl && (
        <div className="rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden h-32 flex items-center justify-center">
          {isInternal ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt || headline || "Image"}
                className="max-h-32 max-w-full object-contain"
              />
            </>
          ) : (
            // External HTTPS: show placeholder with URL
            <div className="text-center px-4">
              <p className="text-xs text-zinc-400 break-all">{imageUrl}</p>
              <p className="text-xs text-zinc-500 mt-1">(External image not loaded in preview)</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {headline && (
          <p className="font-semibold text-gray-900">{headline}</p>
        )}
        {body && (
          <p className="text-sm text-gray-600">{body}</p>
        )}
        {imageUrl && (
          <p className="text-xs text-zinc-500">
            <span className="font-medium">Position:</span> {imagePosition}
          </p>
        )}
        {ctaLabel && (
          <p className="text-xs font-medium text-blue-600">
            <span className="font-medium">CTA:</span> {ctaLabel}
          </p>
        )}
      </div>
    </div>
  )
}
