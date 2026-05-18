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
    <footer className="pub-chrome mt-auto border-t">
      <div className="pub-container py-10 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
          {(footer.siteName.trim().length > 0 || footer.tagline.trim().length > 0) && (
            <div className="max-w-md space-y-2">
              {footer.siteName.trim().length > 0 ? (
                <p className="text-sm font-semibold text-zinc-100">{footer.siteName}</p>
              ) : null}
              {footer.tagline.trim().length > 0 ? (
                <p className="text-sm text-zinc-500">{footer.tagline}</p>
              ) : null}
            </div>
          )}

          {hasContact && (
            <address className="max-w-sm space-y-2 text-sm not-italic leading-relaxed text-zinc-400">
              {contact.email.trim().length > 0 ? (
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="pub-chrome-link inline-flex min-h-0 px-0 py-0"
                  >
                    {contact.email}
                  </a>
                </p>
              ) : null}
              {contact.phone.trim().length > 0 ? <p>{contact.phone}</p> : null}
              {contact.address.trim().length > 0 ? <p>{contact.address}</p> : null}
            </address>
          )}
        </div>

        {footer.navigationLinks.length > 0 ? (
          <nav aria-label="Footer navigation" className="mt-8 border-t pub-chrome-divider pt-8">
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {footer.navigationLinks.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-chrome-link"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={resolveHref(item.href, previewEnabled)}
                      className="pub-chrome-link"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {footer.legalLinks.length > 0 ? (
          <nav aria-label="Legal links" className="mt-6">
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {footer.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href, previewEnabled)}
                    className="pub-chrome-link text-zinc-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {visibleSocialLinks.length > 0 ? (
          <nav aria-label="Social links" className="mt-6">
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
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
                        aria-label={label}
                        className="pub-chrome-link"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={resolveHref(href, previewEnabled)}
                        aria-label={label}
                        className="pub-chrome-link"
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

        <p className="mt-10 border-t pub-chrome-divider pt-6 text-xs text-zinc-600">
          © {footer.year}
          {footer.siteName.trim().length > 0 ? ` ${footer.siteName}` : ""}
        </p>
      </div>
    </footer>
  )
}
