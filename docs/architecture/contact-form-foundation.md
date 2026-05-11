# Contact Form Foundation (Phase 48)

## Overview

Phase 48 introduces a **Contact Form Block** that enables secure form submissions on public pages.

The contact form is:
- **Tenant-aware**: Isolated per tenant
- **Locale-aware**: Supports multiple languages
- **Settings-aware**: Falls back to tenant contact email
- **Validated**: Client-side and server-side validation
- **Protected**: Honeypot spam protection
- **Privacy-compliant**: Consent checkbox requirement
- **Mock-mode**: No actual mail delivery (Phase 49+)

## Architecture

### Core Contact Form Types

**Location**: `packages/core/src/contact-form.ts`

```typescript
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
  sent: boolean        // false in Phase 48
  persisted: boolean   // false in Phase 48
  submittedAt: string
  message: string
}
```

**Validation Functions**:
- `validateEmail(value: string): boolean` — RFC-like email validation
- `validateContactFormSubmission(input): string[]` — Returns array of error messages

**Validation Rules**:
- Honeypot must be empty (spam protection)
- Name required, non-empty
- Email required, valid format
- Message required, non-empty
- Consent must be accepted

### Contact Form Block Props

**Location**: `packages/core/src/blocks.ts`

```typescript
export type ContactFormBlockProps = {
  headline?: string           // Form title
  intro?: string              // Intro text
  submitLabel?: string        // Submit button text
  successMessage?: string     // Success message
  consentLabel?: string       // Consent checkbox text
  recipientEmail?: string     // Optional override
}
```

**Default Props** (from block definition):
- `headline`: "Get in Touch"
- `intro`: "Send us a message."
- `submitLabel`: "Send Message"
- `successMessage`: "Thank you for your message. We'll get back to you soon."
- `consentLabel`: "I consent to processing my information to handle my inquiry."
- `recipientEmail`: "" (empty = use tenant settings)

### Admin Contact Form Renderer

**Location**: `apps/admin/src/components/block-renderers/contact-form-renderer.tsx`

**Features**:
- Form preview with disabled fields
- Shows all form inputs (name, email, phone, message, consent)
- Displays recipient email resolution (custom or settings fallback)
- Non-interactive (for demonstration only)

**Props**:
- `block: CmsBlock` — The block instance

### Block Definition & Registry

**Location**: `apps/admin/src/block-definitions/registry.ts`

**Definition**:
```typescript
"contact-form": {
  type: "contact-form"
  label: "Contact Form"
  category: "Forms"
  fieldGroups: [
    { id: "content", label: "Content" },
    { id: "behavior", label: "Behavior" },
    { id: "privacy", label: "Privacy & Consent" }
  ]
  inspectorFields: [
    headline, intro, submitLabel, successMessage,
    consentLabel, recipientEmail
  ]
  adminRenderer: ContactFormAdminRenderer
}
```

**Inspector Fields**:
- **Content**: headline, intro text
- **Behavior**: submit button label, success message, recipient email
- **Privacy**: consent checkbox text (required)

### Public Contact Form Component

**Location**: `apps/web/src/components/public-contact-form.tsx`

**Type**: Client Component (handles interactivity)

**Props**:
```typescript
type Props = {
  tenantId: string
  locale: string
  pageId?: string
  blockId?: string
  recipientEmail?: string
  headline?: string
  intro?: string
  submitLabel?: string
  successMessage?: string
  consentLabel?: string
}
```

**State Management**:
- Form fields: name, email, phone, message
- Consent flag
- Honeypot field (hidden)
- Submission state: isSubmitting, errors, showSuccess

**Features**:
- Accessible form with proper labels and ARIA attributes
- Client-side validation feedback
- Error display (role="alert")
- Success message (aria-live="polite")
- Honeypot field (visually hidden, prevents spam)
- Disabled submit during submission
- Auto-clear form on success

