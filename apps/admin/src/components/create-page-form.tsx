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
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import { normalizeSlug } from "@/lib/normalize-slug"
import { localizeContentTemplate } from "@/lib/localize-content-template"

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
  const { messages } = useAdminI18n()
  const f = messages.createPageForm
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
  const selectedTemplateCopy = localizeContentTemplate(selectedTemplate, messages)
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
        setError(f.createFailed)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : f.createErrorGeneric
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminCard className="space-y-4">
      <AdminCardHeader>
        <AdminCardTitle>{f.cardTitle}</AdminCardTitle>
        <AdminCardDescription>{f.cardDescription}</AdminCardDescription>
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
          <strong>{f.createdLabel}</strong> {createdPageSlug}
          <br />
          <span className="text-xs text-emerald-400/70">{f.inMemoryHint}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <AdminField id="create-page-title" label={f.titleLabel} error={error}>
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
              placeholder={f.titlePlaceholder}
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            />
          )}
        </AdminField>

        <AdminField
          id="create-page-slug"
          label={f.slugLabel}
          error={error}
          description={f.slugDescription}
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
              placeholder={f.slugPlaceholder}
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            />
          )}
        </AdminField>

        <AdminField
          id="create-page-template"
          label={f.templateLabel}
          description={f.templateDescription}
        >
          {(fieldProps) => (
            <AdminSelect
              {...fieldProps}
              value={effectiveTemplateId}
              onChange={(e) => setTemplateId(e.target.value)}
              disabled={isCreating}
              className={cn(isCreating && "cursor-not-allowed opacity-50")}
            >
              {availableTemplates.map((template) => {
                const copy = localizeContentTemplate(template, messages)
                return (
                  <option key={template.id} value={template.id}>
                    {copy.label}
                  </option>
                )
              })}
            </AdminSelect>
          )}
        </AdminField>

        <AdminField id="create-page-locale" label={f.localeLabel} description={f.localeDescription}>
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
            {formatAdminMessage(f.droppedLocalesWarning, {
              locales: alignedLocales.droppedLocales.join(", "),
            })}
          </EditorHint>
        ) : null}

        {slugLooksUnsupported ? (
          <EditorHint tone="warning">
            {f.slugUnsupportedWarning}
          </EditorHint>
        ) : null}

        <EditorHint tone="info">
          {selectedTemplateCopy.description || f.noTemplateDescription} {f.starterBlocks}{" "}
          {selectedTemplate.blocks.length}.
        </EditorHint>
        <EditorHint tone="warning">
          {formatAdminMessage(f.compositionDefaults, {
            brandId: composition.brandId,
            templateId: composition.defaultTemplateId,
            locale: alignedLocales.defaultLocale,
          })}
        </EditorHint>

        <AdminButton
          type="submit"
          disabled={isCreating || !title.trim()}
          variant="primary"
          className="w-full"
        >
          {isCreating ? f.creating : f.createButton}
        </AdminButton>
      </form>
    </AdminCard>
  )
}
