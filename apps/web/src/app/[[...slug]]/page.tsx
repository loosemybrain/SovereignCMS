import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { PublicPageView } from "@/components/public/PublicPageView"
import { loadPublicPage } from "@/lib/load-public-page"

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PublicCatchAllPage({ params, searchParams }: Props) {
  const { slug: segments } = await params
  const slug = !segments?.length ? "home" : segments.join("/")

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost"

  const search = await searchParams

  const data = await loadPublicPage({ host, slug, locale: "de", searchParams: search })
  if (!data) notFound()
  return <PublicPageView {...data} />
}
