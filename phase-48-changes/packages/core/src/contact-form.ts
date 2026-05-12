export type ContactFormFieldName =
  | "name"
  | "email"
  | "phone"
  | "message"

export type ContactFormSubmissionInput = {
  tenantId: string
  locale: string
  pageId?: string
  blockId?: string
  recipientEmail?: string
  name: string
  email: string
  phone?: string
  message: string
  consentAccepted: boolean
  honeypot?: string
}

export type ContactFormSubmissionResult = {
  success: boolean
  sent: boolean
  persisted: boolean
  submittedAt: string
  message: string
}

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateContactFormSubmission(
  input: ContactFormSubmissionInput
): string[] {
  const errors: string[] = []

  if (input.honeypot && input.honeypot.trim().length > 0) {
    errors.push("Spam protection triggered")
  }

  if (!input.name.trim()) {
    errors.push("Name is required")
  }

  if (!validateEmail(input.email)) {
    errors.push("Valid email is required")
  }

  if (!input.message.trim()) {
    errors.push("Message is required")
  }

  if (!input.consentAccepted) {
    errors.push("Consent is required")
  }

  return errors
}
