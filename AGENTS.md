# VitaMind Admin Frontend — Agent Instructions

## 1. Mission

You are working on the VitaMind administrative frontend.

The admin frontend is an **operational control center**, not a generic dashboard template.

Its purpose is to help authorized operators:

* monitor the platform
* resolve operational issues
* supervise clinical workflows
* manage clinicians
* manage assignments
* monitor Mira
* manage subscriptions/payments
* manage system configuration
* inspect audit logs

The UI must never turn platform administrators into clinicians.

---

# 2. Application Boundary

The admin application should live separately from the public marketing application.

Preferred structure:

```text
apps/
  admin/
```

The admin application should be independently deployable.

Prefer a dedicated admin subdomain.

Do not turn the marketing website into the back-office.

---

# 3. Stack

Preferred:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Radix primitives through shadcn
* TanStack Query where appropriate
* TanStack Table where appropriate
* React Hook Form
* Zod
* Lucide icons

Use existing project versions.

Do not upgrade major dependencies without explicit justification.

---

# 4. Design Philosophy

The admin UI must feel like a **premium professional operations product**.

Think:

* Linear
* Stripe Dashboard
* Vercel
* modern healthcare SaaS
* enterprise operations software

Avoid:

* generic Bootstrap dashboards
* excessive gradients
* decorative glassmorphism
* oversized cards
* meaningless illustrations
* excessive animations
* dashboard template aesthetics

The interface should prioritize:

```text
clarity
hierarchy
density
speed
trust
precision
```

---

# 5. Do Not Redesign Existing Brand Identity

Do not arbitrarily change existing:

* brand colors
* typography
* logo
* visual identity

If the project already defines design tokens, use them.

Do not introduce a second visual language.

---

# 6. Component System

Use:

```text
components/ui/*
```

for reusable primitives.

Prefer shadcn components for:

* Button
* Card
* Badge
* Dialog
* DropdownMenu
* Tooltip
* Select
* Input
* Tabs
* Table
* Sheet
* Alert
* Skeleton

Do not recreate basic UI primitives manually if an existing component exists.

---

# 7. Component Architecture

Prefer:

```text
components/
  ui/
  layout/
  navigation/
  data-table/
  filters/
  charts/
  forms/
  security/
  patients/
  clinicians/
  assignments/
  alerts/
  finance/
  mira/
  audit/
```

Pages should compose domain components.

Do not put huge component implementations directly inside page files.

---

# 8. Layout

Recommended:

```text
Sidebar
    ↓
Topbar
    ↓
Page header
    ↓
Primary content
```

The sidebar should provide access to:

```text
Overview
Security
Patients
Clinicians
Assignments
Clinics
Supervision
Mira
Finance
AI / Model
Content
System
Audit
```

Only show sections authorized for the current admin role.

---

# 9. Role-Based UI

Frontend role checks are for UX.

They are NOT security.

Example:

```text
SUPER_ADMIN
ADMIN
FINANCE
SUPPORT
```

Use permissions to:

* hide inaccessible navigation
* disable unavailable actions
* avoid rendering unnecessary controls

But always assume the backend is the final authority.

Never say:

> “This is secure because the button is hidden.”

---

# 10. Dashboard

The overview page must be an **action center**.

Do not start with 12 decorative KPI cards.

Primary section:

## Requires attention

Examples:

* open crises
* SLA breaches
* unrouted clinical alerts
* pending licenses
* overdue weekly reports
* failed AI jobs
* failed payments

Then:

## Platform metrics

Examples:

* active users
* active trials
* conversion
* MRR
* relevant operational statistics

The dashboard should answer:

> What needs attention now?

---

# 11. Data Tables

Use DataTable patterns for operational datasets.

Tables should support where relevant:

* pagination
* sorting
* filtering
* search
* column visibility
* status filters
* date filters
* row actions
* bulk operations only when safe

Never load thousands of records unnecessarily.

Prefer server-side pagination.

---

# 12. Loading States

Every async screen needs a deliberate loading state.

Use:

* Skeleton
* table skeleton
* inline loading
* button loading state

Never leave large blank areas while data loads.

---

# 13. Empty States

Empty states must explain why the list is empty.

Bad:

> No data.

Better:

> No pending clinician licenses.

Include an appropriate next action when useful.

---

# 14. Error States

Errors must be visible and actionable.

Do not silently swallow API errors.

Use:

* Alert
* toast
* inline form errors
* retry actions

Never expose backend stack traces.

---

# 15. Patients

Patient administration should expose operational information only.

Recommended tabs:

### Profile

* account status
* registration
* basic account information

### Subscription

* current plan
* status
* payment state

### Mira

* diagnostic status
* session metadata
* version
* orientation
* relevant risk metadata

### Assignment

* assigned clinician
* primary clinician
* assignment status
* consent metadata

### Access

* relevant access history

Do not display:

* raw transcript
* private clinician notes
* unnecessary clinical content

---

# 16. Clinicians

Clinician pages should support:

* search
* status filtering
* clinic
* clinical role
* license state
* caseload
* SLA metrics

Clinician details:

```text
identity
clinic
license
status
role
caseload
SLA
weekly-report acknowledgement
```

Actions:

* suspend
* reactivate
* assign clinic
* manage operational role

Do not add clinical decision controls to admin screens.

---

# 17. License Validation

Create a dedicated validation queue.

Display:

* clinician
* authority
* license number where appropriate
* expiration
* status
* submitted date

Actions should be explicit:

```text
Approve
Reject
Request information
```