**Honeypot Protection**:
```typescript
<div className="absolute -left-96 -top-96">
  <input
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden="true"
  />
</div>
```

Spam bots see this field and fill it. If honeypot is not empty during validation, submission is rejected.

### Contact Form Server Action

**Location**: `apps/web/src/actions/submit-contact-form.ts`

```typescript
export async function submitContactFormAction(
  input: ContactFormSubmissionInput
): Promise<ContactFormSubmissionResult>
```

**Flow**:
1. Validate submission using `validateContactFormSubmission()`
2. If errors: return failure with error messages
3. If valid:
   - Log submission in development mode
   - Return mock success (sent=false, persisted=false)
   - No mail delivery
   - No database persistence

**Response**:
```typescript
{
  success: true,
  sent: false,
  persisted: false,
  submittedAt: "2026-05-11T14:30:00Z",
  message: "Submission accepted in mock mode. Mail delivery is not yet configured."
}
```

### Public Block Renderer Integration

**Location**: `apps/web/src/components/public/PublicBlockRenderer.tsx`

**Extended Props**:
```typescript
type Props = {
  block: BlockInstance
  tenantId?: string
  locale?: string
  pageId?: string
  settingsContactEmail?: string
}
```

**Contact Form Rendering**:
```typescript
case "contact-form": {
  const props = block.props as ContactFormBlockProps
  const recipientEmail = props.recipientEmail || settingsContactEmail
  
  return (
    <PublicContactForm
      tenantId={tenantId}
      locale={locale}
      pageId={pageId}
      blockId={block.id}
      recipientEmail={recipientEmail}
      {...props}
    />
  )
}
```

**Recipient Resolution**:
1. If block has `recipientEmail` configured → use it
2. Else if settings has contact email → use tenant settings
3. Else → form shows no recipient (still submittable in mock mode)

### Public Page View Integration

**Location**: `apps/web/src/components/public/PublicPageView.tsx`

**BlockRenderer Props**:
```typescript
<PublicBlockRenderer
  block={block}
  tenantId={tenant.id}
  locale={page.locale}
  pageId={page.id}
  settingsContactEmail={header?.contactEmail}
/>
```

**Contact Settings Assumption**:
- `header.contactEmail` comes from tenant settings or header configuration
- Falls back to empty string if not available

## Data Flow: Contact Form Submission

```
User fills contact form
  ↓
User clicks Submit
  ↓
PublicContactForm validates locally:
  - Name, Email, Message required
  - Email format valid
  - Consent checked
  - Honeypot empty
  ↓
If invalid → Show errors
If valid → Call submitContactFormAction()
  ↓
Server validates again (defense in depth)
  ↓
If invalid → Return error messages
If valid → Return mock success
  ↓
PublicContactForm shows success message:
  "Thank you! Mail delivery not yet configured."
  ↓
Form fields cleared
  ↓
Success message auto-hides after 5 seconds
```

## Consent & Privacy

**Consent Checkbox**:
- Required field (must be checked to submit)
- Text customizable per form
- Default text is neutral, not GDPR-specific

**Data Handling in Phase 48**:
- ✅ Collected (validated)
- ❌ Not persisted
- ❌ Not transmitted
- ❌ Not logged (except dev console)

**No Privacy Violations**:
- User data is never stored
- No email sent
- No third-party services
- No cookies or tracking

## Type Safety

- All props are typed (`ContactFormBlockProps`)
- Submission input is typed (`ContactFormSubmissionInput`)
- Server action returns typed result (`ContactFormSubmissionResult`)
- No `Record<string, unknown>` generics for form data
- Errors are strongly typed (string array)

## Known Limitations (Intentional)

- ❌ No mail delivery (Phase 49)
- ❌ No persistence (Phase 49)
- ❌ No SMTP integration
- ❌ No Resend integration
- ❌ No submission archive
- ❌ No admin inbox
- ❌ No email notifications
- ❌ No Captcha/reCAPTCHA
- ❌ No rate limiting
- ❌ No spam scoring
- ❌ No file uploads
- ❌ No email templates

