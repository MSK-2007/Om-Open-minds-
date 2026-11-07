# OM OPEN MINDS — Contact & Enquiry Workflow Specification

> **Document:** `docs/enquiry-workflow.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Phase:** Phase 2 Technical Intake & Form Processing Blueprint  
> **Status:** Specification Ready for Phase 3 Implementation

---

## 1. Overview & Dual-Form Architecture

To maintain clear operational separation between prospective student enrollments and general administrative inquiries, OM OPEN MINDS deploys two distinct forms:

1. **Admissions Enquiry Form (`/admissions`):** High-touch intake for families seeking school placement, consultations, and campus tours.
2. **General Contact Form (`/contact`):** General communication channel for vendors, community partnerships, media, visiting educators, and general questions.

Both forms share unified validation, accessible error announcements, spam defense, and back-office management patterns.

---

## 2. Form Specifications & Fields Breakdown

### Form A: General Contact Form (`/contact`)

* **Purpose:** Route general inquiries to administrative reception.
* **Database Destination:** `contact_messages` table.
* **Fields & Constraints:**

| Field | Input Element | Validation Rules | Error Message Display |
| :--- | :--- | :--- | :--- |
| **Full Name** | `<input type="text">` | Required; min 2 chars; max 80 chars; trimmed. | "Please enter your full name (minimum 2 characters)." |
| **Email Address** | `<input type="email">` | Required; valid RFC 5322 format; max 120 chars. | "Please enter a valid email address (e.g., name@example.com)." |
| **Phone Number** | `<input type="tel">` | Optional; if provided: numeric, 10–15 digits. | "Please enter a valid phone number or leave blank." |
| **Subject** | `<input type="text">` | Required; min 3 chars; max 100 chars. | "Please provide a subject for your message." |
| **Message** | `<textarea>` | Required; min 10 chars; max 2000 chars. | "Please enter your message (at least 10 characters)." |
| **Honeypot Trap** | `<input type="text" style="display:none">` | Must remain completely empty upon submit. | Silent rejection if filled (bot detection). |

---

### Form B: Admissions Enquiry Form (`/admissions`)

* **Purpose:** Confidential consultation scheduling for prospective students.
* **Database Destination:** `admissions_inquiries` table.
* **Fields & Constraints:**

| Field | Input Element | Validation Rules | Error Message Display |
| :--- | :--- | :--- | :--- |
| **Parent / Guardian Name** | `<input type="text">` | Required; min 2 chars; max 80 chars. | "Please enter the parent or guardian's full name." |
| **Email Address** | `<input type="email">` | Required; valid RFC 5322 email format. | "Please enter a valid email address." |
| **Telephone Number** | `<input type="tel">` | Required; valid format; min 10 digits. | "Please enter a valid phone number so our team can call you." |
| **Child's First Name** | `<input type="text">` | Required; min 2 chars; max 60 chars. | "Please enter your child's first name." |
| **Child's Age** | `<input type="number">` | Optional; integer between 1 and 25. | "Please enter a valid age or leave blank." |
| **Preferred Programme** | `<select>` | Optional; matches published stage slugs. | Valid dropdown option. |
| **Notes / Questions** | `<textarea>` | Optional; max 1500 chars. | "Maximum 1500 characters." |
| **Honeypot Trap** | `<input type="text" style="display:none">` | Must remain empty upon submit. | Silent rejection if filled. |

---

## 3. Client-Side & Service-Side Validation Architecture

Both forms adhere to a two-tier validation lifecycle:

```
[User Input] 
     │
     ▼
[Client-Side Realtime Validation] ──(Fails)──> [Accessible Inline Error (aria-describedby + role="alert")]
     │ (Passes)
     ▼
[Spam & Honeypot Check] ──(Bot Detected)──> [Silent Abort / Rejection]
     │ (Clean)
     ▼
[Supabase Client Service Layer] ──(Network/DB Error)──> [Accessible Error Banner with Retry Button]
     │ (Success)
     ▼
[State Transition to Confirmation View] ──> [Live Region Voice Announcement]
```

### 1. Accessible Error Binding
* Every field is explicitly associated with an error message container via `aria-describedby="{field_id}-error"`.
* When an error exists:
  * The input gains `aria-invalid="true"`.
  * The error container has `role="alert"`.
  * The browser automatically moves keyboard focus to the first invalid field upon form submission failure.

---

## 4. Spam Prevention Strategy (Zero User Friction)

Because visitors to a special education website may experience sensory or cognitive challenges, **we strictly forbid aggressive, distorted image CAPTCHAs** (such as deciphering warped letters or clicking all crosswalks). Instead, we enforce a multi-layered, zero-friction spam defense:

1. **Invisible Honeypot Field:**
   * A hidden text input named `organization_website_verify` is rendered off-screen.
   * Screen readers are instructed to ignore it via `aria-hidden="true"` and `tabIndex={-1}`.
   * Automated spam bots inevitably populate all discovered input fields; any submission with a populated honeypot is immediately rejected.
2. **Timestamp Rate Limiting (Time-to-Submit):**
   * The client records the exact timestamp when the form was mounted.
   * Human parents require at least 5 to 10 seconds to read and fill the fields.
   * Any submission completed in under 2.5 seconds is flagged as an automated script.
3. **Database-Level Rate Limiting:**
   * Supabase PostgreSQL triggers enforce a maximum of 3 submissions per IP/client window within a 15-minute interval.
4. **Clean String Sanitization:**
   * All incoming text strings are stripped of HTML/script injection tags prior to database insertion.

---

## 5. Submission Confirmation & Error Handling

### Confirmation State
* Upon successful insertion:
  1. Form inputs are completely unmounted from the DOM to prevent accidental duplicate resubmission.
  2. A dedicated, accessible Confirmation Panel renders.
  3. Dynamic live announcer (`#a11y-live-announcer`) vocalizes: *"Thank you. Your message has been sent successfully."*
  4. The panel displays an unambiguous message regarding response turnaround (1–2 school days) and reiterates the direct telephone helpline.

### Graceful Error Handling
* In the event of network disruption or temporary database unavailability:
  1. The form state remains intact—user inputs are **never cleared or lost**.
  2. An accessible error banner appears above the submit button (`role="alert"`).
  3. A "Retry Submission" button is provided.
  4. The school office telephone number is displayed as an immediate fallback channel.

---

## 6. Administrative Enquiry Management

In the protected back-office (`/admin/dashboard/inquiries`):

1. **Real-Time Badge Notifications:** The sidebar displays a visual pill badge with the count of unhandled `'pending'` admissions enquiries and `'unread'` contact messages.
2. **Segregated Tabs:** Admissions enquiries and contact messages are separated into dedicated sub-tabs to maintain clear focus.
3. **Audit History & Status Toggling:**
   * Staff can change an inquiry status from `'pending'` to `'in_review'`, `'contacted'`, `'consultation_scheduled'`, or `'archived'`.
   * Staff can append private timestamped notes (e.g., *"Nov 8: Spoke with parent, scheduled gentle campus observation for Nov 14 at 10 AM"*).
4. **Data Privacy Compliance:** Only authenticated administrators with approved RLS policies can view inquiry tables. Public client keys cannot read these records.

