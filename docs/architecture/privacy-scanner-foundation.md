# Privacy Scanner Foundation (Phase 50)

## Overview

Phase 50 introduces a **Privacy Scanner Foundation** that enables controlled, manual analysis of privacy concerns without performing real browser scans.

The scanner is:
- **Mock-based**: No real browser scans (Puppeteer/Playwright)
- **Manual review**: Admin-driven assessment, not automatic
- **Job-based**: Scans tracked as persistent queue
- **Finding-typed**: Categorized observations (cookies, scripts, iframes, etc.)
- **Approval-staged**: Draft → Reviewed → Approved/Rejected workflow
- **No compliance claims**: Does not guarantee legal compliance

## Architecture

### Privacy Scan Types

**Location**: `packages/core/src/privacy-scan.ts`

```typescript
export type PrivacyScanStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"

export type PrivacyScanApprovalStatus =
  | "draft"
  | "reviewed"
  | "approved"
  | "rejected"

export type PrivacyScanFindingType =
  | "cookie"
  | "local-storage"
  | "session-storage"
  | "external-request"
  | "script"
  | "iframe"
  | "other"

export type PrivacyScanFinding = {
  id: string
  type: PrivacyScanFindingType
  name: string
  provider?: string
  category?: "necessary" | "external-media" | "analytics" | "marketing" | "unknown"
  sourceUrl?: string
  description?: string
  detectedBeforeConsent?: boolean
  createdAt: string
}

export type PrivacyScanJob = {
  id: string
  tenantId: string
  locale?: string
  targetUrl: string
  status: PrivacyScanStatus
  approvalStatus: PrivacyScanApprovalStatus
  findings: PrivacyScanFinding[]
  errorMessage?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}
```

### Validation Functions

**Location**: `packages/core/src/privacy-scan.ts`

```typescript
export function isPrivacyScanApprovalStatus(
  value: unknown
): value is PrivacyScanApprovalStatus

export function validatePrivacyScanTargetUrl(value: string): boolean
```

**URL Validation**:
- HTTP or HTTPS protocol required
- Valid URL format required

### Database Repository

**Location**: `packages/db/src/contracts.ts`

```typescript
export interface PrivacyScanRepository {
  listByTenant(input: { tenantId: string }): Promise<PrivacyScanJob[]>
  create(input: CreatePrivacyScanInput): Promise<PrivacyScanJob>
  updateApproval(input: UpdatePrivacyScanApprovalInput): Promise<PrivacyScanJob>
}
```

**In-Memory Implementation**:
- Location: `packages/db/src/in-memory-adapter.ts`
- Demo scan included for "demo" tenant
- Mock job status: "queued", findings pre-populated

### Runtime Persistence

**Location**: `packages/runtime/src/privacy-scanner-persistence.ts`

```typescript
export function createPrivacyScannerPersistence(input: { db: DatabaseAdapter })
```

**Methods**:
- `listPrivacyScans(params)`: Get all scans for tenant
- `createPrivacyScan(input)`: Queue new scan (mock mode)
- `updatePrivacyScanApproval(input)`: Update approval status

**Response**:
```typescript
{
  success: true,
  scan: PrivacyScanJob,
  persisted: false  // Mock mode indicator
}
```

### Server Actions

**Location**: `apps/admin/src/actions/`

1. **create-privacy-scan.ts**
   - Validates tenantId, targetUrl
   - Calls runtime.privacyScannerPersistence.createPrivacyScan()

2. **load-privacy-scans.ts**
   - Fetches all scans for tenant
   - Returns sorted list (newest first)

3. **update-privacy-scan-approval.ts**
   - Validates approvalStatus with isPrivacyScanApprovalStatus()
   - Updates scan approval status

### Client Adapter

**Location**: `apps/admin/src/lib/client-privacy-scanner-persistence.ts`

Delegates to server actions:
- `listPrivacyScans()` → loadPrivacyScansAction
- `createPrivacyScan()` → createPrivacyScanAction
- `updatePrivacyScanApproval()` → updatePrivacyScanApprovalAction

### Privacy Scanner Panel

**Location**: `apps/admin/src/components/privacy-scanner-panel.tsx`

**Type**: Client Component

**Props**:
- `tenantId: string`
- `initialScans: PrivacyScanJob[]`

**Features**:
- Create scan form with URL input
- Scans list (newest first)
- Per-scan approval status selector (draft/reviewed/approved/rejected)
- Findings display with details
- Error and success messages
- Disclaimer: "This is a scanner foundation... Manual review is required... Approval does not guarantee legal compliance."

**No**:
- Auto-refresh
- Real browser integration
- Puppeteer/Playwright
- API calls to external scanners

