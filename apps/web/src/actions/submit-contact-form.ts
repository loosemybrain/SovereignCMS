"use server"

import type {
  ContactFormSubmissionInput,
  ContactFormSubmissionResult,
} from "@sovereign-cms/core"
import { validateContactFormSubmission } from "@sovereign-cms/core"

export async function submitContactFormAction(
  input: ContactFormSubmissionInput
): Promise<ContactFormSubmissionResult> {
  // Validate submission
  const errors = validateContactFormSubmission(input)

  if (errors.length > 0) {
    return {
      success: false,
      sent: false,
      persisted: false,
      submittedAt: new Date().toISOString(),
      message: errors.join(", "),
    }
  }

  // Log submission (in development)
  if (process.env.NODE_ENV === "development") {
    console.info("[sovereign:web] Contact form submission", {
      tenantId: input.tenantId,
      locale: input.locale,
      name: input.name,
      email: input.email,
      phone: input.phone || "(not provided)",
      recipientEmail: input.recipientEmail || "(will use tenant settings)",
      submittedAt: new Date().toISOString(),
    })
  }

  // Return mock success (no mail delivery, no persistence)
  return {
    success: true,
    sent: false,
    persisted: false,
    submittedAt: new Date().toISOString(),
    message:
      "Submission accepted in mock mode. Mail delivery is not yet configured.",
  }
}
