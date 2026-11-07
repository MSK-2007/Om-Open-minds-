# OM OPEN MINDS — Administrative Content Management Specification

> **Document:** `docs/admin-functional-specification.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Phase:** Phase 2 Administrative Functional Blueprint  
> **Status:** Module-by-Module Specification

---

## 1. Administrative Architecture & Security Principles

The Administrative Portal (`/admin/*`) is completely decoupled from public-facing views and operates under strict security and access control mandates:

1. **Authentication Enforcement:** Managed exclusively via Supabase Auth (`supabase.auth.signInWithPassword`). No hardcoded or bypass accounts are permitted.
2. **Authorization & Role-Based Access Control (RBAC):** Every administrator profile is verified in the `admin_profiles` table with roles (`super_admin`, `staff`, `editor`).
3. **Database Security:** Enforced by PostgreSQL Row Level Security (RLS) policies. Direct client manipulation is prevented; unauthenticated or unauthorized database mutations fail at the database engine level.
4. **Audit Trail & Attribution:** System automatically records timestamps (`created_at`, `updated_at`) and attribution on all mutable administrative entities.
5. **Data Protection Mandate:** Administrative inquiry views contain family contact info. Access to this data requires authenticated active sessions; export capabilities are restricted to authorized personnel.

---

## 2. Module Specifications

---

### Module A: General Website Content Management

#### 1. Scope
Manages the institution's core identity, mission, vision, about narrative, and operational contact information.

#### 2. Sub-Sections & Fields

##### A1. School Identity & Hero Settings
* `hero_title` (String, required, max 100 chars): Main homepage headline.
* `hero_subtitle` (Text, required, max 300 chars): Reassuring positioning text.
* `primary_cta_label` (String, required, max 40 chars): Button text (default: "Schedule a Consultation").
* `primary_cta_url` (String, required, max 100 chars): Relative route (default: `/admissions`).

##### A2. Vision, Mission & Ethos
* `vision_statement` (Text, required, max 1000 chars): Long-term societal vision.
* `mission_statement` (Text, required, max 1000 chars): Daily operational purpose.
* `about_narrative` (Text, required, max 3000 chars): Founding story and pedagogical philosophy.
* `core_values` (Array of Strings, required): 3 to 8 values tags.

##### A3. Contact & Physical Location Settings
* `address_line_1` (String, required, max 120 chars).
* `address_line_2` (String, optional, max 120 chars).
* `city` (String, required, max 60 chars).
* `pincode` (String, required, regex: `^[0-9]{6}$` for India).
* `primary_telephone` (String, required, max 20 chars).
* `emergency_helpline` (String, required, max 20 chars).
* `inquiry_email` (Email string, required).
* `visiting_hours` (String, required, max 100 chars).
* `accessibility_navigation_guidelines` (Text, required, max 1000 chars): Explicit directions for visitors with wheelchairs and mobility aids.

#### 3. Administrator Actions
* **View:** Inspect current published institutional information.
* **Edit & Save:** Update content fields with instant inline validation.
* **Preview:** Compare draft text against current published version.
* **Validation Rules:** All required text fields must be non-empty; email must conform to RFC 5322 standard; phone numbers must be valid telecommunication formats.

---

### Module B: Educational Content Management

#### 1. Scope
Manages structured learning pathways, pedagogical approaches, specialized facilities, and faculty profiles.

#### 2. Sub-Sections & Fields

##### B1. Programmes & Pathways (`programmes`)
* `title` (String, required, min 3, max 80 chars): Name of the programme.
* `slug` (String, required, lowercase alphanumeric and hyphens, unique): URL slug.
* `stage_description` (String, required, max 100 chars): Target developmental stage.
* `description` (Text, required, min 20, max 2000 chars): Curriculum summary.
* `curriculum_highlights` (Array of Strings, min 1, max 8 items): Key learning goals.
* `educator_ratio` (String, optional, max 50 chars): e.g., "1:3 Educator to Student Ratio".
* `display_order` (Integer, default: 0): Ordering position.
* `is_active` (Boolean, default: true): Visibility flag.

##### B2. Campus Facilities Directory (`facilities`)
* `title` (String, required, max 80 chars): Facility name (e.g., "Sensory Integration Suite").
* `slug` (String, required, unique).
* `category` (Enum, required): `'Sensory'`, `'Therapy'`, `'Learning'`, `'Recreation'`.
* `description` (Text, required, max 1500 chars): Room utility and developmental purpose.
* `accessibility_features` (Array of Strings, min 1, max 6 items): e.g., ["Sound-dampened", "Padded flooring"].
* `image_url` (URL, required): Asset reference in Supabase Storage.
* `image_alt` (String, required, min 15, max 250 chars): Detailed descriptive alt text.
* `display_order` (Integer, default: 0).
* `is_active` (Boolean, default: true).

##### B3. Team & Faculty Profiles (`team_members`)
* `full_name` (String, required, min 2, max 80 chars).
* `role_title` (String, required, max 80 chars): e.g., "Senior Occupational Therapist".
* `department` (Enum, required): `'Leadership'`, `'Special Education'`, `'Therapy'`, `'Support'`.
* `qualifications` (String, required, max 150 chars): Formal certifications and degrees.
* `bio` (Text, required, max 800 chars): Professional experience and dedication.
* `photo_url` (URL, optional): Portrait asset reference.
* `photo_alt` (String, required if photo present, max 150 chars).
* `display_order` (Integer, default: 0).
* `is_active` (Boolean, default: true).

#### 3. Administrator Actions
* **Create (Add New):** Add a new programme, facility, or team member via modal form.
* **Read (Filter & Search):** Filter by department, category, or status; search by title/name.
* **Update (Edit):** In-place editing of curriculum, photos, and descriptions.
* **Reorder:** Change `display_order` to control frontend presentation sequence.
* **Toggle Visibility:** Instantly activate or archive items without deleting historical records.
* **Delete:** Soft or hard delete (restricted to `super_admin`).

---

### Module C: Updates, Announcements & Events Management

#### 1. Scope
Enables timely communication of urgent school notifications, circulars, calendar changes, and campus activities.

#### 2. Fields & Validation Rules (`announcements` & `activities`)

##### C1. Urgent Notices & Announcements (`announcements`)
* `title` (String, required, min 5, max 120 chars): Headline for ticker or banner.
* `category` (Enum, required): `'general'`, `'urgent'`, `'admissions'`, `'calendar'`.
* `summary` (Text, optional, max 500 chars): Detailed note.
* `link_url` (URL or relative path, optional): Target web page or downloadable circular.
* `publish_date` (Date, required, defaults to current date).
* `expiration_date` (Date, optional): Date after which the alert automatically archives.
* `is_active` (Boolean, default: true): Manual toggle.

##### C2. Activities & Campus Events (`activities`)
* `title` (String, required, max 100 chars): Name of event or activity.
* `type` (Enum, required): `'Regular Activity'`, `'Upcoming Event'`, `'Past Milestone'`.
* `description` (Text, required, max 1500 chars).
* `event_date` (Date, optional: required for upcoming events).
* `frequency` (String, optional, max 50 chars): e.g., "Weekly on Tuesdays".
* `image_url` (URL, optional).
* `image_alt` (String, required if image present).
* `is_active` (Boolean, default: true).

#### 3. Administrator Actions
* **Quick Toggle:** Instant on/off switch for the homepage marquee ticker.
* **Scheduled Expiry:** Set notices to self-expire after an event passes.
* **Category Filtering:** Filter announcements by priority level (`urgent` triggers high-priority ARIA live region).
* **Archive & Restore:** Maintain historical record of past school announcements.

---

### Module D: Media & Gallery Management

#### 1. Scope
Manages photo uploads to Supabase Storage, validates alt text, categorizes images, and enforces child privacy consent.

#### 2. Fields & Validation Rules (`gallery_items`)
* `title` (String, required, max 100 chars): Public caption.
* `category` (Enum, required): `'Campus Facilities'`, `'Classroom Moments'`, `'Creative Arts'`, `'Celebrations'`.
* `file` (Binary Image File, required during upload): Formats: `.jpg`, `.jpeg`, `.png`, `.webp`. Max size: 2 MB.
* `image_alt` (String, required, min 15, max 250 chars): Comprehensive descriptive alt text. *Upload form rejects submission if alt text is blank.*
* `has_parental_consent` (Boolean, required): Mandatory checkbox: "I confirm that signed parental/guardian consent is on file for any identifiable students in this photograph." *Submission is blocked if unchecked.*
* `display_order` (Integer, default: 0).
* `is_published` (Boolean, default: true).

#### 3. Administrator Actions
* **Secure Upload:** Uploads file directly to Supabase Storage bucket (`gallery-media`) with automatic UUID filename generation.
* **Alt-Text Editing:** Update accessibility descriptions at any time.
* **Recategorize:** Shift media between albums.
* **Unpublish / Hide:** Instantly withdraw an image from public view if consent is revoked.
* **Permanent Deletion:** Removes database record and triggers object deletion from storage bucket.

---

### Module E: Enquiries & Admissions Management

#### 1. Scope
Provides a centralized, secure administrative dashboard for tracking and managing confidential parent inquiries from both the Admissions form and General Contact form.

#### 2. Fields & Data Structure

##### E1. Admissions Inquiries (`admissions_inquiries`)
* `id` (UUID, primary key, auto-generated).
* `parent_name` (String, read-only from submission).
* `email` (Email string, read-only from submission).
* `phone` (Phone string, read-only from submission).
* `child_name` (String, read-only from submission).
* `child_age` (Integer or null, read-only from submission).
* `notes` (Text or null, read-only from submission).
* `status` (Enum, editable by admin): `'pending'`, `'in_review'`, `'contacted'`, `'consultation_scheduled'`, `'archived'`.
* `internal_admin_notes` (Text, editable by admin): Confidential staff notes (e.g., "Called parent on Nov 8; scheduled campus observation visit for Nov 14 at 10:00 AM").
* `assigned_staff_id` (UUID, optional): Foreign key to `admin_profiles.id`.
* `created_at` (Timestamp, read-only).
* `updated_at` (Timestamp, auto-updated upon status/notes change).

##### E2. General Contact Messages (`contact_messages`)
* `id` (UUID, primary key, auto-generated).
* `name` (String, read-only).
* `email` (String, read-only).
* `phone` (String or null, read-only).
* `subject` (String, read-only).
* `message` (Text, read-only).
* `status` (Enum, editable by admin): `'unread'`, `'read'`, `'replied'`, `'archived'`.
* `internal_notes` (Text, editable by admin).
* `created_at` (Timestamp, read-only).

#### 3. Administrator Actions
* **Inbox View:** Chronological tabular view of incoming inquiries with status badges.
* **Filter & Search:** Filter by status (`pending`, `contacted`, etc.) and date range; search by parent name, email, or telephone.
* **Status Progression:** Update workflow state as the school contacts the parent outside the platform.
* **Internal Log:** Record notes regarding phone consultations or appointment dates.
* **Export (Authorized Only):** Export inquiry lists to CSV/Excel for offline school administrative meetings (logged in audit table).
* **Archive:** Move completed or duplicate inquiries out of active view without permanently deleting records.

