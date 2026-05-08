"use client"

import { useState } from "react"
import type { MediaAssetType } from "@sovereign-cms/core"
import { clientMediaPersistence } from "@/lib/client-media-persistence"
import {
  AdminButton,
  AdminCard,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
  AdminInput,
  AdminSelect,
} from "@/components/admin-ui"

type Props = {
  tenantId: string
}

export function CreateMediaAssetForm({ tenantId }: Props) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<MediaAssetType>("image")
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      setSuccessMessage(null)
      setIsCreating(true)

      const result = await clientMediaPersistence.createMediaAsset({
        tenantId,
        type,
        title,
        url,
        alt: alt.trim() ? alt : undefined,
      })

      if (result.success) {
        setSuccessMessage(
          `Asset erstellt: "${result.asset.title}" (persisted=${String(result.persisted)} — InMemory, nicht dauerhaft).`,
        )
        setTitle("")
        setUrl("")
        setAlt("")
        setType("image")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Media asset creation failed"
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminCard className="space-y-4">
      <AdminCardHeader>
        <AdminCardTitle>Create Media Asset</AdminCardTitle>
        <AdminCardDescription>
          URL-basiertes Platzhalter-Asset (kein Datei-Upload). Speicherung nur im InMemory-Adapter.
        </AdminCardDescription>
      </AdminCardHeader>

      {error && (
        <div className="rounded bg-red-900/30 border border-red-800/50 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded bg-emerald-900/30 border border-emerald-800/50 p-3 text-emerald-300 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium admin-text-muted" htmlFor="media-title">
            Title
          </label>
          <AdminInput
            id="media-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Asset title"
            required
            disabled={isCreating}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium admin-text-muted" htmlFor="media-type">
            Type
          </label>
          <AdminSelect
            id="media-type"
            value={type}
            onChange={(e) => setType(e.target.value as MediaAssetType)}
            disabled={isCreating}
          >
            <option value="image">image</option>
            <option value="document">document</option>
            <option value="video">video</option>
            <option value="other">other</option>
          </AdminSelect>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium admin-text-muted" htmlFor="media-url">
            URL
          </label>
          <AdminInput
            id="media-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or /path"
            required
            disabled={isCreating}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium admin-text-muted" htmlFor="media-alt">
            Alt (optional)
          </label>
          <AdminInput
            id="media-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Alternative text"
            disabled={isCreating}
          />
        </div>

        <AdminButton type="submit" disabled={isCreating}>
          {isCreating ? "Creating…" : "Create Media Asset"}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
