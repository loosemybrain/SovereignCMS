import { EditorHint } from "./editor-hint"

type EditorValidationSummaryProps = {
  errors: Array<{
    fieldLabel: string
    fieldId?: string
    messages: string[]
  }>
}

export function EditorValidationSummary({ errors }: EditorValidationSummaryProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div role="alert" aria-live="polite" className="space-y-2">
      <EditorHint tone="warning">Please review the highlighted fields.</EditorHint>
      <ul className="list-disc pl-5 text-xs admin-warning space-y-1">
        {errors.map((error) => (
          <li key={`${error.fieldLabel}-${error.fieldId ?? "no-id"}`}>
            {error.fieldId ? (
              <a href={`#${error.fieldId}`} className="font-semibold underline admin-focus-ring">
                {error.fieldLabel}
              </a>
            ) : (
              <span className="font-semibold">{error.fieldLabel}</span>
            )}
            : {error.messages.join(" ")}
          </li>
        ))}
      </ul>
    </div>
  )
}
