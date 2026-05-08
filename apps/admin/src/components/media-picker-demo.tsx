"use client"

import { useState } from "react"
import type { MediaAsset } from "@sovereign-cms/core"
import { MediaPicker } from "@/components/media-picker"
import { AdminCard } from "@/components/admin-ui"

type Props = {
  tenantId: string
}

export function MediaPickerDemo({ tenantId }: Props) {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold admin-text mb-4">
          Media Picker Demo
        </h2>
        <p className="text-sm admin-text-muted mb-6">
          This is a test integration of the MediaPicker component. Select an asset to see the details below.
        </p>
      </div>

      <MediaPicker
        tenantId={tenantId}
        selectedAssetId={selectedAsset?.id}
        onSelect={(asset) => setSelectedAsset(asset)}
      />

      {selectedAsset && (
        <AdminCard className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold admin-text">Selected Asset</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Title
                </p>
                <p className="text-sm admin-text mt-1">{selectedAsset.title}</p>
              </div>

              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Type
                </p>
                <p className="text-sm admin-text mt-1">{selectedAsset.type}</p>
              </div>

              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  URL
                </p>
                <p className="text-xs admin-text-muted break-all mt-1">
                  {selectedAsset.url}
                </p>
              </div>

              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Alt Text
                </p>
                <p className="text-sm admin-text mt-1">
                  {selectedAsset.alt || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Status
                </p>
                <p className="text-sm admin-text mt-1">{selectedAsset.status}</p>
              </div>

              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Updated
                </p>
                <p className="text-xs admin-text-muted mt-1">
                  {new Date(selectedAsset.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedAsset.type === "image" && selectedAsset.width && selectedAsset.height && (
              <div>
                <p className="text-xs admin-text-muted uppercase tracking-wide">
                  Dimensions
                </p>
                <p className="text-sm admin-text mt-1">
                  {selectedAsset.width} × {selectedAsset.height}
                </p>
              </div>
            )}
          </div>
        </AdminCard>
      )}
    </div>
  )
}
