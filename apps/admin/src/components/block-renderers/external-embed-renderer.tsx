"use client"

import type { BlockInstance, ExternalEmbedBlockProps } from "@sovereign-cms/core"
import { bp } from "@/components/block-renderers/preview-classes"

type Props = {
  block: BlockInstance
}

export function ExternalEmbedAdminRenderer({ block }: Props) {
  const props = (block.props ?? {}) as ExternalEmbedBlockProps

  return (
    <div className={bp.surface}>
      <div className={bp.stack}>
        <div>
          <h2 className={bp.title}>External Embed Preview</h2>
          <p className={`mt-1 ${bp.body}`}>
            External media is blocked until consent is given on the public page.
          </p>
        </div>

        <p className={bp.noticeWarning}>
          <span className="font-semibold">Provider:</span> {props.provider || "not set"}
        </p>

        <p className={bp.body}>
          <span className="font-semibold">Title:</span> {props.title || "(no title)"}
        </p>

        <div>
          <p className={bp.body}>
            <span className="font-semibold">Embed URL:</span>
          </p>
          <p className={`mt-1 break-all font-mono text-xs ${bp.meta}`}>{props.embedUrl || "(no URL)"}</p>
        </div>

        <p className={bp.body}>
          <span className="font-semibold">Consent Text:</span> {props.consentText || "(default text)"}
        </p>

        <p className={bp.body}>
          <span className="font-semibold">Button Label:</span> {props.buttonLabel || "(default label)"}
        </p>

        <p className={bp.noticeInfo}>
          ℹ️ On the public page, users will see this embed behind a consent gate. The iframe will only load after
          they click to accept external media.
        </p>
      </div>
    </div>
  )
}