Every privileged action should provide confirmation and feedback.

---

# 18. Assignments

Assignments are a first-class workflow.

Display:

```text
Patient
Clinician
Clinic
Status
Primary
Consent
Created
```

Actions:

* assign
* end
* change primary

Use confirmation dialogs for destructive actions.

---

# 19. Security / Crisis Center

This is an operational queue.

Sort by:

1. severity
2. SLA deadline
3. creation time

Provide:

* filters
* status
* severity
* clinic
* routed/unrouted
* SLA breach

The admin UI should emphasize:

```text
route
escalate
monitor
resolve operationally
```

Do not present admin controls as if the admin were providing therapy or clinical treatment.

---

# 20. Mira

Mira analytics should prioritize:

* funnel
* completion
* abandonment
* language
* orientation
* risk distribution
* blocked sessions
* Mira version
* conversion

Use charts only when they communicate meaningful information.

Avoid chart decoration.

---

# 21. Finance

Finance is restricted.

Display:

* payments
* failed payments
* subscriptions
* plans
* refunds
* MRR/ARR
* trial expiration
* payment failures

Payment status should come from backend state.

Never implement frontend-only payment status mutation.

Refund actions must require:

* permission
* confirmation
* reason where required

---

# 22. Audit

Audit UI should support:

* actor
* role
* action
* entity
* entity ID
* timestamp
* IP/device metadata where available
* reason
* result

Provide filters:

```text
date
admin
action
entity
patient
clinician
```

Sensitive information should not be displayed unnecessarily.

---

# 23. System

System administration is highly privileged.

Sections:

* admins
* roles
* feature flags
* system configuration
* AI jobs
* service health

Only authorized roles should see these sections.

---

# 24. Forms

Use:

```text
React Hook Form
Zod
```

where already available.

Every form must have:

* validation
* loading state
* server error handling
* success feedback
* cancellation behavior
* dirty-state awareness where necessary

Do not trust frontend validation as security.

---

# 25. API Integration

Centralize API communication.

Do not scatter raw `fetch()` calls throughout components.

Prefer:

```text
lib/api/
hooks/
services/
```

Use typed responses.

Handle:

* 401
* 403
* 404
* 409
* 422
* 429
* 500

appropriately.

---

# 26. Authentication

Do not store authentication tokens in:

```text
localStorage
sessionStorage
```

when the backend architecture supports secure HttpOnly cookies.

The frontend must cooperate with the backend's secure authentication model.

---

# 27. Navigation

Navigation must be permission-aware.

Example:

```text
Finance
    → FINANCE
    → SUPER_ADMIN

System
    → SUPER_ADMIN

Operational administration
    → ADMIN
    → SUPER_ADMIN

Limited user lookup
    → SUPPORT
```

Never rely on navigation hiding for authorization.

---

# 28. Accessibility

Every important interaction must support:

* keyboard navigation
* focus states
* accessible labels
* semantic HTML
* sufficient contrast
* screen-reader-friendly controls

Do not sacrifice accessibility for visual effects.

---

# 29. Responsive Behavior

Admin is desktop-first but must remain usable on:

* laptop
* tablet
* smaller desktop windows

Do not allow:

* horizontal overflow
* unreadable tables
* broken modals
* sidebar overlap

For tables on smaller screens, use:

* horizontal scroll
* responsive columns
* detail drawer

rather than shrinking everything until it becomes unreadable.

---

# 30. Animation

Animation must be subtle.

Good:

* page transitions
* drawer transitions
* modal transitions
* hover feedback
* table state transitions

Avoid:

* large hero animations
* distracting particle effects
* excessive parallax
* decorative motion in operational screens

The admin product is for speed and reliability.

---

# 31. Security UX

For destructive or privileged operations:

Use:

```text
confirmation
clear consequences
reason field where required
loading state
success/error feedback
```

Examples:

* suspend clinician
* refund
* change subscription
* reroute alert
* export sensitive data
* disable admin
* modify system configuration

---

# 32. No Fake Data

Never hardcode fake production metrics into the dashboard.

Bad:

```ts
const revenue = 12850;
```

unless it is explicitly a mock/demo environment.

Production dashboards must use real API data.

---

# 33. No Fake Loading

Do not use artificial delays to make the interface “feel premium”.

Use actual request state.

---

# 34. Charts

Charts must answer a business/operational question.

Examples:

Good:

```text
diagnostic completion funnel
payment failures over time
risk distribution
Mira abandonment
MRR trend
```

Bad:

```text
random line chart
decorative donut
unexplained percentage
```

Always provide context and labels.

---

# 35. Frontend Testing

Use the project's existing testing stack.

Test:

* role-based rendering
* protected routes
* forms
* critical tables
* payment actions
* assignment workflow
* alert workflow
* error states
* loading states

Use E2E tests for critical workflows.

---

# 36. Do Not Do

Never:

* invent API endpoints
* assume response structures
* bypass authentication
* store auth tokens insecurely
* expose clinical content for convenience
* create fake metrics
* hide backend errors silently
* duplicate shadcn components unnecessarily
* create a second design system
* change brand identity without instruction
* add decorative UI that reduces operational clarity
* implement admin clinical decision-making

---

# 37. Definition of Done

A frontend feature is complete when:

* API contract is verified
* role permissions are respected
* loading state exists
* empty state exists
* error state exists
* mobile/responsive behavior is acceptable
* accessibility is considered
* no fake data exists
* sensitive information is minimized
* critical actions have confirmation
* relevant tests pass
* existing visual system remains consistent
