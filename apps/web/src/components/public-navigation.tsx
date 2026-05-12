import type { PublicNavigationItemViewModel } from "@sovereign-cms/runtime"
import Link from "next/link"

type Props = {
  items: PublicNavigationItemViewModel[]
  previewEnabled?: boolean
}

export function PublicNavigation({ items, previewEnabled }: Props) {
  return (
    <nav className="border-b border-zinc-700 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {items.map((item) => {
              if (item.type === "page") {
                const href = previewEnabled ? `${item.href}?preview=1` : item.href
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              }

              if (item.type === "external") {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
                  </a>
                )
              }

              return null
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
