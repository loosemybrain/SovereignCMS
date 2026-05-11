import type { BlockInstance, ContactFormBlockProps, ExternalEmbedBlockProps } from "@sovereign-cms/core"
import { PublicContactForm } from "@/components/public-contact-form"
import { PublicExternalEmbed } from "@/components/public-external-embed"

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
    default:
      return null
  }
}
