import type { ReactNode } from "react"
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

function MediaFallback({ message }: { message: string }) {
  return (
    <div className="pub-fallback-media" aria-hidden="true">
      {message}
    </div>
  )
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

      const normalized = normalizeMediaReference({
        imageUrl: block.props.mediaUrl,
        imageAlt: block.props.mediaAlt,
        assetId: block.props.mediaAssetId,
        label: headline,
      })
      const mediaAlt = normalized.alt || headline || "Hero image"

      let mediaNode: ReactNode = null
      if (normalized.isRenderable && normalized.safeUrl) {
        mediaNode = (
          <div className="pub-block-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={normalized.safeUrl} alt={mediaAlt} />
          </div>
        )
      } else if (normalized.sourceType === "invalid") {
        mediaNode = (
          <div className="pub-block-inner">
            <div className="pub-notice pub-notice--danger" role="status">
              Media could not be displayed safely.
            </div>
          </div>
        )
      } else if (normalized.sourceType === "placeholder" || normalized.sourceType === "missing") {
        if (headline || subline) {
          mediaNode = null
        } else {
          mediaNode = <MediaFallback message="Hero media will appear here when configured." />
        }
      }

      if (!headline && !subline && !mediaNode) {
        return null
      }

      return (
        <section className="pub-block">
          {mediaNode}
          {(headline || subline) && (
            <div className="pub-block-inner">
              {headline ? <h1 className="pub-heading-hero">{headline}</h1> : null}
              {subline ? <p className="pub-body">{subline}</p> : null}
            </div>
          )}
        </section>
      )
    }
    case "text": {
      const body = String(block.props.body ?? "").trim()
      if (!body) return null
      return <p className="pub-text-block">{body}</p>
    }
    case "contact-form": {
      if (!tenantId || !locale) {
        return (
          <div className="pub-notice pub-notice--danger" role="alert">
            Contact form is temporarily unavailable.
          </div>
        )
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
      const eyebrow = String(props.eyebrow ?? "").trim()
      const headline = String(props.headline ?? "").trim()
      const body = String(props.body ?? "").trim()
      const primaryLabel = String(props.primaryLabel ?? "").trim()
      const primaryHref = String(props.primaryHref ?? "")
      const secondaryLabel = String(props.secondaryLabel ?? "").trim()
      const secondaryHref = String(props.secondaryHref ?? "")
      const align = props.align === "left" ? "left" : "center"
      const centered = align === "center"

      if (!eyebrow && !headline && !body && !primaryLabel && !secondaryLabel) {
        return null
      }

      return (
        <section
          className={`pub-block pub-block-inner--spacious${centered ? " pub-align-center" : ""}`}
        >
          {eyebrow ? <p className="pub-eyebrow">{eyebrow}</p> : null}
          {headline ? (
            <h2 className={`pub-heading-section${eyebrow ? " mt-2" : ""}`}>{headline}</h2>
          ) : null}
          {body ? <p className="pub-body pub-body--lead">{body}</p> : null}

          {(primaryLabel || secondaryLabel) && (
            <div className={`pub-actions${centered ? " pub-actions--center" : ""}`}>
              {primaryLabel && isValidHref(primaryHref) ? (
                <a href={primaryHref} className="pub-btn pub-btn--primary pub-interactive">
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel && isValidHref(secondaryHref) ? (
                <a href={secondaryHref} className="pub-btn pub-btn--secondary pub-interactive">
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          )}
        </section>
      )
    }
    case "feature-grid": {
      const props = (block.props ?? {}) as FeatureGridBlockProps & { itemsJson?: string }
      const headline = String(props.headline ?? "").trim()
      const intro = String(props.intro ?? "").trim()

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
      const gridClass =
        columns === 2
          ? "pub-grid-features--2"
          : columns === 4
            ? "pub-grid-features--4"
            : "pub-grid-features--3"

      if (!headline && !intro && items.length === 0) {
        return null
      }

      return (
        <section className="pub-block pub-block-inner--spacious">
          {headline ? <h2 className="pub-heading-section">{headline}</h2> : null}
          {intro ? <p className="pub-body">{intro}</p> : null}

          {items.length > 0 ? (
            <div className={`pub-grid-features ${gridClass}`}>
              {items.map((item: unknown) => {
                const itemRecord = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
                const itemId = String(itemRecord.id ?? "")
                const itemTitle = String(itemRecord.title ?? "").trim()
                const itemBody = String(itemRecord.body ?? "").trim()

                if (!itemTitle && !itemBody) return null

                return (
                  <article key={itemId || itemTitle} className="pub-card">
                    {itemTitle ? <h3 className="pub-heading-card">{itemTitle}</h3> : null}
                    {itemBody ? <p className="pub-body">{itemBody}</p> : null}
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="pub-notice pub-notice--muted pub-notice--spaced" role="status">
              Features will appear here when items are added.
            </p>
          )}
        </section>
      )
    }
    case "image-text": {
      const props = (block.props ?? {}) as ImageTextBlockProps & { mediaAssetId?: string | null }
      const headline = String(props.headline ?? "").trim()
      const body = String(props.body ?? "").trim()
      const imagePosition = props.imagePosition === "left" ? "left" : "right"
      const ctaLabel = String(props.ctaLabel ?? "").trim()
      const ctaHref = String(props.ctaHref ?? "")

      const normalized = normalizeMediaReference({
        imageUrl: props.imageUrl,
        imageAlt: props.imageAlt,
        assetId: props.mediaAssetId,
        label: headline,
      })
      const imageAltDisplay = normalized.alt || headline || "Image"

      const contentElement = (
        <div>
          {headline ? <h2 className="pub-heading-section">{headline}</h2> : null}
          {body ? <p className="pub-body">{body}</p> : null}
          {ctaLabel && isValidHref(ctaHref) ? (
            <div className="pub-actions">
              <a href={ctaHref} className="pub-btn pub-btn--primary pub-interactive">
                {ctaLabel}
              </a>
            </div>
          ) : null}
        </div>
      )

      let imageElement: ReactNode = null
      if (normalized.isRenderable && normalized.safeUrl) {
        imageElement = (
          <div className="pub-block-media pub-block-media--portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={normalized.safeUrl} alt={imageAltDisplay} className="rounded-lg" />
          </div>
        )
      } else if (normalized.sourceType === "invalid") {
        imageElement = (
          <div className="pub-notice pub-notice--danger" role="status">
            Image could not be displayed safely.
          </div>
        )
      } else if (headline || body) {
        imageElement = <MediaFallback message="Image will appear here when media is configured." />
      }

      if (!headline && !body && !imageElement) {
        return null
      }

      return (
        <section className="pub-block pub-block-inner--spacious">
          <div className="pub-grid-2">
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

