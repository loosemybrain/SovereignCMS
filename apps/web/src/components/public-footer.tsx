import type { PublicFooterViewModel } from "@sovereign-cms/runtime"
import Link from "next/link"

type Props = {
  footer: PublicFooterViewModel
  previewEnabled?: boolean
}

function resolveHref(href: string, previewEnabled: boolean): string {
  if (!previewEnabled || !href.startsWith("/")) {
    return href
  }
  return href.includes("?") ? `${href}&preview=1` : `${href}?preview=1`
}

function isHttpHref(href: string): boolean {
  const t = href.trim()
  return t.startsWith("http://") || t.startsWith("https://")
}

const linkBase =
  "pub-interactive text-sm text-zinc-400 underline-offset-4 hover:text-zinc-100 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"

const legalLinkBase =
  "pub-interactive text-sm text-zinc-500 underline-offset-4 hover:text-zinc-200 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"

export function PublicFooter({ footer, previewEnabled = false }: Props) {
  const contact = footer.contact
  const visibleSocialLinks = footer.socialLinks.filter(
    (l) => l.label.trim().length > 0 && l.href.trim().length > 0,
  )
  const hasContact =
    contact.email.trim().length > 0 ||
    contact.phone.trim().length > 0 ||
    contact.address.trim().length > 0

  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="pub-container py-12 sm:py-16">

        {/* Brand + contact row */}
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-12">
          {(footer.siteName.trim().length > 0 || footer.tagline.trim().length > 0) ? (
            <div className="max-w-xs space-y-1.5">
              {footer.siteName.trim().length > 0 ? (
                <p className="text-sm font-semibold text-zinc-100">{footer.siteName}</p>
              ) : null}
              {footer.tagline.trim().length > 0 ? (
                <p className="text-sm leading-relaxed text-zinc-500">{footer.tagline}</p>
              ) : null}
            </div>
          ) : null}

          {hasContact ? (
            <address className="max-w-xs space-y-1 text-sm not-italic text-zinc-400">
              {contact.email.trim().length > 0 ? (
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="pub-interactive text-zinc-400 underline-offset-4 hover:text-zinc-100 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  >
                    {contact.email}
                  </a>
                </p>
              ) : null}
              {contact.phone.trim().length > 0 ? (
                <p>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="pub-interactive text-zinc-400 hover:text-zinc-100 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  >
                    {contact.phone}
                  </a>
                </p>
              ) : null}
              {contact.address.trim().length > 0 ? (
                <p className="whitespace-pre-line">{contact.address}</p>
              ) : null}
            </address>
          ) : null}
        </div>

        {/* Footer navigation */}
        {footer.navigationLinks.length > 0 ? (
          <nav aria-label="Footer navigation" className="mt-10 border-t border-zinc-800 pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {footer.navigationLinks.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  {isHttpHref(item.href) ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkBase}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={resolveHref(item.href, previewEnabled)}
                      className={linkBase}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/* Social links */}
        {visibleSocialLinks.length > 0 ? (
          <nav aria-label="Social links" className="mt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
              {visibleSocialLinks.map((link) => {
                const href = link.href.trim()
                const label = link.label.trim()
                const external = isHttpHref(href)
                return (
                  <li key={link.id}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${label} (opens in new tab)`}
                        className={linkBase}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={resolveHref(href, previewEnabled)}
                        aria-label={label}
                        className={linkBase}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}

        {/* Legal links */}
        {footer.legalLinks.length > 0 ? (
          <nav aria-label="Legal links" className="mt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footer.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href, previewEnabled)}
                    className={legalLinkBase}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/* Copyright */}
        <p className="mt-8 border-t border-zinc-800 pt-6 text-xs text-zinc-600">
          © {footer.year}
          {footer.siteName.trim().length > 0 ? ` ${footer.siteName}` : ""}
        </p>
      </div>
    </footer>
  )
}
