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
  const activeStyles =
    "font-semibold text-zinc-50 underline decoration-2 underline-offset-4 shadow-[inset_0_0_0_1px_rgb(161_161_170)]"
  const inactiveStyles = "text-zinc-300 hover:text-zinc-100"

  if (!item.href.startsWith("/")) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "rounded-md px-2 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400",
          inactiveStyles,
        )}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link
      href={resolveHref(item.href, previewEnabled)}
      className={cn(
        "rounded-md px-2 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400",
        item.active ? activeStyles : inactiveStyles,
      )}
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
        "rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400",
        item.active
          ? "bg-zinc-800 font-semibold text-zinc-50 ring-2 ring-zinc-500 ring-offset-2 ring-offset-zinc-950"
          : "text-zinc-400 hover:text-zinc-100",
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
    <header className="border-b border-zinc-700 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <div className="flex shrink-0 items-center gap-3 md:gap-6">
            <nav aria-label="Locale navigation" className="hidden items-center gap-1 md:flex">
              {header.localeLinks.map((item) => (
                <LocaleLink key={item.locale} item={item} previewEnabled={previewEnabled} />
              ))}
            </nav>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls={mobilePanelId}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? "Menü schließen" : "Menü"}
            </button>
          </div>
        </div>

        {header.navigationLinks.length > 0 ? (
          <nav aria-label="Main navigation" className="hidden border-t border-zinc-800 py-3 md:block">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
          className={cn(!mobileOpen && "hidden", "border-t border-zinc-800 py-4 md:hidden")}
        >
          {header.navigationLinks.length > 0 ? (
            <nav aria-label="Main navigation">
              <ul className="flex flex-col gap-2">
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
                header.navigationLinks.length > 0 && "mt-4 border-t border-zinc-800 pt-4",
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
