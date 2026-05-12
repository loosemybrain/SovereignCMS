"use client"

import { useState } from "react"
import type {
  CmsPage,
  CreateNavigationItemInput,
  NavigationItemType,
  NavigationScope,
} from "@sovereign-cms/core"
import { clientNavigationPersistence } from "@/lib/client-navigation-persistence"
import {
  AdminButton,
  AdminCard,
  AdminCardDescription,
  AdminField,
  AdminCardHeader,
  AdminCardTitle,
  AdminInput,
  AdminSelect,
} from "@/components/admin-ui"
import { EditorHint } from "@/components/editor/patterns"

type Props = {
  tenantId: string
  activeLocale: string
  pages: CmsPage[]
  defaultScope?: NavigationScope
  lockScope?: boolean
}

export function CreateNavigationItemForm({
  tenantId,
  activeLocale,
  pages,
  defaultScope = "main",
  lockScope = false,
}: Props) {
  const effectiveDefaultScope = defaultScope ?? "main"
  const [scope, setScope] = useState<NavigationScope>(effectiveDefaultScope)
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

      const resolvedScope = lockScope ? effectiveDefaultScope : scope

      const input: CreateNavigationItemInput = {
        tenantId,
        locale: activeLocale,
        label,
        type,
        pageId: type === "page" ? pageId : undefined,
        href: type === "external" ? href : undefined,
        scope: resolvedScope,
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

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-sm text-emerald-300" aria-live="polite">
          {successMessage}
        </p>
      )}

      {lockScope ? (
        <div className="px-6">
          <EditorHint tone="info">
            Scope ist fest auf <span className="font-mono">{effectiveDefaultScope}</span> gesetzt (Footer-Navigation).
          </EditorHint>
        </div>
      ) : (
        <div className="px-6">
          <AdminField id="navigation-scope" label="Scope">
            {(fieldProps) => (
              <AdminSelect
                {...fieldProps}
                value={scope}
                onChange={(e) => setScope(e.target.value as NavigationScope)}
              >
                <option value="main">main (Header)</option>
                <option value="footer">footer</option>
              </AdminSelect>
            )}
          </AdminField>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-3 px-6 pb-6">
        <AdminField id="navigation-label" label="Label" error={error}>
          {(fieldProps) => (
            <AdminInput
              {...fieldProps}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Main link label"
            />
          )}
        </AdminField>

        <AdminField id="navigation-type" label="Type" error={error}>
          {(fieldProps) => (
            <AdminSelect
              {...fieldProps}
              value={type}
              onChange={(e) => setType(e.target.value as NavigationItemType)}
            >
              <option value="page">page</option>
              <option value="external">external</option>
            </AdminSelect>
          )}
        </AdminField>

        {type === "page" ? (
          <AdminField
            id="navigation-page"
            label="Page"
            error={error}
            description={
              pages.length === 0
                ? "Keine Pages fuer diese Locale vorhanden. Erstelle zuerst eine Page oder nutze einen externen Link."
                : undefined
            }
          >
            {(fieldProps) => (
              <AdminSelect
                {...fieldProps}
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
            )}
          </AdminField>
        ) : (
          <AdminField id="navigation-href" label="Href" error={error}>
            {(fieldProps) => (
              <AdminInput
                {...fieldProps}
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="https://... or /path"
              />
            )}
          </AdminField>
        )}

        <AdminButton type="submit" disabled={!canSubmit} className="w-fit">
          {isCreating ? "Creating..." : "Create Navigation Item"}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
