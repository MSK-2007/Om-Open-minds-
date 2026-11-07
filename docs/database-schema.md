# OM OPEN MINDS — Database Schema Specification

> **Document:** `docs/database-schema.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Database Engine:** PostgreSQL 15+ (Supabase)  
> **Phase:** Phase 3 — Backend Implementation Baseline

---

## 1. Schema Design Principles

The database schema for OM OPEN MINDS is normalized, strictly typed, and security-hardened:
1. **Primary Key Strategy:** All entity tables utilize Universally Unique Identifiers (`UUID`) generated via `gen_random_uuid()` to prevent predictable resource iteration attacks.
2. **Temporal Integrity:** All timestamps use `TIMESTAMPTZ` (timestamp with time zone) and default to `now()`. Modifiable tables feature automatic `BEFORE UPDATE` triggers executing `public.set_updated_at()`.
3. **Data Integrity & Check Constraints:** Enums and domain constraints (such as valid categories, roles, and status states) are enforced at the database column level via `CHECK` constraints.
4. **Child Privacy & Data Minimization:** The admissions schema strictly limits intake fields to respectful contact channels; **no columns exist for clinical psychiatric evaluations, therapy records, or medical files**.
5. **Foreign Key Integrity:** Cascading deletes (`ON DELETE CASCADE`) are restricted to tightly coupled identities (such as `admin_profiles` $\rightarrow$ `auth.users`), while operational entities utilize `ON DELETE SET NULL` or strict references to preserve historical audit logs.

---

## 2. Table-by-Table Data Dictionary

---

### Table 1: `public.admin_profiles`
* **Purpose:** Extends `auth.users` to associate human identity, administrative role, and activation status for school staff.
* **Primary Key:** `id UUID` (References `auth.users(id)` ON DELETE CASCADE).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | None | PK, FK $\rightarrow$ `auth.users.id` | User UUID from Supabase Auth |
| `full_name` | `TEXT` | No | None | `length(trim(full_name)) >= 2` | Staff member full name |
| `role` | `TEXT` | No | `'staff'` | `IN ('super_admin', 'staff', 'editor')` | Role for permission matrix |
| `is_active` | `BOOLEAN` | No | `true` | None | Account access toggle |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** PK on `id`.
* **Triggers:** `trg_admin_profiles_updated_at` (`BEFORE UPDATE`).

---

### Table 2: `public.site_settings`
* **Purpose:** Key-value store for global site parameters (e.g., emergency hotline, visiting hours, physical address).
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `setting_key` | `TEXT` | No | None | `UNIQUE` | Machine key (e.g., `emergency_phone`) |
| `setting_value` | `TEXT` | No | None | None | Value string |
| `description` | `TEXT` | Yes | `NULL` | None | Administrative helper note |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** Unique index on `setting_key`.
* **Triggers:** `trg_site_settings_updated_at` (`BEFORE UPDATE`).

---

### Table 3: `public.core_pillars`
* **Purpose:** Differentiators presented in the "Why OM OPEN MINDS" section (IEPs, multidisciplinary staff, sensory rooms).
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `title` | `TEXT` | No | None | `length(trim(title)) >= 3` | Pillar headline |
| `description` | `TEXT` | No | None | None | Explanation narrative |
| `icon_key` | `TEXT` | No | None | None | Icon token identifier |
| `display_order`| `INT` | No | `0` | None | Visual sequence rank |
| `is_active` | `BOOLEAN` | No | `true` | None | Public publication toggle |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_core_pillars_active_order` on `(is_active, display_order)`.
* **Triggers:** `trg_core_pillars_updated_at` (`BEFORE UPDATE`).

---

