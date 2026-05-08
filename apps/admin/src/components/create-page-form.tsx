"use client"

import { useState } from "react"
import type { CreatePageInput } from "@sovereign-cms/core"
import { clientPageCreationPersistence } from "@/lib/client-page-creation-persistence"
import { cn } from "@sovereign-cms/ui"
import {
  AdminButton,
  AdminCard,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
  AdminInput,
} from "@/components/admin-ui"

type Props = {
  tenantId: string
  activeLocale: string
}

export function CreatePageForm({ tenantId, activeLocale }: Props) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdPageSlug, setCreatedPageSlug] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      setIsCreating(true)

      const result = await clientPageCreationPersistence.createPage({
        tenantId,
        locale: activeLocale,
        title,
        slug,
      } as CreatePageInput)

      if (result.success) {
        setCreatedPageSlug(result.page.slug)
        setTitle("")
        setSlug("")
      } else {
        setError("Failed to create page")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Page creation failed"
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminCard className="space-y-4">
      <AdminCardHeader>
        <AdminCardTitle>Create New Page</AdminCardTitle>
        <AdminCardDescription>Create a new page for locale: {activeLocale}</AdminCardDescription>
      </AdminCardHeader>

      {error && (
        <div className="rounded bg-red-900/30 border border-red-800/50 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {createdPageSlug && (
        <div className="rounded bg-emerald-900/30 border border-emerald-800/50 p-3 text-emerald-300 text-sm">
          <strong>Page erstellt:</strong> {createdPageSlug}
          <br />
          <span className="text-xs text-emerald-400/70">
            Hinweis: InMemory-Daten sind aktuell nicht dauerhaft persistiert.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
          <AdminInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            disabled={isCreating}
            className={cn(isCreating && "cursor-not-allowed opacity-50")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Slug *</label>
          <AdminInput
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., about or services/consulting"
            disabled={isCreating}
            className={cn(isCreating && "cursor-not-allowed opacity-50")}
          />
          <p className="text-xs admin-text-muted mt-1">Only lowercase letters, numbers, hyphens, and forward slashes</p>
        </div>

        <AdminButton
          type="submit"
          disabled={isCreating || !title.trim() || !slug.trim()}
          variant="primary"
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Page"}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
