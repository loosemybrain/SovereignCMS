"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import type { ContactFormBlockProps } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"

type Props = {
  block: CmsBlock
}

export function ContactFormAdminRenderer({ block }: Props) {
  const props = (block.props ?? {}) as ContactFormBlockProps

  const headline = props.headline || "Contact us"
  const intro = props.intro || "Get in touch"
  const submitLabel = props.submitLabel || "Send message"
  const consentLabel = props.consentLabel || "I consent to processing my information"
  const recipientEmail = props.recipientEmail || "(will use tenant settings)"

  return (
    <div className={bp.surface}>
      <div className={bp.stack}>
        <div>
          <h3 className={bp.title}>{headline}</h3>
          {intro ? <p className={`mt-1 ${bp.body}`}>{intro}</p> : null}
        </div>

        <div className={bp.stack}>
          <div>
            <label className={bp.label}>Name *</label>
            <input type="text" placeholder="Your name" disabled className={bp.field} />
          </div>
          <div>
            <label className={bp.label}>Email *</label>
            <input type="email" placeholder="your@email.com" disabled className={bp.field} />
          </div>
          <div>
            <label className={bp.label}>Phone</label>
            <input type="tel" placeholder="Your phone (optional)" disabled className={bp.field} />
          </div>
          <div>
            <label className={bp.label}>Message *</label>
            <textarea placeholder="Your message" disabled rows={4} className={bp.field} />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="consent" disabled className="mt-1 h-4 w-4 rounded border admin-border" />
            <label htmlFor="consent" className={bp.body}>
              {consentLabel} *
            </label>
          </div>
          <button type="button" disabled className={bp.buttonDisabled}>
            {submitLabel}
          </button>
        </div>

        <div className={bp.divider}>
          <p className={bp.meta}>
            <span className="font-medium">Recipient Email:</span> {recipientEmail}
          </p>
        </div>
      </div>
    </div>
  )
}
