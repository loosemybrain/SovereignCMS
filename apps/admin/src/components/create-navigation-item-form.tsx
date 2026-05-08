"use client"

import { useState } from "react"
import type { CmsPage, CreateNavigationItemInput, NavigationItemType } from "@sovereign-cms/core"
import { clientNavigationPersistence } from "@/lib/client-navigation-persistence"
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
  activeLocale: string
  pages: CmsPage[]
}

export function CreateNavigationItemForm({ tenantId, activeLocale, pages }: Props) {
  const [label, setLabel] = useState("")
  const [type, setType] = useState<NavigationItemType>("page")
  const [pageId, setPageId] = useState(pages[0]?.id ?? "")
  const [href, setHref] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const canSubmit =
    !isCreating &&
    label.trim().length > 0 &&
    (type === "page" ? pageId.trim().length > 0 : href.trim().length > 0)

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setIsCreating(true)
      setError(null)
      setSuccessMessage(null)

      const input: CreateNavigationItemInput = {
        tenantId,
        locale: activeLocale,
        label,
        type,
        pageId: type === "page" ? pageId : undefined,
        href: type === "external" ? href : undefined,
      }

      const result = await clientNavigationPersistence.createNavigationItem(input)
      if (result.success) {
        setLabel("")
        setHref("")
        setPageId(pages[0]?.id ?? "")
        setSuccessMessage(
          `Navigation Item erstellt: ${result.item.label}. Hinweis: InMemory-Daten sind aktuell nicht dauerhaft persistiert und die Liste aktualisiert sich ggf. erst nach Reload.`,
        )
      }
    } catch (createError) {
      console.error("[navigation] create failed", createError)
      setError("Navigation Item konnte nicht erstellt werden")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminCard className="space-y-4">
      <AdminCardHeader>
        <AdminCardTitle>Create Navigation Item</AdminCardTitle>
        <AdminCardDescription>Create item for locale: {activeLocale}</AdminCardDescription>
      </AdminCardHeader>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

      <form onSubmit={handleCreate} className="space-y-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Label</label>
          <AdminInput
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Main link label"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Type</label>
          <AdminSelect
            value={type}
            onChange={(e) => setType(e.target.value as NavigationItemType)}
          >
            <option value="page">page</option>
            <option value="external">external</option>
          </AdminSelect>
        </div>

        {type === "page" ? (
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Page</label>
            {pages.length === 0 && (
              <p className="text-xs text-amber-300 mb-2">
                Keine Pages fuer diese Locale vorhanden. Erstelle zuerst eine Page oder nutze einen externen Link.
              </p>
            )}
            <AdminSelect
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              disabled={pages.length === 0}
            >
              {pages.length === 0 && <option value="">Keine Pages verfuegbar</option>}
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title} ({page.slug})
                </option>
              ))}
            </AdminSelect>
          </div>
        ) : (
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Href</label>
            <AdminInput
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://... or /path"
            />
          </div>
        )}

        <AdminButton
          type="submit"
          disabled={!canSubmit}
          className="w-fit"
        >
          {isCreating ? "Creating..." : "Create Navigation Item"}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
