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
      const hasImage = Boolean(mediaUrl)

      return (
        <section
          className={`pub-section relative overflow-hidden${hasImage ? " bg-gray-900" : " bg-white"}`}
          style={hasImage ? { minHeight: "420px" } : undefined}
        >
          {hasImage ? (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl}
                alt={mediaAlt}
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay for text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,20,0.82) 0%, rgba(10,10,20,0.35) 55%, rgba(10,10,20,0.10) 100%)",
                }}
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div
            className={`pub-container pub-section-py relative z-10${hasImage ? " flex flex-col justify-end" : ""}`}
          >
            <div className="max-w-2xl">
              <h1
                className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl${hasImage ? " text-white" : " text-gray-900"}`}
                style={{ lineHeight: "1.1" }}
              >
                {headline}
              </h1>
              {subline ? (
                <p
                  className={`mt-5 text-xl leading-relaxed${hasImage ? " text-gray-200" : " text-gray-600"}`}
                >
                  {subline}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      )
    }

    case "text": {
      const body = String(block.props.body ?? "")
      return (
        <section className="pub-section bg-white">
          <div className="pub-container pub-section-py">
            <div className="pub-prose mx-auto">
              <p className="text-gray-700">{body}</p>
            </div>
          </div>
        </section>
      )
    }

    case "contact-form": {
      if (!tenantId || !locale) {
        return (
          <section className="pub-section bg-white">
            <div className="pub-container pub-section-py-sm">
              <p className="text-sm text-red-600">Contact form requires tenantId and locale.</p>
            </div>
          </section>
        )
      }

      const props = (block.props ?? {}) as ContactFormBlockProps
      const recipientEmail = props.recipientEmail || settingsContactEmail

      return (
        <section className="pub-section bg-white">
          <div className="pub-container pub-section-py-sm">
            <div className="mx-auto max-w-2xl">
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
            </div>
          </div>
        </section>
      )
    }

    case "external-embed": {
      const props = (block.props ?? {}) as ExternalEmbedBlockProps

      return (
        <section className="pub-section bg-white">
          <div className="pub-container pub-section-py-sm">
            <div className="mx-auto" style={{ maxWidth: "var(--pub-wide-max)" }}>
              <PublicExternalEmbed
                provider={props.provider}
                title={props.title}
                embedUrl={props.embedUrl}
                consentText={props.consentText}
                buttonLabel={props.buttonLabel}
              />
            </div>
          </div>
        </section>
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
      const isCentered = align === "center"

      return (
        <section className="pub-section" style={{ background: "var(--pub-surface-bg-subtle)" }}>
          <div className="pub-container pub-section-py">
            <div
              className={`mx-auto max-w-2xl${isCentered ? " text-center" : ""}`}
            >
              {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                  {eyebrow}
                </p>
              ) : null}
              {headline ? (
                <h2
                  className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  style={{ lineHeight: "1.15" }}
                >
                  {headline}
                </h2>
              ) : null}
              {body ? (
                <p className="mt-5 text-lg leading-relaxed text-gray-600">{body}</p>
              ) : null}

              {(primaryLabel || secondaryLabel) ? (
                <div
                  className={`mt-8 flex flex-wrap gap-3 sm:gap-4${isCentered ? " justify-center" : ""}`}
                >
                  {primaryLabel && isValidHref(primaryHref) ? (
                    <a
                      href={primaryHref}
                      className="pub-btn-primary pub-interactive"
                    >
                      {primaryLabel}
                    </a>
                  ) : null}
                  {secondaryLabel && isValidHref(secondaryHref) ? (
                    <a
                      href={secondaryHref}
                      className="pub-btn-secondary pub-interactive"
                    >
                      {secondaryLabel}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )
    }

    case "feature-grid": {
      const props = (block.props ?? {}) as FeatureGridBlockProps & { itemsJson?: string }
      const headline = String(props.headline ?? "")
      const intro = String(props.intro ?? "")

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

      const columnsRaw = props.columns ?? "3"
      const columnsNum = typeof columnsRaw === "string" ? parseInt(columnsRaw, 10) : columnsRaw
      const columns = isNaN(columnsNum) ? 3 : columnsNum

      const gridColsClass =
        { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[
          columns as 2 | 3 | 4
        ] ?? "sm:grid-cols-2 lg:grid-cols-3"

      return (
        <section className="pub-section bg-white">
          <div className="pub-container pub-section-py">
            {(headline || intro) ? (
              <div className="mb-10 max-w-2xl">
                {headline ? (
                  <h2
                    className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                    style={{ lineHeight: "1.15" }}
                  >
                    {headline}
                  </h2>
                ) : null}
                {intro ? (
                  <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
                ) : null}
              </div>
            ) : null}

            {items.length > 0 ? (
              <div className={`grid grid-cols-1 gap-5 ${gridColsClass}`}>
                {items.map((item: unknown) => {
                  const itemRecord =
                    item && typeof item === "object" ? (item as Record<string, unknown>) : {}
                  const itemId = String(itemRecord.id ?? "")
                  const itemTitle = String(itemRecord.title ?? "")
                  const itemBody = String(itemRecord.body ?? "")

                  return (
                    <div key={itemId || itemTitle} className="pub-card p-6">
                      {itemTitle ? (
                        <h3 className="text-base font-semibold text-gray-900">{itemTitle}</h3>
                      ) : null}
                      {itemBody ? (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{itemBody}</p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
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
          {headline ? (
            <h2
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              style={{ lineHeight: "1.15" }}
            >
              {headline}
            </h2>
          ) : null}
          {body ? (
            <p className="mt-5 text-lg leading-relaxed text-gray-600">{body}</p>
          ) : null}
          {ctaLabel && isValidHref(ctaHref) ? (
            <div className="mt-8">
              <a href={ctaHref} className="pub-btn-primary pub-interactive">
                {ctaLabel}
              </a>
            </div>
          ) : null}
        </div>
      )

      const imageElement =
        normalized.isRenderable && normalized.safeUrl ? (
          <div
            className="overflow-hidden rounded-xl"
            style={{ aspectRatio: "4/3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalized.safeUrl}
              alt={imageAltDisplay}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          /* Graceful fallback when no image is available */
          <div
            className="flex items-center justify-center overflow-hidden rounded-xl"
            style={{
              aspectRatio: "4/3",
              background: "var(--pub-surface-bg-muted)",
            }}
            aria-hidden="true"
          >
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 21h18M3.75 3h16.5M12 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </div>
        )

      return (
        <section className="pub-section bg-white">
          <div className="pub-container pub-section-py">
            <div
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
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
          </div>
        </section>
      )
    }

    default:
      return null
  }
}