### Table 4: `public.programmes`
* **Purpose:** Educational pathways structured by developmental stage (Early Intervention, Foundation, Life Skills, Pre-Vocational).
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `title` | `TEXT` | No | None | `length(trim(title)) >= 3` | Pathway name |
| `slug` | `TEXT` | No | None | `UNIQUE` | URL slug |
| `stage_description`| `TEXT` | No | None | None | Developmental readiness stage |
| `description` | `TEXT` | No | None | None | Comprehensive pathway overview |
| `curriculum_highlights`| `TEXT[]` | No | `'{}'` | None | Array of milestone goals |
| `educator_ratio` | `TEXT` | Yes | `NULL` | None | e.g. "1:3 Staff to Student" |
| `display_order` | `INT` | No | `0` | None | Visual sequence rank |
| `is_active` | `BOOLEAN` | No | `true` | None | Publication status |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_programmes_slug` on `slug`; `idx_programmes_active_order` on `(is_active, display_order)`.
* **Triggers:** `trg_programmes_updated_at` (`BEFORE UPDATE`).

---

### Table 5: `public.facilities`
* **Purpose:** Campus infrastructure (sensory rooms, therapy units, adaptive playground).
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `title` | `TEXT` | No | None | None | Facility name |
| `slug` | `TEXT` | No | None | `UNIQUE` | URL identifier |
| `category` | `TEXT` | No | None | `IN ('Sensory', 'Therapy', 'Learning', 'Recreation')` | Functional grouping |
| `description` | `TEXT` | No | None | None | Utility description |
| `accessibility_features`| `TEXT[]`| No | `'{}'` | None | Accessibility adaptations list |
| `image_url` | `TEXT` | No | None | None | Storage asset reference |
| `image_alt` | `TEXT` | No | None | `length(trim(image_alt)) >= 15` | Screen reader alt text |
| `display_order` | `INT` | No | `0` | None | Sort order |
| `is_active` | `BOOLEAN` | No | `true` | None | Public visibility |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_facilities_slug` on `slug`; `idx_facilities_active_cat` on `(is_active, category, display_order)`.
* **Triggers:** `trg_facilities_updated_at` (`BEFORE UPDATE`).

---

### Table 6: `public.team_members`
* **Purpose:** Profiles of school leadership, certified special educators, and allied therapists.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `full_name` | `TEXT` | No | None | None | Staff full name |
| `role_title` | `TEXT` | No | None | None | Official designation |
| `department` | `TEXT` | No | None | `IN ('Leadership', 'Special Education', 'Therapy', 'Support')` | Department |
| `qualifications`| `TEXT` | No | None | None | Degrees / certifications |
| `bio` | `TEXT` | No | None | None | Professional narrative |
| `photo_url` | `TEXT` | Yes | `NULL` | None | Storage portrait URL |
| `photo_alt` | `TEXT` | Yes | `NULL` | None | Alt text for portrait |
| `display_order` | `INT` | No | `0` | None | Presentation rank |
| `is_active` | `BOOLEAN` | No | `true` | None | Active roster status |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_team_members_active_dept` on `(is_active, department, display_order)`.
* **Triggers:** `trg_team_members_updated_at` (`BEFORE UPDATE`).

---

### Table 7: `public.activities`
* **Purpose:** Extracurricular activities, music/art therapy sessions, and campus events.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `title` | `TEXT` | No | None | None | Activity name |
| `slug` | `TEXT` | No | None | `UNIQUE` | URL identifier |
| `activity_type`| `TEXT` | No | None | `IN ('Regular Activity', 'Upcoming Event', 'Past Milestone')` | Category |
| `description` | `TEXT` | No | None | None | Activity detail |
| `event_date` | `DATE` | Yes | `NULL` | None | Scheduled event date |
| `frequency` | `TEXT` | Yes | `NULL` | None | e.g. "Weekly on Tuesdays" |
| `image_url` | `TEXT` | Yes | `NULL` | None | Image asset URL |
| `image_alt` | `TEXT` | Yes | `NULL` | None | Screen reader alt text |
| `display_order` | `INT` | No | `0` | None | Sort order |
| `is_active` | `BOOLEAN` | No | `true` | None | Publication status |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_activities_slug` on `slug`; `idx_activities_active_date` on `(is_active, event_date DESC, display_order)`.
* **Triggers:** `trg_activities_updated_at` (`BEFORE UPDATE`).

---

