"use client"

import { useState, type ReactNode } from "react"
import type { MediaAssetType } from "@sovereign-cms/core"
import { ChevronDown, FileText, Image as ImageIcon, Plus, Upload, Video } from "lucide-react"
import { cn } from "@sovereign-cms/ui"
import { clientMediaPersistence } from "@/lib/client-media-persistence"
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
          `Asset erstellt: „${result.asset.title}“ (persisted=${String(result.persisted)} — InMemory, nicht dauerhaft).`,
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
    <section
      className="overflow-hidden rounded-xl border admin-border admin-surface shadow-sm"
      aria-label="Medien-Asset hochladen"
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
          <span className="block text-sm font-semibold tracking-tight admin-text">Medien-Asset hochladen</span>
          <span className="mt-0.5 block text-xs leading-snug admin-text-muted">
            Neues Medien-Asset zur Bibliothek hinzufügen (URL-basiert, kein Datei-Upload).
          </span>
        </span>
      </button>

      {expanded ? (
        <div className="space-y-5 px-4 pb-5 pt-4 sm:px-5">
          {error ? (
            <AdminAlert variant="destructive" title="Fehler">
              {error}
            </AdminAlert>
          ) : null}

          {successMessage ? (
            <AdminAlert variant="success" title="Gespeichert">
              {successMessage}
            </AdminAlert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="space-y-3">
              <legend className="sr-only">Asset-Typ</legend>
              <p className="text-xs font-semibold uppercase tracking-wide admin-text-muted">Typ wählen</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <TypeChoiceButton
                  active={type === "image"}
                  label="Bild"
                  icon={<ImageIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-sky-400/25 to-blue-500/20"
                  onClick={() => setType("image")}
                  disabled={isCreating}
                />
                <TypeChoiceButton
                  active={type === "video"}
                  label="Video"
                  icon={<Video className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-rose-400/20 to-fuchsia-500/15"
                  onClick={() => setType("video")}
                  disabled={isCreating}
                />
                <TypeChoiceButton
                  active={type === "document"}
                  label="Dokument"
                  icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden />}
                  accent="from-amber-400/25 to-orange-500/18"
                  onClick={() => setType("document")}
                  disabled={isCreating}
                />
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminFormField id="media-title" label="Titel" required>
                <AdminInput
                  id="media-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel des Assets"
                  required
                  disabled={isCreating}
                />
              </AdminFormField>
              <AdminFormField
                id="media-alt"
                label="Alt-Text"
                description="Für Barrierefreiheit und Screenreader."
              >
                <AdminInput
                  id="media-alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Inhalt kurz beschreiben"
                  disabled={isCreating}
                />
              </AdminFormField>
            </div>

            <AdminFormField
              id="media-url"
              label="URL"
              description="Externe URL oder Pfad zum Asset (z. B. https://… oder /pfad/zur/datei)."
            >
              <AdminInput
                id="media-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://… oder /pfad/zur/datei"
                required
                disabled={isCreating}
              />
            </AdminFormField>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <AdminButton type="submit" disabled={isCreating} variant="primary" className="gap-2 px-4">
                <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                {isCreating ? "Wird angelegt…" : "Medien-Asset anlegen"}
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
