"use client"

import { useEffect, useState } from "react"
import type { MediaAsset } from "@sovereign-cms/core"
import { clientMediaPersistence } from "@/lib/client-media-persistence"
import { AdminCard } from "@/components/admin-ui"

type Props = {
  tenantId: string
  selectedAssetId?: string | null
  onSelect: (asset: MediaAsset) => void
}

export function MediaPicker({
  tenantId,
  selectedAssetId,
  onSelect,
}: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedAssetId ?? null
  )

  useEffect(() => {
    async function loadAssets() {
      try {
        setIsLoading(true)
        setError(null)
        const result = await clientMediaPersistence.listMediaAssets({
          tenantId,
        })
        setAssets(result)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load media assets"
        )
        setAssets([])
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [tenantId])

  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedId(asset.id)
    onSelect(asset)
  }

  return (
    <AdminCard className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold admin-text">Media Picker</h3>
          <p className="text-xs admin-text-muted mt-1">
            Select a media asset for this field
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8" aria-live="polite">
            <p className="text-sm admin-text-muted">Loading media assets...</p>
          </div>
        )}

        {error ? (
          <div className="p-4 admin-callout-error" role="alert">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : null}

        {!isLoading && !error && assets.length === 0 ? (
          <div
            className="rounded-lg border admin-border admin-surface-muted p-6"
            aria-live="polite"
          >
            <p className="text-center text-sm admin-text-muted">
              No media assets found for this tenant
            </p>
          </div>
        ) : null}

        {!isLoading && !error && assets.length > 0 && (
          <section aria-label="Available media assets">
            <h4 className="admin-sr-only">Available media assets</h4>
            <ul className="grid grid-cols-2 gap-4" role="list">
            {assets.map((asset) => (
              <li key={asset.id}>
                <div
                  role="option"
                  aria-selected={selectedId === asset.id}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all admin-focus-ring ${
                    selectedId === asset.id
                      ? "border-(--admin-accent) admin-accent-bg"
                      : "border-(--admin-border) admin-surface hover:opacity-[0.97]"
                  }`}
                >
                {/* Image Preview for image type */}
                {asset.type === "image" && (
                  <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-md border admin-border admin-surface-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.alt || asset.title}
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Non-image Type Placeholder */}
                {asset.type !== "image" && (
                  <div className="mb-3 flex h-24 items-center justify-center rounded-md border admin-border admin-surface-muted">
                    <p className="text-xs admin-text-muted">[{asset.type}]</p>
                  </div>
                )}

                {/* Asset Info */}
                <div className="space-y-1">
                  <p className="text-sm font-medium admin-text truncate">
                    {asset.title}
                    {selectedId === asset.id ? (
                      <span className="ml-2 text-xs font-normal admin-accent">(Selected)</span>
                    ) : null}
                  </p>
                  <p className="text-xs admin-text-muted">{asset.type}</p>
                  {asset.alt && (
                    <p className="text-xs admin-text-muted truncate">
                      Alt: {asset.alt}
                    </p>
                  )}
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  aria-pressed={selectedId === asset.id}
                  aria-label={`Select media asset ${asset.title}`}
                  className="mt-3 w-full rounded border admin-border admin-surface-muted text-center text-xs py-1.5 admin-text admin-focus-ring"
                  onClick={() => handleSelectAsset(asset)}
                >
                  {selectedId === asset.id ? "Selected" : "Select asset"}
                </button>
                </div>
              </li>
            ))}
            </ul>
          </section>
        )}
      </div>
    </AdminCard>
  )
}