All Phase 49+ features.

## Testing Scenarios

1. **Valid submission**: All fields filled, consent checked → success message
2. **Missing name**: Name empty → error shown
3. **Invalid email**: Bad email format → error shown
4. **Missing message**: Message empty → error shown
5. **Consent unchecked**: Consent not checked → error shown
6. **Honeypot filled**: Honeypot not empty → spam error
7. **Success message**: Disappears after 5 seconds
8. **Recipient email**: 
   - If set on block → uses block email
   - If empty → falls back to tenant settings
9. **Locale awareness**: Form respects page locale (for labels)
10. **Tenant isolation**: Submissions include tenantId

## Admin Workflow

1. Admin opens page editor
2. Clicks "Add Block" → selects "Contact Form"
3. Form appears with default values
4. Admin customizes (headline, labels, email, etc.)
5. Inspector shows all fields
6. Admin can preview form in editor
7. Saves page
8. Public page renders contact form

## Public Workflow

1. User sees contact form on page
2. User fills fields
3. User checks consent checkbox
4. User clicks submit
5. Form validates
6. Server validates again
7. Success message shown
8. Form clears
9. No email arrives (demo mode)
10. No confirmation email

## Future Integration (Phase 49+)

### Mail Delivery

```typescript
if (result.success) {
  // Send email to recipient
  await emailService.send({
    to: input.recipientEmail,
    subject: "New contact form submission",
    html: renderContactFormEmail(input),
  })
  
  // Send confirmation to user
  await emailService.send({
    to: input.email,
    subject: "We received your message",
    html: renderConfirmationEmail(),
  })
}
```

### Persistence

```typescript
// Store submission in database
await submissions.create({
  tenantId: input.tenantId,
  pageId: input.pageId,
  name: input.name,
  email: input.email,
  phone: input.phone,
  message: input.message,
  submittedAt: new Date(),
  status: "received",
})
```

### Admin Inbox

```typescript
// Display submissions in admin
GET /admin/submissions?tenantId=X
  ↓
List all submissions
  ↓
Mark as read/replied
  ↓
Reply with templated responses
```

### Spam Protection

```typescript
// Add Captcha/reCAPTCHA
if (!isValidCaptcha(input.captchaToken)) {
  return { success: false, message: "Captcha invalid" }
}
```

## File Summary

| File | Purpose |
|------|---------|
| `packages/core/src/contact-form.ts` | Contact form types, validators |
| `packages/core/src/blocks.ts` | ContactFormBlockProps type |
| `packages/core/src/index.ts` | Export contact form types |
| `apps/admin/src/block-definitions/registry.ts` | Block definition, inspector fields |
| `apps/admin/src/components/block-renderers/contact-form-renderer.tsx` | Admin preview |
| `apps/web/src/components/public-contact-form.tsx` | Public form UI (client) |
| `apps/web/src/actions/submit-contact-form.ts` | Form submission (server) |
| `apps/web/src/components/public/PublicBlockRenderer.tsx` | Block type integration |
| `apps/web/src/components/public/PublicPageView.tsx` | Props threading |

## Summary

Phase 48 establishes:

- ✅ Contact form as CMS block
- ✅ Tenant-aware submission
- ✅ Locale-aware rendering
- ✅ Settings-aware recipient resolution
- ✅ Honeypot spam protection
- ✅ Consent checkbox enforcement
- ✅ Server-side validation
- ✅ Client-side validation
- ✅ Mock-mode submission (sent=false, persisted=false)
- ✅ Admin block definition
- ✅ Inspector integration
- ✅ Admin preview renderer
- ✅ Public form component
- ✅ Server action boundary

**No mail delivery, no persistence, no external services.**

**Ready for Phase 49**: Mail delivery, persistence, admin inbox, notifications.
