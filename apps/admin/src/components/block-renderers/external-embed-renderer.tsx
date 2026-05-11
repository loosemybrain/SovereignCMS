"use client"

import type { BlockInstance, ExternalEmbedBlockProps } from "@sovereign-cms/core"

type Props = {
  block: BlockInstance
}

export function ExternalEmbedAdminRenderer({ block }: Props) {
  const props = (block.props ?? {}) as ExternalEmbedBlockProps

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">External Embed Preview</h2>
          <p className="mt-2 text-sm text-gray-600">
            External media is blocked until consent is given on the public page.
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Provider:</span> {props.provider || "not set"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Title:</span> {props.title || "(no title)"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Embed URL:</span>
          </p>
          <p className="mt-1 break-all font-mono text-xs text-gray-600">
            {props.embedUrl || "(no URL)"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Consent Text:</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {props.consentText || "(default text)"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Button Label:</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {props.buttonLabel || "(default label)"}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs text-blue-900">
            ℹ️ On the public page, users will see this embed behind a consent gate. The iframe will only load after they click to accept external media.
          </p>
        </div>
      </div>
    </div>
  )
}
