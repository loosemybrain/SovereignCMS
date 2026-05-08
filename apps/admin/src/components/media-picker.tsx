"use client"

import { useEffect, useState } from "react"
import type { MediaAsset } from "@sovereign-cms/core"
import { clientMediaPersistence } from "@/lib/client-media-persistence"
import { AdminCard, AdminButton } from "@/components/admin-ui"

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
          <div className="flex items-center justify-center py-8">
            <p className="text-sm admin-text-muted">Loading media assets...</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-900/20 border border-red-700/50 p-4">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!isLoading && !error && assets.length === 0 && (
          <div className="rounded-md bg-zinc-900/40 border border-zinc-700/50 p-6">
            <p className="text-sm admin-text-muted text-center">
              No media assets found for this tenant
            </p>
          </div>
        )}

        {!isLoading && !error && assets.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  selectedId === asset.id
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
                onClick={() => handleSelectAsset(asset)}
              >
                {/* Image Preview for image type */}
                {asset.type === "image" && (
                  <div className="mb-3 bg-zinc-900 rounded h-24 flex items-center justify-center overflow-hidden">
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
                  <div className="mb-3 bg-zinc-900 rounded h-24 flex items-center justify-center">
                    <p className="text-xs admin-text-muted">
                      [{asset.type}]
                    </p>
                  </div>
                )}

                {/* Asset Info */}
                <div className="space-y-1">
                  <p className="text-sm font-medium admin-text truncate">
                    {asset.title}
                  </p>
                  <p className="text-xs admin-text-muted">{asset.type}</p>
                  {asset.alt && (
                    <p className="text-xs admin-text-muted truncate">
                      Alt: {asset.alt}
                    </p>
                  )}
                </div>

                {/* Select Button */}
                {selectedId === asset.id && (
                  <div className="mt-3">
                    <AdminButton
                      variant="primary"
                      className="w-full text-xs py-1.5"
                      disabled
                    >
                      Selected
                    </AdminButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminCard>
  )
}