### Table 8: `public.announcements`
* **Purpose:** Urgent notices, school calendar circulars, holiday alerts, and marquee alerts.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `title` | `TEXT` | No | None | None | Headline |
| `category` | `TEXT` | No | None | `IN ('general', 'urgent', 'admissions', 'calendar')` | Notice priority |
| `summary` | `TEXT` | Yes | `NULL` | None | Detail body |
| `link_url` | `TEXT` | Yes | `NULL` | None | Relative or external URL |
| `publish_date` | `DATE` | No | `CURRENT_DATE` | None | Start date for display |
| `expiration_date`| `DATE` | Yes | `NULL` | None | Auto-archival date |
| `is_active` | `BOOLEAN` | No | `true` | None | Manual toggle |
| `display_order` | `INT` | No | `0` | None | Sort rank |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_announcements_active_dates` on `(is_active, publish_date DESC, display_order)`.
* **Triggers:** `trg_announcements_updated_at` (`BEFORE UPDATE`).

---

### Table 9: `public.gallery_categories`
* **Purpose:** Albums classifying gallery media (e.g., Campus Spaces, Classroom Learning).
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:** `id`, `name` (UNIQUE), `slug` (UNIQUE), `description`, `display_order`, `is_active`, `created_at`.
* **Indexes:** Unique index on `slug`.

---

### Table 10: `public.gallery_items`
* **Purpose:** Images and media with mandatory descriptive alt text and signed parental release verification.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `category_id` | `UUID` | Yes | `NULL` | FK $\rightarrow$ `gallery_categories(id)` ON DELETE SET NULL | Album category |
| `title` | `TEXT` | No | None | None | Display caption |
| `image_url` | `TEXT` | No | None | None | Storage asset URL |
| `alt_text` | `TEXT` | No | None | `length(trim(alt_text)) >= 15` | Mandatory descriptive alt text |
| `has_parental_consent`| `BOOLEAN`| No | `false` | None | Staff consent confirmation |
| `is_published` | `BOOLEAN` | No | `false` | None | Public release flag |
| `display_order`| `INT` | No | `0` | None | Sort sequence |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Auto-updated timestamp |

* **Indexes:** `idx_gallery_items_published` on `(is_published, has_parental_consent, display_order)`.
* **Triggers:** `trg_gallery_items_updated_at` (`BEFORE UPDATE`).

---

### Table 11: `public.parent_resources`
* **Purpose:** Downloadable PDF calendars, parent handbooks, home sensory tip sheets.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:** `id`, `title`, `category` (`CHECK IN ('Calendar', 'Parent Guide', 'Sensory Tip Sheet', 'Policy')`), `description`, `file_url`, `external_url`, `file_format`, `file_size_kb`, `display_order`, `is_active`, `created_at`, `updated_at`.
* **Indexes:** `idx_parent_resources_active` on `(is_active, category, display_order)`.
* **Triggers:** `trg_parent_resources_updated_at` (`BEFORE UPDATE`).

---

### Table 12: `public.admissions_faqs`
* **Purpose:** Frequently asked questions for admissions and campus routines.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:** `id`, `question`, `answer`, `display_order`, `is_active`, `created_at`, `updated_at`.
* **Indexes:** `idx_admissions_faqs_active` on `(is_active, display_order)`.
* **Triggers:** `trg_admissions_faqs_updated_at` (`BEFORE UPDATE`).

---

### Table 13: `public.admission_enquiries`
* **Purpose:** Confidential parent consultation requests.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:**

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Unique identifier |
| `parent_name` | `TEXT` | No | None | `length(trim(parent_name)) >= 2` | Parent/guardian name |
| `email` | `TEXT` | No | None | `length(trim(email)) >= 5` | Parent contact email |
| `phone` | `TEXT` | No | None | `length(trim(phone)) >= 7` | Parent telephone |
| `child_name` | `TEXT` | No | None | `length(trim(child_name)) >= 1` | Child's first name |
| `child_age` | `INT` | Yes | `NULL` | `child_age >= 1 AND child_age <= 30` | Child age in years |
| `preferred_program`| `TEXT` | Yes | `NULL` | None | Programme of interest |
| `notes` | `TEXT` | Yes | `NULL` | None | General parent notes |
| `status` | `TEXT` | No | `'pending'` | `IN ('pending', 'in_review', 'contacted', 'consultation_scheduled', 'archived')` | Progress stage |
| `internal_admin_notes`| `TEXT` | Yes | `NULL` | None | Private staff notes |
| `assigned_staff_id`| `UUID` | Yes | `NULL` | FK $\rightarrow$ `admin_profiles(id)` ON DELETE SET NULL | Assigned staff member |
| `ip_hash` | `TEXT` | Yes | `NULL` | None | Salted hash for rate limiting |
| `created_at` | `TIMESTAMPTZ`| No | `now()` | None | Submission timestamp |
| `updated_at` | `TIMESTAMPTZ`| No | `now()` | None | Last status change timestamp |

* **Indexes:** `idx_admission_enquiries_status` on `(status, created_at DESC)`.
* **Triggers:** `trg_admission_enquiries_updated_at` (`BEFORE UPDATE`).

---

### Table 14: `public.contact_enquiries`
* **Purpose:** General communication messages.
* **Primary Key:** `id UUID` (`DEFAULT gen_random_uuid()`).
* **Columns:** `id`, `name`, `email`, `phone`, `subject`, `message`, `status` (`CHECK IN ('unread', 'read', 'replied', 'archived')`), `internal_admin_notes`, `assigned_staff_id` (FK $\rightarrow$ `admin_profiles.id`), `ip_hash`, `created_at`, `updated_at`.
* **Indexes:** `idx_contact_enquiries_status` on `(status, created_at DESC)`.
* **Triggers:** `trg_contact_enquiries_updated_at` (`BEFORE UPDATE`).

