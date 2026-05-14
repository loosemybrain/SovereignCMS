import type {
  BlockInstance,
  ContactFormBlockProps,
  ExternalEmbedBlockProps,
  CtaBlockProps,
  FeatureGridBlockProps,
  ImageTextBlockProps,
} from "@sovereign-cms/core"
import { normalizeMediaReference } from "@sovereign-cms/core"
import { PublicContactForm } from "@/components/public-contact-form"
import { PublicExternalEmbed } from "@/components/public-external-embed"
import { parseJsonSafe } from "@/lib/parse-json-safe"
import { isValidHref } from "@/lib/safe-url-validation"

type Props = {
  block: BlockInstance
  tenantId?: string
  locale?: string
  pageId?: string
  settingsContactEmail?: string
}

export function PublicBlockRenderer({
  block,
  tenantId,
  locale,
  pageId,
  settingsContactEmail,
}: Props) {
  switch (block.type) {
    case "hero": {
      const headline = String(block.props.headline ?? "")
      const subline =
        block.props.subline !== undefined && block.props.subline !== null
          ? String(block.props.subline)
          : undefined
      const mediaUrl =
        block.props.mediaUrl !== undefined && block.props.mediaUrl !== null
          ? String(block.props.mediaUrl)
          : undefined
      const mediaAlt = String(block.props.mediaAlt ?? headline ?? "Hero image")

      return (
        <section className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
          {mediaUrl ? (
            <div className="relative w-full h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl}
                alt={mediaAlt}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
          <div className="p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{headline}</h1>
            {subline ? <p className="mt-2 text-gray-600">{subline}</p> : null}
          </div>
        </section>
      )
    }
    case "text": {
      const body = String(block.props.body ?? "")
      return <p className="text-base leading-relaxed text-gray-700">{body}</p>
    }
    case "contact-form": {
      if (!tenantId || !locale) {
        return <p className="text-sm text-red-600">Contact form requires tenantId and locale</p>
      }

      const props = (block.props ?? {}) as ContactFormBlockProps
      const recipientEmail = props.recipientEmail || settingsContactEmail

      return (
        <PublicContactForm
          tenantId={tenantId}
          locale={locale}
          pageId={pageId}
          blockId={block.id}
          recipientEmail={recipientEmail}
          headline={props.headline}
          intro={props.intro}
          submitLabel={props.submitLabel}
          successMessage={props.successMessage}
          consentLabel={props.consentLabel}
        />
      )
    }
    case "external-embed": {
      const props = (block.props ?? {}) as ExternalEmbedBlockProps

      return (
        <PublicExternalEmbed
          provider={props.provider}
          title={props.title}
          embedUrl={props.embedUrl}
          consentText={props.consentText}
          buttonLabel={props.buttonLabel}
        />
      )
    }
    case "cta": {
      const props = (block.props ?? {}) as CtaBlockProps
      const eyebrow = String(props.eyebrow ?? "")
      const headline = String(props.headline ?? "")
      const body = String(props.body ?? "")
      const primaryLabel = String(props.primaryLabel ?? "")
      const primaryHref = String(props.primaryHref ?? "")
      const secondaryLabel = String(props.secondaryLabel ?? "")
      const secondaryHref = String(props.secondaryHref ?? "")
      const align = props.align === "left" ? "left" : "center"

      const alignClass = align === "center" ? "text-center" : "text-left"
      const justifyClass = align === "center" ? "justify-center" : "justify-start"

      return (
        <section className={`py-12 px-6 rounded-lg bg-white border border-gray-200 shadow-sm ${alignClass}`}>
          {eyebrow && (
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{eyebrow}</p>
          )}
          {headline && (
            <h2 className="text-3xl font-semibold text-gray-900 mt-2">{headline}</h2>
          )}
          {body && (
            <p className="text-lg text-gray-600 mt-4">{body}</p>
          )}

          {(primaryLabel || secondaryLabel) && (
            <div className={`flex gap-4 mt-8 ${justifyClass}`}>
              {primaryLabel && isValidHref(primaryHref) && (
                <a
                  href={primaryHref}
                  className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors"
                >
                  {primaryLabel}
                </a>
              )}
              {secondaryLabel && isValidHref(secondaryHref) && (
                <a
                  href={secondaryHref}
                  className="px-6 py-3 bg-gray-200 text-gray-900 rounded font-semibold hover:bg-gray-300 transition-colors"
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
          )}
        </section>
      )
    }
    case "feature-grid": {
      const props = (block.props ?? {}) as FeatureGridBlockProps & { itemsJson?: string }
      const headline = String(props.headline ?? "")
      const intro = String(props.intro ?? "")

      // Prefer items, fallback to itemsJson for old content only
      let items: unknown[] = Array.isArray(props.items) ? props.items : []
      if (items.length === 0) {
        const itemsJson = typeof props.itemsJson === "string" ? props.itemsJson : null
        if (itemsJson) {
          const parsed = parseJsonSafe<unknown[]>(itemsJson)
          if (parsed && Array.isArray(parsed)) {
            items = parsed
          }
        }
      }

      // Handle columns as string or number
      const columnsRaw = props.columns ?? "3"
      const columnsNum = typeof columnsRaw === "string" ? parseInt(columnsRaw, 10) : columnsRaw
      const columns = isNaN(columnsNum) ? 3 : columnsNum

      const gridColsClass = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
      }[columns as 2 | 3 | 4] || "md:grid-cols-3"

      return (
        <section className="py-12 px-6 rounded-lg bg-white border border-gray-200 shadow-sm">
          {headline && (
            <h2 className="text-3xl font-semibold text-gray-900">{headline}</h2>
          )}
          {intro && (
            <p className="text-lg text-gray-600 mt-2">{intro}</p>
          )}

          {items.length > 0 && (
            <div className={`grid grid-cols-1 ${gridColsClass} gap-6 mt-8`}>
              {items.map((item: unknown) => {
                const itemRecord = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
                const itemId = String(itemRecord.id ?? "")
                const itemTitle = String(itemRecord.title ?? "")
                const itemBody = String(itemRecord.body ?? "")

                return (
                  <div
                    key={itemId || itemTitle}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6"
                  >
                    <h3 className="font-semibold text-gray-900">{itemTitle}</h3>
                    {itemBody && (
                      <p className="text-sm text-gray-600 mt-2">{itemBody}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )
    }
    case "image-text": {
      const props = (block.props ?? {}) as ImageTextBlockProps & { mediaAssetId?: string | null }
      const headline = String(props.headline ?? "")
      const body = String(props.body ?? "")
      const imagePosition = props.imagePosition === "left" ? "left" : "right"
      const ctaLabel = String(props.ctaLabel ?? "")
      const ctaHref = String(props.ctaHref ?? "")

      const normalized = normalizeMediaReference({
        imageUrl: props.imageUrl,
        imageAlt: props.imageAlt,
        assetId: props.mediaAssetId,
      })
      const imageAltDisplay = normalized.alt || headline || "Image"

      const contentElement = (
        <div className="flex flex-col justify-center">
          {headline && (
            <h2 className="text-3xl font-semibold text-gray-900">{headline}</h2>
          )}
          {body && (
            <p className="text-gray-600 mt-4">{body}</p>
          )}
          {ctaLabel && isValidHref(ctaHref) && (
            <div className="mt-6">
              <a
                href={ctaHref}
                className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                {ctaLabel}
              </a>
            </div>
          )}
        </div>
      )

      const imageElement =
        normalized.isRenderable && normalized.safeUrl ? (
          <div className="relative h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalized.safeUrl}
              alt={imageAltDisplay}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        ) : null

      return (
        <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {imagePosition === "left" ? (
              <>
                {imageElement}
                {contentElement}
              </>
            ) : (
              <>
                {contentElement}
                {imageElement}
              </>
            )}
          </div>
        </section>
      )
    }
    default:
      return null
  }
}
