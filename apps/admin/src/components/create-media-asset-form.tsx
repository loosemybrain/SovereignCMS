"use client"

import { useState, type ReactNode } from "react"
import type { MediaAssetType } from "@sovereign-cms/core"
import { ChevronDown, FileText, Image as ImageIcon, Plus, Upload, Video } from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { clientMediaPersistence } from "@/lib/client-media-persistence"
import { useAdminI18n } from "@/components/admin-i18n-provider"
import { formatAdminMessage } from "@/lib/admin-i18n"
import {
  AdminAlert,
  AdminButton,
  AdminFormField,
  AdminInput,
} from "@/components/admin-ui"

type Props = {
  tenantId: string
}

const CREATE_TYPES = ["image", "video", "document"] as const satisfies readonly MediaAssetType[]

type CreateType = (typeof CREATE_TYPES)[number]

export function CreateMediaAssetForm({ tenantId }: Props) {
  const { messages } = useAdminI18n()
  const ml = messages.mediaLibrary
  const c = messages.common
  const [expanded, setExpanded] = useState(true)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<CreateType>("image")
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
          formatAdminMessage(ml.createSuccess, {
            title: result.asset.title,
            persisted: String(result.persisted),
          }),
        )
        setTitle("")
        setUrl("")
        setAlt("")
        setType("image")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ml.createFailed
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section
      className="overflow-hidden rounded-xl border admin-border admin-surface shadow-sm"
      aria-label={ml.uploadAria}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 border-b admin-border px-4 py-3.5 text-left transition-colors",
          "bg-[color-mix(in_oklab,var(--admin-surface-muted)_55%,var(--admin-surface))] hover:bg-[color-mix(in_oklab,var(--admin-surface-muted)_75%,var(--admin-surface))]",
          "admin-focus-ring focus-visible:outline-none",
          !expanded && "rounded-b-xl border-b-transparent",
        )}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 motion-reduce:transition-none",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--admin-accent)_18%,var(--admin-surface-muted))] text-(--admin-accent)"
          aria-hidden
        >
          <Upload className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold tracking-tight admin-text">{ml.formTitle}</span>
          <span className="mt-0.5 block text-xs leading-snug admin-text-muted">{ml.formDescription}</span>
        </span>
      </button>

      {expanded ? (
        <div className="space-y-5 px-4 pb-5 pt-4 sm:px-5">
          {error ? (
            <AdminAlert variant="destructive" title={c.error}>
              {error}
            </AdminAlert>
          ) : null}

          {successMessage ? (
            <AdminAlert variant="success" title={ml.saved}>
              {successMessage}
            </AdminAlert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="space-y-3">
              <legend className="sr-only">{ml.chooseTypeSr}</legend>
              <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">{ml.chooseType}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <TypeChoiceButton
                  active={type === "image"}
                  label={ml.typeImage}
                  icon={<ImageIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-sky-400/25 to-blue-500/20"
                  onClick={() => setType("image")}
                  disabled={isCreating}
                />
                <TypeChoiceButton
                  active={type === "video"}
                  label={ml.typeVideo}
                  icon={<Video className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-rose-400/20 to-fuchsia-500/15"
                  onClick={() => setType("video")}
                  disabled={isCreating}
                />
                <TypeChoiceButton
                  active={type === "document"}
                  label={ml.typeDocument}
                  icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-amber-400/25 to-orange-500/18"
                  onClick={() => setType("document")}
                  disabled={isCreating}
                />
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminFormField id="media-title" label={ml.fieldTitle} required>
                <AdminInput
                  id="media-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={ml.titlePlaceholder}
                  required
                  disabled={isCreating}
                />
              </AdminFormField>
              <AdminFormField
                id="media-alt"
                label={ml.fieldAlt}
                description={ml.fieldAltDescription}
              >
                <AdminInput
                  id="media-alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder={ml.altPlaceholder}
                  disabled={isCreating}
                />
              </AdminFormField>
            </div>

            <AdminFormField
              id="media-url"
              label={ml.fieldUrl}
              description={ml.fieldUrlDescription}
            >
              <AdminInput
                id="media-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={ml.urlPlaceholder}
                required
                disabled={isCreating}
              />
            </AdminFormField>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <AdminButton type="submit" disabled={isCreating} variant="primary" className="gap-2 px-4">
                <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                {isCreating ? ml.creating : ml.createButton}
              </AdminButton>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}

function TypeChoiceButton({
  active,
  label,
  icon,
  accent,
  onClick,
  disabled,
}: {
  active: boolean
  label: string
  icon: ReactNode
  accent: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "flex min-h-22 flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-[border-color,box-shadow,background-color] duration-150 motion-reduce:transition-none",
        "admin-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-[color-mix(in_oklab,var(--admin-accent)_65%,var(--admin-border))] bg-[color-mix(in_oklab,var(--admin-accent)_12%,var(--admin-surface))] shadow-sm admin-text"
          : "border admin-border admin-text-muted hover:border-[color-mix(in_oklab,var(--admin-accent)_35%,var(--admin-border))] hover:admin-text bg-[color-mix(in_oklab,var(--admin-surface-muted)_40%,var(--admin-surface))]",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br text-(--admin-accent)",
          accent,
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}
