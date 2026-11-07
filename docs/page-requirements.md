# OM OPEN MINDS — Comprehensive Page Requirements Specification

> **Document:** `docs/page-requirements.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Disabilities)  
> **Scope:** Full Functional, Structural, and Informational Requirements by Page  
> **Status:** Specification Baseline for Client Intake & Phase 2 Implementation

---

## 1. Architectural Conventions for All Pages

Every page in the OM OPEN MINDS platform conforms to the following structural and accessibility baselines:

1. **Semantic Landmark Architecture:** Every page is structured with `<header>`, `<nav>`, `<main id="main-content">`, and `<footer>`.
2. **Strict Heading Hierarchy:** Exactly one `<h1>` per page serving as the primary page title, followed by `<h2>` for major sections and `<h3>` for individual cards/sub-sections. Headings are never skipped (e.g., `h1` $\rightarrow$ `h2` $\rightarrow$ `h3`).
3. **Keyboard Focus Management:** Focus targets are explicitly identified. Interactive items support standard Tab / Shift+Tab navigation with 3px high-contrast outline `:focus-visible`.
4. **Dynamic Supabase Connections:** Data is abstracted through dedicated service layers (`src/services/supabase/`). Loading spinners (`role="status"`) and accessible error messages (`role="alert"`) are standard.
5. **No Invented Information:** Fictitious staff rosters, clinical categories, or phone numbers are never fabricated. Clear data-intake requirements are documented for every field.

---

## 2. Public Pages Specification

---

### Page 1: Home Page (`/`)
* **Primary Title (`h1`):** "OM OPEN MINDS — Specialized Education & Development"
* **Target Audience:** Prospective parents seeking immediate reassurance, clarity, and next steps; current families looking for notices.

#### Sections Breakdown:

#### 1.1 Hero & Institutional Positioning Banner
* **Purpose:** Provides immediate compassionate reassurance to parents, articulating the school's core commitment to every child's potential.
* **Information Required from Client:**
  * Official hero headline and reassuring secondary statement.
  * Hero banner photograph featuring the school's positive learning environment (with parental consent).
* **Content Fields:**
  * `hero_title` (String, required): Institutional headline.
  * `hero_subtitle` (Text, required): Reassuring 2–3 sentence overview.
  * `primary_cta_label` (String, default: "Schedule a Consultation").
  * `primary_cta_url` (String, default: `/admissions`).
  * `hero_image_url` (URL, optional).
  * `hero_image_alt` (String, required if image present).
* **Dynamic Supabase Data:** Yes (`site_settings`).
* **Admin Manageability:** Yes.

#### 1.2 Urgent Parent Announcements Ticker
* **Purpose:** Highlights time-sensitive notifications (admissions deadlines, parent workshops, term schedules).
* **Information Required from Client:** Active notifications, circular dates, and optional PDF links.
* **Content Fields:**
  * `id` (UUID, auto-generated).
  * `title` (String, required): Headline.
  * `category` (Enum: `'general'`, `'urgent'`, `'admissions'`, `'event'`).
  * `link_url` (URL, optional).
  * `is_active` (Boolean).
* **Dynamic Supabase Data:** Yes (`announcements`).
* **Admin Manageability:** Yes.

#### 1.3 Institutional Introduction & Mission Snapshot
* **Purpose:** Grounded statement of founding ethos and commitment to child dignity and neurodiversity.
* **Information Required from Client:** Short mission statement and foundational principles.
* **Content Fields:**
  * `section_heading` (String, required): `h2`.
  * `mission_summary` (Text, required): Brief statement of purpose.
  * `values_bullets` (Array of Strings, optional): 3 core principles.
* **Dynamic Supabase Data:** Yes (`institutional_profile`).
* **Admin Manageability:** Yes.

#### 1.4 Core Pillars / Why OM OPEN MINDS
* **Purpose:** Outlines the school's primary differentiators (IEPs, low ratios, adaptive infrastructure, multidisciplinary team).
* **Information Required from Client:** 4–6 verified structural advantages.
* **Content Fields:**
  * `pillar_title` (String, required): `h3`.
  * `pillar_description` (Text, required).
  * `icon_key` (String, required).
* **Dynamic Supabase Data:** Yes (`core_pillars`).
* **Admin Manageability:** Yes.

#### 1.5 Programmes / Learning Pathways Overview
* **Purpose:** Teaser cards introducing educational stages (Early Learning, Foundation, Life Skills, Vocational Readiness).
* **Information Required from Client:** Summary of programmes offered.
* **Content Fields:**
  * `programme_title` (String, required): `h3`.
  * `age_or_stage` (String, optional).
  * `brief_summary` (Text, required).
  * `link_to_detail` (String: `/programmes`).
* **Dynamic Supabase Data:** Yes (`programmes`).
* **Admin Manageability:** Yes.

#### 1.6 Specialized Facilities Snapshot
* **Purpose:** Visually illustrates safety and sensory accommodation (Sensory rooms, therapy spaces).
* **Information Required from Client:** 3 featured facilities and certified accessibility features.
* **Content Fields:**
  * `facility_name` (String, required): `h3`.
  * `category` (String, required).
  * `image_url` (URL, required).
  * `image_alt` (String, required).
* **Dynamic Supabase Data:** Yes (`facilities`).
* **Admin Manageability:** Yes.

#### 1.7 Leadership Desk / Director's Welcome
* **Purpose:** A warm, empathetic welcome from the head of the institution.
* **Information Required from Client:** Director's name, credentials, welcome message, and portrait photo.
* **Content Fields:**
  * `leader_name` (String, required).
  * `leader_title` (String, required).
  * `welcome_message` (Text, required).
  * `photo_url` (URL, optional).
  * `photo_alt` (String, required if photo present).
* **Dynamic Supabase Data:** Yes (`leadership_messages`).
* **Admin Manageability:** Yes.

#### 1.8 Consultative Admissions Call-to-Action
* **Purpose:** Prompts parents to take the next gentle step with an accessible consultation inquiry.
* **Information Required from Client:** Consultation hotline and office schedule.
* **Content Fields:**
  * `cta_heading` (String, required).
  * `consultation_steps_summary` (Text, required).
  * `cta_button_label` (String: "Inquire About Admissions").
* **Dynamic Supabase Data:** No (Static linking to `/admissions`).
* **Admin Manageability:** No.

---

### Page 2: About Us Page (`/about`)
* **Primary Title (`h1`):** "About OM OPEN MINDS"
* **Target Audience:** Families and professionals seeking in-depth understanding of the school's pedagogical philosophy, multidisciplinary faculty, and governance.

#### Sections Breakdown:

#### 2.1 Founding Story & Institutional Ethos
* **Purpose:** Explains why OM OPEN MINDS was established and its vision for inclusive education.
* **Information Required from Client:** History of founding, founder's background, and institutional milestones.
* **Content Fields:**
  * `origin_narrative` (Text, required): Detailed founding history.
  * `guiding_philosophy` (Text, required): Evidence-based special education approach.
* **Dynamic Supabase Data:** Yes (`institutional_profile`).
* **Admin Manageability:** Yes.

#### 2.2 Multidisciplinary Team & Pedagogical Approach
* **Purpose:** Describes how special educators, speech therapists, occupational therapists, and counselors coordinate individual student growth.
* **Information Required from Client:** Descriptions of professional roles involved in daily student care (without listing personal private staff details if not desired).
* **Content Fields:**
  * `role_title` (String, required): e.g., "Specialized Special Educators", "Occupational & Sensory Therapists".
  * `role_description` (Text, required): Scope of support.
* **Dynamic Supabase Data:** Yes (`team_roles`).
* **Admin Manageability:** Yes.

#### 2.3 Individualized Education Plan (IEP) Framework
* **Purpose:** Demystifies the IEP process for parents, explaining how individualized goals are co-created, monitored, and reviewed.
* **Information Required from Client:** The school's actual IEP review cadence (e.g., quarterly goals, parent consultations).
* **Content Fields:**
  * `iep_overview` (Text, required).
  * `step_points` (Array of Strings, required): Key stages of IEP execution.
* **Dynamic Supabase Data:** No (Static pedagogical framework).
* **Admin Manageability:** Yes.

#### 2.4 Governance, Certifications & Safety Standards
* **Purpose:** Details legal registration, trust backing, physical fire/child safety standards, and educator qualifications.
* **Information Required from Client:** Registration details, society/trust certificates, safety compliance protocols.
* **Content Fields:**
  * `registration_number` (String, required).
  * `compliance_highlights` (Array of Strings, required).
* **Dynamic Supabase Data:** Yes (`milestones`).
* **Admin Manageability:** Yes.

---

### Page 3: Educational Programmes Page (`/programmes`)
* **Primary Title (`h1`):** "Educational Programmes & Learning Pathways"
* **Target Audience:** Parents looking for the specific developmental curriculum appropriate for their child's stage of development.

#### Sections Breakdown:

#### 3.1 Learning Pathways Introduction
* **Purpose:** Clarifies that programmes are organized by developmental readiness and individual goals rather than rigid age or clinical labels.
* **Information Required from Client:** Introductory philosophy statement for curriculum.
* **Content Fields:**
  * `intro_text` (Text, required).
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** No.

#### 3.2 Dynamic Programmes Catalog
* **Purpose:** Structured cards detailing each learning pathway offered by the school.
* **Information Required from Client:**
  * Official names of each programme (e.g., Early Intervention, Primary Foundation, Intermediate Life Skills, Pre-Vocational Readiness).
  * Developmental milestones targeted.
  * Daily schedule / routine format.
  * Educator-to-student ratios per programme.
* **Content Fields (per programme):**
  * `id` (UUID, primary key).
  * `title` (String, required): e.g., "Early Learning & Intervention".
  * `slug` (String, unique, required).
  * `age_or_developmental_stage` (String, optional): e.g., "Ages 3–6 / Early Developmental".
  * `description` (Text, required): Detailed overview.
  * `core_curriculum_areas` (Array of Strings, required): e.g., ["Communication Skills", "Sensory Regulation", "Self-Help Activities"].
  * `display_order` (Integer, default: 0).
  * `is_active` (Boolean, default: true).
* **Dynamic Supabase Data:** Yes (`programmes`).
* **Admin Manageability:** Yes (Full CRUD: add new programmes, update curriculum areas, archive old ones).

#### 3.3 Programme Admissions Consultation Callout
* **Purpose:** Directs interested parents straight from a programme description to an admission consultation.
* **Content Fields:**
  * `cta_text` (String): "Not sure which programme is the right fit for your child? Schedule a personalized observation session."
  * `cta_button` (Link: `/admissions`).
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** No.

---

### Page 4: Campus & Facilities Page (`/facilities`)
* **Primary Title (`h1`):** "Campus Facilities & Specialized Infrastructure"
* **Target Audience:** Families assessing environmental safety, sensory friendliness, and physical accessibility.

#### Sections Breakdown:

#### 4.1 Accessibility & Safety Commitment Overview
* **Purpose:** Explains campus-wide safety standards (e.g., wheelchair ramps, round-edged furniture, soft safety flooring, controlled entry/exit).
* **Information Required from Client:** Full safety audit and accessibility checklist of the physical school building.
* **Content Fields:**
  * `safety_policy_summary` (Text, required).
  * `core_safety_features` (Array of Strings, required).
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** Yes.

#### 4.2 Dynamic Facilities Directory
* **Purpose:** Detailed directory of specialized rooms and outdoor learning zones.
* **Information Required from Client:**
  * Names and photographic assets for all rooms (Sensory Room, Speech Therapy, Occupational Therapy, Adaptive Computer Lab, Calm Down Room, Outdoor Sensory Garden).
  * Verifiable descriptive alt text for every image.
* **Content Fields (per facility):**
  * `id` (UUID, primary key).
  * `title` (String, required): Name of room.
  * `slug` (String, unique, required).
  * `category` (String, required): e.g., `'Sensory'`, `'Therapy'`, `'Recreation'`, `'Learning'`.
  * `description` (Text, required): Developmental benefits of the space.
  * `accessibility_highlights` (Array of Strings, optional): e.g., ["Sound-dampened acoustics", "Tactile stimulation wall"].
  * `image_url` (URL, required).
  * `image_alt` (String, required): Detailed screen-reader description.
  * `display_order` (Integer).
  * `is_active` (Boolean).
* **Dynamic Supabase Data:** Yes (`facilities`).
* **Admin Manageability:** Yes (Full CRUD with image upload and mandatory alt text validation).

---

### Page 5: Activities & Campus Life Page (`/activities`)
* **Primary Title (`h1`):** "Developmental & Extracurricular Activities"
* **Target Audience:** Parents looking for joyful, social, and creative enrichment opportunities for their child.

#### Sections Breakdown:

#### 5.1 Inclusive Socialization Ethos
* **Purpose:** Outlines how activities are adapted to individual sensory and physical comfort levels, ensuring no child is excluded.
* **Information Required from Client:** Philosophy on extracurricular and community life.
* **Content Fields:**
  * `ethos_paragraph` (Text, required).
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** No.

#### 5.2 Dynamic Activities Catalog
* **Purpose:** Categorized listings of activities (e.g., Adaptive Sports & Yoga, Music & Movement, Expressive Art & Pottery, Social Outings, Seasonal Celebrations).
* **Information Required from Client:** List of activities, frequencies, and photos.
* **Content Fields (per activity):**
  * `id` (UUID, primary key).
  * `title` (String, required).
  * `slug` (String, unique, required).
  * `description` (Text, required): How the activity benefits the student.
  * `frequency` (String, optional): e.g., "Weekly sessions".
  * `display_order` (Integer).
  * `is_active` (Boolean).
* **Dynamic Supabase Data:** Yes (`activities`).
* **Admin Manageability:** Yes (Full CRUD).

---

### Page 6: Photo & Media Gallery Page (`/gallery`)
* **Primary Title (`h1`):** "Campus Life & Student Moments"
* **Target Audience:** Prospective and current families seeking glimpses of daily activities and events.

#### Sections Breakdown:

#### 6.1 Media Accessibility Notice
* **Purpose:** Advises screen reader users that all media items contain detailed descriptive alternate text.
* **Content Fields:**
  * Accessible explanatory banner text.

#### 6.2 Filterable Media Gallery Grid
* **Purpose:** Visual gallery categorised by activity type (e.g., Campus Events, Classroom Learning, Art & Creativity, Sports).
* **Information Required from Client:**
  * High-resolution photographs accompanied by signed parental photo release forms.
  * Descriptive captions and alt text for each photograph.
* **Content Fields (per gallery item):**
  * `id` (UUID, primary key).
  * `title` (String, required): Caption or event title.
  * `alt_text` (String, required): Comprehensive descriptive alt text.
  * `image_url` (URL, required).
  * `category` (String, optional): Filter tag (e.g., "Arts", "Campus", "Events").
  * `is_published` (Boolean, default: true).
  * `display_order` (Integer).
* **Dynamic Supabase Data:** Yes (`gallery_items`).
* **Admin Manageability:** Yes (Upload to Supabase Storage, caption, categorize, and enforce alt text).

---

### Page 7: Admissions & Consultation Page (`/admissions`)
* **Primary Title (`h1`):** "Admissions & Developmental Consultation"
* **Target Audience:** Families ready to initiate enrollment or explore whether OM OPEN MINDS is the right educational home for their child.

#### Sections Breakdown:

#### 7.1 Reassuring 3-Step Admissions Process
* **Purpose:** Replaces intimidating collegiate entrance hurdles with a supportive, pressure-free consultation framework.
* **Information Required from Client:** Verification of actual steps in their admissions pipeline.
* **Content Fields:**
  * `step_1_title`: "Initial Parent Consultation & Discovery Call"
  * `step_1_desc`: Informal conversation to understand your child's personality, interests, and needs.
  * `step_2_title`: "Gentle Campus Observation & Readiness Visit"
  * `step_2_desc`: A warm, pressure-free visit allowing the child to explore sensory rooms and interactive spaces.
  * `step_3_title`: "Collaborative IEP & Enrollment Roadmap"
  * `step_3_desc`: Faculty and parents sit together to define tailored developmental goals and a phased schedule.
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** Yes (Via site settings).

#### 7.2 Accessible Admissions Inquiry Form
* **Purpose:** Captures confidential inquiry information directly into the Supabase database.
* **Information Required from Client:** Mandatory vs. optional inquiry questions; confirmation email recipient.
* **Content Fields:**
  * `parent_name` (String, required, min 2 chars): Full name of parent/guardian.
  * `email` (Email string, required): Valid email address.
  * `phone` (Phone string, required): Primary contact number.
  * `child_name` (String, required): Child's first name.
  * `child_age` (Number, optional): Age in years.
  * `notes` (Text, optional): Any specific comments, interests, or questions the family wishes to share.
* **Dynamic Supabase Data:** Yes (Inserts directly into `admissions_inquiries`).
* **Admin Manageability:** Yes (Admins receive, review, and manage inquiry statuses in the Admin Dashboard).

#### 7.3 Admissions FAQ Accordion
* **Purpose:** Answers common parent questions (e.g., student-to-teacher ratio, mid-term admissions, transportation availability, fee transparency).
* **Information Required from Client:** 5–8 common parent questions and official answers.
* **Content Fields:**
  * `question` (String, required).
  * `answer` (Text, required).
* **Dynamic Supabase Data:** Yes (`admissions_faqs`).
* **Admin Manageability:** Yes.

---

### Page 8: Contact Us Page (`/contact`)
* **Primary Title (`h1`):** "Contact OM OPEN MINDS"
* **Target Audience:** Parents scheduling visits, allied medical professionals, community partners, and general inquiries.

#### Sections Breakdown:

#### 8.1 Campus Location & Physical Accessibility Directions
* **Purpose:** Transparent directions ensuring visitors with wheelchairs, mobility aids, or sensory sensitivities can navigate easily to campus.
* **Information Required from Client:**
  * Full physical postal address and prominent landmark cues.
  * Specific barrier-free access details (e.g., "Ramp entrance on South Gate, elevator access to 1st floor").
  * Nearest public transport stops.
* **Content Fields:**
  * `address_line_1`, `address_line_2`, `city`, `pincode`.
  * `accessibility_navigation_guidelines` (Text, required).
  * `google_maps_embed_url` (URL, optional).
* **Dynamic Supabase Data:** No (Configured in global constants).
* **Admin Manageability:** Yes (Settings).

#### 8.2 Direct Communication Channels
* **Purpose:** Phone numbers, visiting hours, and emails.
* **Information Required from Client:** General office line, admissions line, email address, visiting consultation hours.
* **Content Fields:**
  * `primary_phone` (String, required).
  * `admissions_helpline` (String, optional).
  * `office_email` (String, required).
  * `visiting_hours` (String, required): e.g., "Mon–Fri: 9:00 AM – 3:00 PM (By appointment)".
* **Dynamic Supabase Data:** No.
* **Admin Manageability:** Yes.

#### 8.3 Accessible Contact Message Form
* **Purpose:** Allows visitors to send general messages directly to school staff.
* **Content Fields:**
  * `name` (String, required).
  * `email` (String, required).
  * `phone` (String, optional).
  * `subject` (String, required).
  * `message` (Text, required).
* **Dynamic Supabase Data:** Yes (Inserts into `contact_messages`).
* **Admin Manageability:** Yes (Admin inbox).

---

## 3. Administrative Portal Specifications

---

### Page 9: Admin Login (`/admin/login`)
* **Primary Title (`h1`):** "OM OPEN MINDS — Administrative Portal"
* **Target Audience:** School administrators, special education directors, and authorized staff.
* **Functional Requirements:**
  * Connected directly to Supabase Auth via `supabase.auth.signInWithPassword`.
  * Form inputs have explicit labels and ARIA live regions for submission feedback.
  * Rate-limited and protected against brute-force attacks via Supabase Auth policies.
  * No fictitious or hardcoded administrator accounts.

---

### Page 10: Admin Dashboard Overview (`/admin/dashboard`)
* **Primary Title (`h1`):** "Administrative Dashboard"
* **Target Audience:** Authenticated administrators.
* **Functional Requirements:**
  * Protected via `ProtectedRoute` component; unauthenticated requests redirect to `/admin/login`.
  * Real-time metrics overview:
    * Total new admissions inquiries (status: `pending`).
    * Unread contact messages (status: `unread`).
    * Total published programmes, facilities, and gallery media.
  * Navigation links to management modules:
    * **Inquiries Hub:** Reviewing, updating status (`pending` $\rightarrow$ `contacted` $\rightarrow$ `scheduled`), and logging notes for admissions.
    * **Announcements Hub:** Adding urgent tickers, scheduling term dates.
    * **Content Hub:** Managing programmes, facilities, activities, and gallery media.
  * Row Level Security (RLS) guarantees that only authenticated users with an active `admin_profiles` record can view or mutate records.

