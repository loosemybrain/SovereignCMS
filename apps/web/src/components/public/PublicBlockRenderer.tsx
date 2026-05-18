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

function trim(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function PubSection({
  children,
  variant = "white",
  spacing = "default",
}: {
  children: ReactNode
  variant?: "white" | "subtle"
  spacing?: "default" | "compact"
}) {
  return (
    <section
      className={`pub-section${variant === "subtle" ? " pub-section--subtle" : " pub-section--white"}`}
    >
      <div
        className={`pub-container${spacing === "compact" ? " pub-section-py-sm" : " pub-section-py"}`}
      >
        {children}
      </div>
    </section>
  )
}

function PubFallback({ message }: { message: string }) {
  return (
    <div className="pub-fallback" role="status">
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
      const headline = trim(block.props.headline)
      const subline = trim(block.props.subline)
      const normalized = normalizeMediaReference({
        imageUrl: block.props.mediaUrl,
        imageAlt: block.props.mediaAlt,
        assetId: block.props.mediaAssetId,
        label: headline,
      })
      const hasRenderableMedia = normalized.isRenderable && Boolean(normalized.safeUrl)
      const mediaAlt = normalized.alt || headline || "Hero image"

      if (normalized.sourceType === "invalid" && !headline && !subline) {
        return (
          <PubSection spacing="compact">
            <div className="pub-notice pub-notice--danger pub-content-narrow pub-content-center" role="status">
              Hero media could not be displayed safely.
            </div>
          </PubSection>
        )
      }

      if (!headline && !subline && !hasRenderableMedia) {
        return null
      }

      return (
        <section
          className={`pub-section pub-hero${hasRenderableMedia ? " pub-hero--media" : " pub-hero--plain"}`}
        >
          {hasRenderableMedia ? (
            <>
              <div className="pub-hero__media" aria-hidden={!headline && !subline}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={normalized.safeUrl} alt={mediaAlt} />
                <div className="pub-hero__overlay" aria-hidden="true" />
              </div>
              <div className="pub-container pub-section-py pub-hero__inner">
                <div className="pub-content-narrow">
                  {headline ? <h1 className="pub-h1 pub-h1--inverse">{headline}</h1> : null}
                  {subline ? <p className="pub-lead pub-lead--inverse">{subline}</p> : null}
                </div>
              </div>
            </>
          ) : (
            <div className="pub-container pub-section-py pub-hero__inner">
              <div className="pub-content-narrow">
                {headline ? <h1 className="pub-h1">{headline}</h1> : null}
                {subline ? <p className="pub-lead">{subline}</p> : null}
              </div>
            </div>
          )}
        </section>
      )
    }

    case "text": {
      const body = trim(block.props.body)
      if (!body) return null

      return (
        <PubSection>
          <div className="pub-prose pub-content-narrow pub-content-center">
            <p>{body}</p>
          </div>
        </PubSection>
      )
    }

    case "contact-form": {
      if (!tenantId || !locale) {
        return (
          <PubSection spacing="compact">
            <div className="pub-notice pub-notice--danger pub-content-narrow pub-content-center" role="alert">
              Contact form is temporarily unavailable.
            </div>
          </PubSection>
        )
      }

      const props = (block.props ?? {}) as ContactFormBlockProps
      const recipientEmail = props.recipientEmail || settingsContactEmail

      return (
        <PubSection spacing="compact">
          <div className="pub-content-narrow pub-content-center">
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
        </PubSection>
      )
    }

    case "external-embed": {
      const props = (block.props ?? {}) as ExternalEmbedBlockProps

      return (
        <PubSection spacing="compact">
          <div className="pub-content-wide pub-content-center">
            <PublicExternalEmbed
              provider={props.provider}
              title={props.title}
              embedUrl={props.embedUrl}
              consentText={props.consentText}
              buttonLabel={props.buttonLabel}
            />
          </div>
        </PubSection>
      )
    }

    case "cta": {
      const props = (block.props ?? {}) as CtaBlockProps
      const eyebrow = trim(props.eyebrow)
      const headline = trim(props.headline)
      const body = trim(props.body)
      const primaryLabel = trim(props.primaryLabel)
      const primaryHref = trim(props.primaryHref)
      const secondaryLabel = trim(props.secondaryLabel)
      const secondaryHref = trim(props.secondaryHref)
      const centered = props.align !== "left"
      const hasPrimary = primaryLabel && isValidHref(primaryHref)
      const hasSecondary = secondaryLabel && isValidHref(secondaryHref)

      if (!eyebrow && !headline && !body && !hasPrimary && !hasSecondary) {
        return null
      }

      return (
        <PubSection variant="subtle">
          <div
            className={`pub-content-narrow pub-content-center${centered ? " pub-stack-header--center" : ""}`}
          >
            {eyebrow ? <p className="pub-eyebrow">{eyebrow}</p> : null}
            {headline ? (
              <h2 className={`pub-h2${eyebrow ? " mt-3" : ""}`}>{headline}</h2>
            ) : null}
            {body ? <p className="pub-lead">{body}</p> : null}

            {hasPrimary || hasSecondary ? (
              <div className={`pub-actions${centered ? " pub-actions--center" : ""}`}>
                {hasPrimary ? (
                  <a href={primaryHref} className="pub-btn-primary pub-interactive pub-focusable">
                    {primaryLabel}
                  </a>
                ) : null}
                {hasSecondary ? (
                  <a href={secondaryHref} className="pub-btn-secondary pub-interactive pub-focusable">
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </PubSection>
      )
    }

    case "feature-grid": {
      const props = (block.props ?? {}) as FeatureGridBlockProps & { itemsJson?: string }
      const headline = trim(props.headline)
      const intro = trim(props.intro)

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
        columns === 2 ? "pub-feature-grid--2" : columns === 4 ? "pub-feature-grid--4" : "pub-feature-grid--3"

      const parsedItems = items
        .map((item) => {
          if (typeof item !== "object" || !item) return null
          const record = item as Record<string, unknown>
          const title = trim(record.title)
          const body = trim(record.body)
          const id = trim(record.id) || title
          if (!title && !body) return null
          return { id, title, body }
        })
        .filter((item): item is { id: string; title: string; body: string } => item !== null)

      if (!headline && !intro && parsedItems.length === 0) {
        return null
      }

      return (
        <PubSection>
          {(headline || intro) && (
            <div className="pub-stack-header">
              {headline ? <h2 className="pub-h2">{headline}</h2> : null}
              {intro ? <p className="pub-lead">{intro}</p> : null}
            </div>
          )}

          {parsedItems.length > 0 ? (
            <div className={`pub-feature-grid ${gridClass}`}>
              {parsedItems.map((item) => (
                <article key={item.id} className="pub-card">
                  <div className="pub-card__body">
                    {item.title ? <h3 className="pub-h3">{item.title}</h3> : null}
                    {item.body ? <p className={`pub-body pub-body--sm${item.title ? " mt-2" : ""}`}>{item.body}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <PubFallback message="Features will appear here when items are added." />
          )}
        </PubSection>
      )
    }

    case "image-text": {
      const props = (block.props ?? {}) as ImageTextBlockProps & { mediaAssetId?: string | null }
      const headline = trim(props.headline)
      const body = trim(props.body)
      const imagePosition = props.imagePosition === "left" ? "left" : "right"
      const ctaLabel = trim(props.ctaLabel)
      const ctaHref = trim(props.ctaHref)

      const normalized = normalizeMediaReference({
        imageUrl: props.imageUrl,
        imageAlt: props.imageAlt,
        assetId: props.mediaAssetId,
        label: headline,
      })
      const imageAltDisplay = normalized.alt || headline || "Image"

      const content = (
        <div>
          {headline ? <h2 className="pub-h2">{headline}</h2> : null}
          {body ? <p className="pub-lead">{body}</p> : null}
          {ctaLabel && isValidHref(ctaHref) ? (
            <div className="pub-actions">
              <a href={ctaHref} className="pub-btn-primary pub-interactive pub-focusable">
                {ctaLabel}
              </a>
            </div>
          ) : null}
        </div>
      )

      let media: ReactNode
      if (normalized.isRenderable && normalized.safeUrl) {
        media = (
          <div className="pub-media-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={normalized.safeUrl} alt={imageAltDisplay} />
          </div>
        )
      } else if (normalized.sourceType === "invalid") {
        media = <PubFallback message="Image could not be displayed safely." />
      } else if (headline || body) {
        media = <PubFallback message="Image will appear here when media is configured." />
      } else {
        media = null
      }

      if (!headline && !body && !media) {
        return null
      }

      return (
        <PubSection>
          <div className="pub-split">
            {imagePosition === "left" ? (
              <>
                {media}
                {content}
              </>
            ) : (
              <>
                {content}
                {media}
              </>
            )}
          </div>
        </PubSection>
      )
    }

    default:
      return null
  }
}
