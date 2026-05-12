"use client"

import type { SeoMetadata } from "@sovereign-cms/core"
import { validateCanonicalUrl } from "@sovereign-cms/core"
import { MediaPicker } from "@/components/media-picker"
import type { MediaAsset } from "@sovereign-cms/core"

type Props = {
  seo: SeoMetadata | null | undefined
  onUpdate: (patch: Partial<SeoMetadata>) => void
  tenantId?: string
}

export function SeoEditorSection({ seo, onUpdate, tenantId }: Props) {
  const data = seo || {}

  const seoTitle = typeof data.seoTitle === "string" ? data.seoTitle : ""
  const seoDescription = typeof data.seoDescription === "string" ? data.seoDescription : ""
  const canonicalUrl = typeof data.canonicalUrl === "string" ? data.canonicalUrl : ""
  const seoImageAssetId = typeof data.seoImageAssetId === "string" ? data.seoImageAssetId : null
  const robotsIndex = typeof data.robotsIndex === "boolean" ? data.robotsIndex : true

  const handleSeoTitleChange = (value: string) => {
    onUpdate({ seoTitle: value })
  }

  const handleSeoDescriptionChange = (value: string) => {
    onUpdate({ seoDescription: value })
  }

  const handleCanonicalUrlChange = (value: string) => {
    if (validateCanonicalUrl(value)) {
      onUpdate({ canonicalUrl: value })
    }
  }

  const handleRobotsIndexToggle = () => {
    onUpdate({ robotsIndex: !robotsIndex })
  }

  const handleSeoImageSelect = (asset: MediaAsset) => {
    onUpdate({
      seoImageAssetId: asset.id,
      seoImageUrl: asset.url,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium admin-text">SEO Title</label>
        <input
          id="seo-title"
          type="text"
          aria-describedby="seo-title-help"
          value={seoTitle}
          onChange={(e) => handleSeoTitleChange(e.target.value)}
          placeholder="Page title for search results"
          className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
        />
        <p id="seo-title-help" className="mt-1 text-xs admin-text-muted">
          {seoTitle.length}/60 (recommended: 30-60)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium admin-text">SEO Description</label>
        <textarea
          id="seo-description"
          aria-describedby="seo-description-help"
          value={seoDescription}
          onChange={(e) => handleSeoDescriptionChange(e.target.value)}
          placeholder="Page description for search results"
          rows={3}
          className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
        />
        <p id="seo-description-help" className="mt-1 text-xs admin-text-muted">
          {seoDescription.length}/160 (recommended: 100-160)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium admin-text">Canonical URL</label>
        <input
          id="canonical-url"
          aria-describedby="canonical-url-help"
          type="text"
          value={canonicalUrl}
          onChange={(e) => handleCanonicalUrlChange(e.target.value)}
          placeholder="https://example.com/page or /relative/path"
          className="mt-1 w-full rounded border admin-border admin-surface px-2 py-1 text-xs admin-text placeholder:admin-text-muted admin-focus-ring focus:outline-none"
        />
        <p id="canonical-url-help" className="mt-1 text-xs admin-text-muted">
          Optional: Preferred URL for this page
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium admin-text mb-2">SEO Image</label>
        {tenantId ? (
          <MediaPicker
            tenantId={tenantId}
            selectedAssetId={seoImageAssetId}
            onSelect={handleSeoImageSelect}
          />
        ) : (
          <div className="rounded bg-red-900/20 border border-red-700/50 p-2" role="alert">
            <p className="text-xs text-red-200">Error: tenantId not available</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleRobotsIndexToggle}
          aria-pressed={robotsIndex}
          className={`rounded px-3 py-1 text-xs font-medium border transition-colors ${
            robotsIndex
              ? "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
              : "admin-surface-muted admin-text border admin-border hover:opacity-90"
          } admin-focus-ring`}
        >
          {robotsIndex ? "✓ Index" : "✗ No Index"}
        </button>
        <p className="text-xs admin-text-muted">
          {robotsIndex ? "Search engines can index this page" : "Search engines should not index"}
        </p>
      </div>
    </div>
  )
}
