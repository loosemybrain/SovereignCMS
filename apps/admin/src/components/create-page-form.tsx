"use client"

import { useMemo, useState } from "react"
import type { CreatePageInput, SupportedLocale } from "@sovereign-cms/core"
import { clientPageCreationPersistence } from "@/lib/client-page-creation-persistence"
import { clientEditorPersistence } from "@/lib/client-editor-persistence"
import { contentTemplates } from "@/content-templates/template-registry"
import { emptyPageTemplate } from "@/content-templates/empty-page-template"
import { createTemplateBlocks } from "@/lib/create-template-blocks"
import { resolveTenantComposition } from "@/lib/resolve-tenant-composition"
import { resolveCompositionLocales } from "@/lib/resolve-composition-locales"
import { cn } from "@sovereign-cms/ui"
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
import { normalizeSlug } from "@/lib/normalize-slug"

type Props = {
  tenantId: string
  activeLocale: string
  runtimeSupportedLocales: SupportedLocale[]
  runtimeDefaultLocale: string
}

function slugFromTitle(title: string): string {
  const normalized = normalizeSlug(title)
  if (normalized.length > 0) {
    return normalized
  }
  return title.trim().length > 0 ? "page" : ""
}

export function CreatePageForm({
  tenantId,
  activeLocale,
  runtimeSupportedLocales,
  runtimeDefaultLocale,
}: Props) {
  const composition = useMemo(() => resolveTenantComposition({ tenantId }), [tenantId])
  const alignedLocales = useMemo(
    () =>
      resolveCompositionLocales({
        compositionLocales: composition.enabledLocales,
        compositionDefaultLocale: composition.defaultLocale,
        runtimeSupportedLocales,
        runtimeDefaultLocale,
      }),
    [composition.defaultLocale, composition.enabledLocales, runtimeDefaultLocale, runtimeSupportedLocales],
  )
  const availableTemplates = useMemo(
    () => contentTemplates.filter((template) => composition.allowedTemplateIds.includes(template.id)),
    [composition.allowedTemplateIds],
  )
  const fallbackTemplate = availableTemplates[0] ?? emptyPageTemplate

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [templateId, setTemplateId] = useState(composition.defaultTemplateId)
  const [locale, setLocale] = useState(activeLocale)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdPageSlug, setCreatedPageSlug] = useState<string | null>(null)
  const effectiveTemplateId = availableTemplates.some((template) => template.id === templateId)
    ? templateId
    : composition.defaultTemplateId
  const selectedTemplate =
    availableTemplates.find((template) => template.id === effectiveTemplateId) ?? fallbackTemplate
  const effectiveLocale = alignedLocales.enabledLocales.includes(locale) ? locale : alignedLocales.defaultLocale

  const normalizedSubmitSlug = normalizeSlug(slug) || "page"
  const slugLooksUnsupported =
    slug.trim().length > 0 && normalizeSlug(slug).length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      setIsCreating(true)

      const result = await clientPageCreationPersistence.createPage({
        tenantId,
        locale: effectiveLocale,
        title,
        slug: normalizedSubmitSlug,
      } as CreatePageInput)

      if (result.success) {
        const seededBlocks = createTemplateBlocks(selectedTemplate).map((block, index) => {
          const now = new Date().toISOString()
          return {
            ...block,
            tenantId,
            pageId: result.page.id,
            sortOrder: index + 1,
            createdAt: now,
            updatedAt: now,
          }
        })

        await clientEditorPersistence.savePageDraft({
          tenantId,
          pageId: result.page.id,
          locale: effectiveLocale,
          blocks: seededBlocks,
        })

        setCreatedPageSlug(result.page.slug)
        setTitle("")
        setSlug("")
        setIsSlugManuallyEdited(false)
        setTemplateId(composition.defaultTemplateId)
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
        <AdminCardDescription>Create a new page with composition defaults for this tenant.</AdminCardDescription>
      </AdminCardHeader>

      {error && (
        <div
          className="rounded bg-red-900/30 border border-red-800/50 p-3 text-red-300 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {createdPageSlug && (
        <div
          className="rounded bg-emerald-900/30 border border-emerald-800/50 p-3 text-emerald-300 text-sm"
          aria-live="polite"
        >
          <strong>Page erstellt:</strong> {createdPageSlug}
          <br />
          <span className="text-xs text-emerald-400/70">
            Hinweis: InMemory-Daten sind aktuell nicht dauerhaft persistiert.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <AdminField id="create-page-title" label="Title *" error={error}>
          {(fieldProps) => (
            <AdminInput
              {...fieldProps}
              type="text"
              value={title}
              onChange={(e) => {
                const nextTitle = e.target.value
                setTitle(nextTitle)
                if (!isSlugManuallyEdited) {
                  setSlug(slugFromTitle(nextTitle))
                }
              }}
              placeholder="Enter page title"
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            />
          )}
        </AdminField>

        <AdminField
          id="create-page-slug"
          label="Slug *"
          error={error}
          description="Lowercase kebab-case (letters, numbers, hyphens). Special characters are normalized away."
        >
          {(fieldProps) => (
            <AdminInput
              {...fieldProps}
              type="text"
              value={slug}
              onChange={(e) => {
                const nextSlug = e.target.value
                setSlug(nextSlug)
                setIsSlugManuallyEdited(nextSlug.trim().length > 0)
              }}
              placeholder="e.g., about or services/consulting"
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            />
          )}
        </AdminField>

        <AdminField
          id="create-page-template"
          label="Template"
          description="Choose a starter template for initial blocks."
        >
          {(fieldProps) => (
            <AdminSelect
              {...fieldProps}
              value={effectiveTemplateId}
              onChange={(e) => setTemplateId(e.target.value)}
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            >
              {availableTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </AdminSelect>
          )}
        </AdminField>

        <AdminField id="create-page-locale" label="Locale" description="Enabled locales from tenant composition.">
          {(fieldProps) => (
            <AdminSelect
              {...fieldProps}
              value={effectiveLocale}
              onChange={(e) => setLocale(e.target.value)}
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            >
              {alignedLocales.enabledLocales.map((enabledLocale) => (
                <option key={enabledLocale} value={enabledLocale}>
                  {enabledLocale}
                </option>
              ))}
            </AdminSelect>
          )}
        </AdminField>

        {alignedLocales.droppedLocales.length > 0 ? (
          <EditorHint tone="warning">
            Some composition locales are not supported by runtime: {alignedLocales.droppedLocales.join(", ")}.
          </EditorHint>
        ) : null}

        {slugLooksUnsupported ? (
          <EditorHint tone="warning">
            Slug contains only unsupported characters; submission will use &quot;page&quot; unless you enter a valid slug.
          </EditorHint>
        ) : null}

        <EditorHint tone="info">
          {selectedTemplate.description ?? "No template description available."} Starter blocks:{" "}
          {selectedTemplate.blocks.length}.
        </EditorHint>
        <EditorHint tone="warning">
          Composition defaults: brand <strong>{composition.brandId}</strong>, default template{" "}
          <strong>{composition.defaultTemplateId}</strong>, default locale{" "}
          <strong>{alignedLocales.defaultLocale}</strong>.
        </EditorHint>

        <AdminButton
          type="submit"
          disabled={isCreating || !title.trim()}
          variant="primary"
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Page"}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
