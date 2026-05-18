"use client"

import type { PublicHeaderNavigationLink, PublicHeaderViewModel, PublicHeaderLocaleLink } from "@sovereign-cms/runtime"
import Link from "next/link"
import { useId, useState } from "react"

type Props = {
  header: PublicHeaderViewModel
  previewEnabled?: boolean
}

function resolveHref(href: string, previewEnabled: boolean): string {
  if (!previewEnabled || !href.startsWith("/")) {
    return href
  }
  return href.includes("?") ? `${href}&preview=1` : `${href}?preview=1`
}

function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function NavigationLink({
  item,
  previewEnabled,
}: {
  item: PublicHeaderNavigationLink
  previewEnabled: boolean
}) {
  const className = cn(
    "pub-chrome-link",
    item.active && "pub-chrome-link--active",
  )

  if (!item.href.startsWith("/")) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {item.label}
      </a>
    )
  }

  return (
    <Link
      href={resolveHref(item.href, previewEnabled)}
      className={className}
      aria-current={item.active ? "page" : undefined}
    >
      {item.label}
    </Link>
  )
}

function LocaleLink({
  item,
  previewEnabled,
}: {
  item: PublicHeaderLocaleLink
  previewEnabled: boolean
}) {
  return (
    <Link
      href={resolveHref(item.href, previewEnabled)}
      lang={item.locale}
      className={cn(
        "pub-chrome-link text-xs font-medium uppercase tracking-wide",
        item.active && "bg-zinc-800 text-zinc-50 ring-2 ring-zinc-500 ring-offset-2 ring-offset-zinc-950",
      )}
      aria-current={item.active ? "true" : undefined}
    >
      {item.locale}
    </Link>
  )
}

export function PublicHeader({ header, previewEnabled = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobilePanelId = useId()

  const hasIdentity =
    header.siteName.trim().length > 0 ||
    header.tagline.trim().length > 0 ||
    Boolean(header.logoUrl)

  return (
    <header className="pub-chrome border-b">
      <div className="pub-container">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          {hasIdentity ? (
            <div className="flex min-w-0 shrink-0 items-center gap-3">
              {header.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- tenant-provided logo URLs
                <img src={header.logoUrl} alt="" className="h-9 max-w-[120px] object-contain" />
              ) : null}
              <div className="min-w-0">
                {header.siteName.trim().length > 0 ? (
                  <p className="truncate text-base font-semibold text-zinc-100">{header.siteName}</p>
                ) : null}
                {header.tagline.trim().length > 0 ? (
                  <p className="truncate text-sm text-zinc-500">{header.tagline}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <nav aria-label="Locale navigation" className="hidden items-center gap-1 md:flex">
              {header.localeLinks.map((item) => (
                <LocaleLink key={item.locale} item={item} previewEnabled={previewEnabled} />
              ))}
            </nav>

            <button
              type="button"
              className="pub-chrome-btn md:hidden"
              aria-expanded={mobileOpen}
              aria-controls={mobilePanelId}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? "Menü schließen" : "Menü"}
            </button>
          </div>
        </div>

        {header.navigationLinks.length > 0 ? (
          <nav
            aria-label="Main navigation"
            className="hidden border-t pub-chrome-divider py-3 md:block"
          >
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
              {header.navigationLinks.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <NavigationLink item={item} previewEnabled={previewEnabled} />
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div
          id={mobilePanelId}
          className={cn(!mobileOpen && "hidden", "border-t pub-chrome-divider py-4 md:hidden")}
        >
          {header.navigationLinks.length > 0 ? (
            <nav aria-label="Main navigation">
              <ul className="flex flex-col gap-1">
                {header.navigationLinks.map((item, index) => (
                  <li key={`${item.href}-m-${index}`}>
                    <NavigationLink item={item} previewEnabled={previewEnabled} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {header.localeLinks.length > 0 ? (
            <nav
              aria-label="Locale navigation"
              className={cn(
                "flex flex-wrap gap-2",
                header.navigationLinks.length > 0 && "mt-4 border-t pub-chrome-divider pt-4",
              )}
            >
              {header.localeLinks.map((item) => (
                <LocaleLink key={`${item.locale}-m`} item={item} previewEnabled={previewEnabled} />
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  )
}

