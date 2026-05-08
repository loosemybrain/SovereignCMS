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
        <label className="block text-xs font-medium text-zinc-300">SEO Title</label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => handleSeoTitleChange(e.target.value)}
          placeholder="Page title for search results"
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">
          {seoTitle.length}/60 (recommended: 30-60)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300">SEO Description</label>
        <textarea
          value={seoDescription}
          onChange={(e) => handleSeoDescriptionChange(e.target.value)}
          placeholder="Page description for search results"
          rows={3}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">
          {seoDescription.length}/160 (recommended: 100-160)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300">Canonical URL</label>
        <input
          type="text"
          value={canonicalUrl}
          onChange={(e) => handleCanonicalUrlChange(e.target.value)}
          placeholder="https://example.com/page or /relative/path"
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">Optional: Preferred URL for this page</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-2">SEO Image</label>
        {tenantId ? (
          <MediaPicker
            tenantId={tenantId}
            selectedAssetId={seoImageAssetId}
            onSelect={handleSeoImageSelect}
          />
        ) : (
          <div className="rounded bg-red-900/20 border border-red-700/50 p-2">
            <p className="text-xs text-red-300">Error: tenantId not available</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleRobotsIndexToggle}
          className={`rounded px-3 py-1 text-xs font-medium border transition-colors ${
            robotsIndex
              ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50"
              : "bg-zinc-800/30 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800/50"
          }`}
        >
          {robotsIndex ? "✓ Index" : "✗ No Index"}
        </button>
        <p className="text-xs text-zinc-500">
          {robotsIndex ? "Search engines can index this page" : "Search engines should not index"}
        </p>
      </div>
    </div>
  )
}
