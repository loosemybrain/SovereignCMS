import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { PublicPageView } from "@/components/public/PublicPageView"
import { loadPublicPage } from "@/lib/load-public-page"

type Props = {
  params: Promise<{ slug?: string[] }>
}

export default async function PublicCatchAllPage({ params }: Props) {
  const { slug: segments } = await params
  const slug = !segments?.length ? "home" : segments.join("/")

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost"

  const data = await loadPublicPage({ host, slug, locale: "de" })
  if (!data) notFound()
  return <PublicPageView {...data} />
}