### Admin Privacy Page

**Location**: `apps/admin/src/app/(admin)/privacy/page.tsx`

**Type**: Server Component

**Flow**:
1. Get tenant from host via tenantResolver
2. Load scans via runtime.privacyScannerPersistence.listPrivacyScans()
3. Render PrivacyScannerPanel with initialScans

**Render**:
- AdminPageHeader with title "Privacy"
- PrivacyScannerPanel component

**No**:
- Runtime object passed to client
- Direct database access
- External service calls

### Admin Shell Integration

**Location**: `apps/admin/src/components/admin-shell.tsx`

Added sidebar navigation item:
```typescript
{ href: "/privacy", label: "Privacy", icon: "🔒" }
```

## Data Flow: Privacy Scan

```
Admin navigates to /privacy
  ↓
Server component loads tenant + scans
  ↓
PrivacyScannerPanel rendered with initialScans
  ↓
Admin enters target URL
  ↓
Admin clicks "Create Scan"
  ↓
createPrivacyScanAction validates URL
  ↓
Server action calls clientPrivacyScannerPersistence.createPrivacyScan()
  ↓
Creates mock PrivacyScanJob:
  - id: nanoid()
  - status: "queued"
  - approvalStatus: "draft"
  - findings: []
  ↓
Scan added to list (prepend)
  ↓
Success message: "Scan was queued in mock mode. No real browser scan is executed yet."
  ↓
Admin selects approval status from dropdown
  ↓
updatePrivacyScanApprovalAction called
  ↓
Server updates scan.approvalStatus
  ↓
Scan list re-rendered
  ↓
Success message displayed
```

## Privacy Scan Workflow

1. **Queue**: Admin creates scan → status="queued" (mock)
2. **Review**: Admin looks at findings (pre-populated in demo)
3. **Assess**: Admin selects approval status:
   - Draft: Not yet reviewed
   - Reviewed: Assessment in progress
   - Approved: Safe for production
   - Rejected: Issues found, blocked
4. **Track**: Scan history maintained, timestamps recorded

## Finding Categories

- `necessary`: Consent not required (first-party, essential)
- `external-media`: External embeds (Google Maps, etc.)
- `analytics`: Analytics services (GA, etc.)
- `marketing`: Marketing/tracking pixels
- `unknown`: Uncategorized findings

## Mock Scan Example

```typescript
{
  id: "scan-demo-1",
  tenantId: "demo",
  targetUrl: "https://example.com",
  status: "completed",
  approvalStatus: "draft",
  findings: [
    {
      id: "finding-1",
      type: "external-request",
      name: "Google Maps Embed",
      provider: "google-maps",
      category: "external-media",
      detectedBeforeConsent: false,
    }
  ]
}
```

## Limitations (Intentional)

- ❌ No real browser scanning
- ❌ No Puppeteer/Playwright integration
- ❌ No Docker worker
- ❌ No automatic compliance evaluation
- ❌ No Cookie Banner sync
- ❌ No Consent Logs
- ❌ No external scanner integration
- ❌ No crawling/discovery
- ❌ No JavaScript execution
- ❌ No automated remediation

All Phase 51+ features.

## Testing Scenarios

1. **Create scan**: Valid URL → creates queued job
2. **Invalid URL**: Non-HTTPS → validation error
3. **Approval workflow**: Change status draft → reviewed → approved
4. **Findings display**: Shows mock findings with details
5. **List refresh**: Scans appear immediately in list
6. **Disclaimer**: Shows "no real browser scans" message

## Admin Workflow

1. Admin navigates to /privacy
2. Sidebar shows "Privacy" as active route
3. Admin sees existing scans (or empty state)
4. Admin enters target URL ("https://example.com")
5. Admin clicks "Create Scan"
6. Scan appears at top of list with status "queued"
7. Admin selects approval status from dropdown
8. Scan updates immediately
9. Scan shows findings (in demo)
10. Admin reviews findings and assesses compliance

## Summary

Phase 50 establishes:

- ✅ Privacy scan types and contracts
- ✅ Database repository with in-memory implementation
- ✅ Runtime persistence with mock mode
- ✅ Server actions for create/list/update
- ✅ Client adapter delegating to server actions
- ✅ Admin privacy page with scanner panel
- ✅ Approval workflow (draft → reviewed → approved/rejected)
- ✅ Finding types and categories
- ✅ Mock scan data (demo tenant)
- ✅ Clear disclaimers (no compliance guarantee)
- ✅ No real browser scanning
- ✅ No external service integration

**No real browser scans, no compliance guarantees, manual review only.**

**Ready for Phase 51**: Real browser scanning, Puppeteer/Playwright integration, automatic compliance evaluation, worker queue.
