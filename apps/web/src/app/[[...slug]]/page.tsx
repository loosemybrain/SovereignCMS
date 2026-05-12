import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { PublicPageView } from "@/components/public/PublicPageView"
import { loadPublicPage } from "@/lib/load-public-page"
import { resolvePublicLocaleAndSlug } from "@/lib/public-route-locale"
import { createRuntime } from "@sovereign-cms/runtime"

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PublicCatchAllPage({ params, searchParams }: Props) {
  const { slug: segments } = await params
  const runtime = createRuntime()
  const supportedLocales = runtime.config.supportedLocales.map((locale) => locale.code)
  const defaultLocale = runtime.config.defaultLocale ?? "de"
  const { locale, slug } = resolvePublicLocaleAndSlug({
    segments,
    supportedLocales,
    defaultLocale,
  })

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost"

  const search = await searchParams

  const data = await loadPublicPage({ host, slug, locale, searchParams: search })
  if (!data) notFound()
  return <PublicPageView {...data} />
}
