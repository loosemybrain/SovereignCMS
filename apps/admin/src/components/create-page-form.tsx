"use client"

import { useState } from "react"
import type { CreatePageInput } from "@sovereign-cms/core"
import { clientPageCreationPersistence } from "@/lib/client-page-creation-persistence"
import { cn } from "@sovereign-cms/ui"

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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Create New Page</h2>
        <p className="text-sm text-zinc-400 mt-1">Create a new page for locale: {activeLocale}</p>
      </div>

      {error && (
        <div className="rounded bg-red-900/30 border border-red-800/50 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {createdPageSlug && (
        <div className="rounded bg-emerald-900/30 border border-emerald-800/50 p-3 text-emerald-300 text-sm">
          <strong>Page created:</strong> {createdPageSlug}
          <br />
          <span className="text-xs text-emerald-400/70">
            Note: InMemory data is currently not persistent
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            disabled={isCreating}
            className={cn(
              "w-full px-3 py-2 rounded border bg-zinc-900/40 text-zinc-100 placeholder-zinc-500 transition-colors",
              isCreating ? "cursor-not-allowed opacity-50" : "border-zinc-800 hover:border-zinc-700",
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., about or services/consulting"
            disabled={isCreating}
            className={cn(
              "w-full px-3 py-2 rounded border bg-zinc-900/40 text-zinc-100 placeholder-zinc-500 transition-colors",
              isCreating ? "cursor-not-allowed opacity-50" : "border-zinc-800 hover:border-zinc-700",
            )}
          />
          <p className="text-xs text-zinc-500 mt-1">Only lowercase letters, numbers, hyphens, and forward slashes</p>
        </div>

        <button
          type="submit"
          disabled={isCreating || !title.trim() || !slug.trim()}
          className={cn(
            "w-full rounded px-4 py-2 text-sm font-medium transition-all duration-200",
            isCreating || !title.trim() || !slug.trim()
              ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
          )}
        >
          {isCreating ? "Creating..." : "Create Page"}
        </button>
      </form>
    </div>
  )
}
