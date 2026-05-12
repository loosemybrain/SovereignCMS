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
    <footer className="mt-auto border-t border-zinc-700 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
            <address className="max-w-sm space-y-1 text-sm not-italic">
              {contact.email.trim().length > 0 ? (
                <p>
                  <a href={`mailto:${contact.email}`} className="hover:text-zinc-200">
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
          <nav aria-label="Footer navigation" className="mt-8 border-t border-zinc-800 pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.navigationLinks.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-100"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={resolveHref(item.href, previewEnabled)}
                      className="text-sm text-zinc-400 hover:text-zinc-100"
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
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href, previewEnabled)}
                    className="text-sm text-zinc-500 hover:text-zinc-200"
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
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
                          className="text-sm text-zinc-400 hover:text-zinc-100"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={resolveHref(href, previewEnabled)}
                          aria-label={label}
                          className="text-sm text-zinc-400 hover:text-zinc-100"
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

        <p className="mt-10 border-t border-zinc-800 pt-6 text-xs text-zinc-600">
          © {footer.year}
          {footer.siteName.trim().length > 0 ? ` ${footer.siteName}` : ""}
        </p>
      </div>
    </footer>
  )
}
