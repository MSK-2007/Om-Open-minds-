# OM OPEN MINDS — Comprehensive Content Requirements Specification

> **Document:** `docs/content-requirements.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Phase:** Phase 2 Content Requirements Baseline  
> **Status:** Detailed Section-by-Section Data Dictionary

---

## 1. Architectural & Compliance Standards

For every page and section defined below:
1. **No Invented School Data:** Where actual copy or clinical information is not yet provided by the client, clearly marked placeholders (e.g., `[CLIENT_SUPPLIED_VALUE]`) are utilized.
2. **Child Privacy Mandate:** No sensitive diagnostic, medical, or unconsented photographic data is required or requested.
3. **Static vs. Dynamic Classification:** Content is explicitly categorized as **Static** (code-managed constants for high stability) or **Dynamic** (Supabase-backed for non-technical administrator maintenance).
4. **Accessibility Compliance:** Every section enforces WCAG 2.2 AA conventions, including semantic HTML landmarks, explicit ARIA descriptions, and focus management.

---

## 2. Page-by-Page Content Specifications

---

### Page 1: Home (`/`)

#### A. Page Objective
Welcome prospective families, provide immediate emotional reassurance of their child's worth, present urgent school updates, showcase core differentiators, and provide clear routes to consultative admissions.

#### B. Sections Required
1. **Hero & Positioning Banner**
2. **Urgent Parent Notices Ticker**
3. **Institutional Overview & Mission Snapshot**
4. **Core Pillars ("Why OM OPEN MINDS")**
5. **Programmes Pathways Teaser**
6. **Campus Facilities Snapshot**
7. **Leadership Welcome Desk**
8. **Developmental Activities Highlights**
9. **Parent Voices & Testimonials**
10. **Consultation CTA Banner**

#### C. Information Required from School
* Approved tagline and hero headline.
* Reassuring 2–3 sentence school positioning statement.
* 4–6 core institutional pillars (e.g., low student-to-teacher ratio, certified multidisciplinary team).
* Current operational announcements or admission schedule.
* Director's welcome statement, qualifications, and formal portrait.
* 2–3 verified parent testimonials (with photo/anonymity consent).

#### D. Content Fields & Data Types
* `hero_title` (String, required): Institutional headline.
* `hero_subtitle` (Text, required): Mission positioning.
* `primary_cta_text` (String, default: "Schedule a Consultation").
* `announcements` (Array of objects, dynamic): `{ id, title, category, link_url, is_active }`.
* `pillars` (Array of objects, dynamic): `{ id, title, description, icon_token, order }`.
* `director_message_summary` (Text, required): Condensed welcome note.
* `testimonials` (Array of objects, dynamic): `{ id, author_title, quote_text, student_growth_note }`.

#### E. Images or Media Required
* High-resolution, calming hero banner photograph (featuring school grounds or learning spaces).
* Professional portrait photograph of the School Director.
* Descriptive alternative text for every visual asset.

#### F. Classification & Admin Editability
* **Classification:** Hybrid (Static layout shell + Dynamic Supabase feed for announcements, pillars, testimonials).
* **Admin Editable:** Yes (Announcements, hero copy, testimonials, and pillars managed via `/admin/dashboard`).

#### G. Accessibility Requirements
* Skip link targets `#main-content` directly before navigation.
* Announcements ticker supports pausing on focus/hover and uses `aria-live="polite"`.
* Strict heading hierarchy (`h1` for hero, `h2` for section titles, `h3` for cards).

---

### Page 2: About Us (`/about`)

#### A. Page Objective
Articulate the institution's founding story, long-term vision, core mission, pedagogical philosophy, and legal/governance framework.

#### B. Sections Required
1. **Founding Story & Heritage**
2. **Vision and Mission Statements**
3. **Pedagogical Philosophy (Dignity & Individualized Growth)**
4. **Institutional Governance & Society/Trust Credentials**
5. **Safety, Child Protection & Compliance Standards**

#### C. Information Required from School
* Founding year, history, and founder's inspiration.
* Formal, approved Vision and Mission statements.
* Trust/Society registration details and legal governance structure.
* Official child protection policy summary and campus safety guidelines.

#### D. Content Fields & Data Types
* `about_heading` (String): e.g., "About OM OPEN MINDS".
* `founding_story` (Text, required): Detailed narrative of school origins.
* `vision_statement` (Text, required): Long-term societal and educational vision.
* `mission_statement` (Text, required): Core daily operational mission.
* `core_values` (Array of Strings, required): 4–6 foundational principles.
* `governance_details` (Text, required): Registration number, governing board overview.
* `safety_certifications` (Array of Strings, optional): Fire, health, and child safeguarding standards.

#### E. Images or Media Required
* Historic or campus milestone photos.
* Official logo of the governing trust or society (if applicable).

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `institutional_profile`).
* **Admin Editable:** Yes (Admin can update mission, vision, and governance text).

#### G. Accessibility Requirements
* Clear sub-navigation anchors (`#story`, `#vision-mission`, `#governance`).
* Landmark sections using `<section aria-labelledby="...">`.

---

### Page 3: Our Programmes (`/programmes`)

#### A. Page Objective
Present the school's educational pathways clearly, structured by developmental readiness rather than rigid age brackets or standard academic grades.

#### B. Sections Required
1. **Curriculum & Developmental Pathways Overview**
2. **Programmes Catalog (Grid of Developmental Stages)**
   * Stage 1: Early Intervention & Development
   * Stage 2: Primary Foundation
   * Stage 3: Functional Academics & Life Skills
   * Stage 4: Pre-Vocational Readiness & Transition
3. **Daily Routine & Session Format Explanation**
4. **Consultation & Assessment CTA**

#### C. Information Required from School
* Exact names and developmental criteria for each programme offered.
* Core curriculum focus areas per programme (e.g., communication, sensory regulation, self-help, basic literacy/numeracy).
* Typical educator-to-student ratio per group.
* Daily routine format (e.g., morning circle, sensory breaks, individualized table work).

#### D. Content Fields & Data Types (per Programme)
* `id` (UUID, primary key).
* `title` (String, required): e.g., "Early Learning & Intervention".
* `slug` (String, unique, required).
* `stage_description` (String, required): e.g., "Foundational Developmental Stage".
* `target_readiness` (String, optional): Description of who this programme supports.
* `curriculum_highlights` (Array of Strings, required): 4–6 core developmental targets.
* `educator_ratio` (String, optional): e.g., "1 educator to 3 students".
* `display_order` (Integer, default: 0).
* `is_active` (Boolean, default: true).

#### E. Images or Media Required
* Non-identifying or consented photographs showing classroom activity for each stage.
* Mandatory descriptive alt text for each image.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `programmes`).
* **Admin Editable:** Yes (Full CRUD: add, edit, reorder, or archive programmes via admin).

#### G. Accessibility Requirements
* Semantic card markup using `<h3>` for programme names.
* Clear list formatting (`<ul>`, `<li>`) for curriculum highlights.

---

### Page 4: Our Approach (`/our-approach`)

#### A. Page Objective
Explain the evidence-based, compassionate methodology that sets OM OPEN MINDS apart, reassuring parents regarding how their child will be educated, supported, and respected.

#### B. Sections Required
1. **Individualized Education Plan (IEP) Framework**
2. **Multidisciplinary Collaborative Care Model**
3. **Sensory Regulation & Emotional Co-Regulation**
4. **Dignity-First & Child-Paced Learning Philosophy**
5. **Parent Partnership & Regular Milestone Review Cadence**

#### C. Information Required from School
* The school's specific IEP formulation and quarterly review process.
* How allied therapists (Speech, OT, Behavior) coordinate with classroom special educators.
* School's sensory regulation protocols (sensory diet, quiet zones, movement breaks).
* Milestone reporting frequency to parents.

#### D. Content Fields & Data Types
* `approach_title` (String): e.g., "Our Pedagogical Approach".
* `iep_framework_narrative` (Text, required): Detailed explanation of IEP creation.
* `iep_steps` (Array of objects, required): `{ step_number, title, description }`.
* `multidisciplinary_model_summary` (Text, required).
* `sensory_philosophy` (Text, required).
* `parent_involvement_model` (Text, required).

#### E. Images or Media Required
* Diagram or visual flow chart explaining the IEP lifecycle (with full text transcript).
* Photographs of collaborative learning environments.

#### F. Classification & Admin Editability
* **Classification:** Static core framework with dynamic text configurable in `site_content`.
* **Admin Editable:** Yes.

#### G. Accessibility Requirements
* Complex diagrams MUST include complete HTML descriptive text alternatives.
* Steps formatted with semantic `<ol>` ordered lists.

---

### Page 5: Campus Facilities (`/facilities`)

#### A. Page Objective
Showcase the physical safety, barrier-free access, and specialized therapeutic infrastructure of the school campus.

#### B. Sections Required
1. **Barrier-Free & Safe Campus Commitment**
2. **Facilities Directory (Filterable by Category: Sensory, Therapy, Classroom, Recreation)**
3. **Safety & Hygiene Standards Checklist**
4. **Campus Visit Scheduling Callout**

#### C. Information Required from School
* Complete list of specialized facilities (e.g., Sensory Integration Room, Speech & Occupational Therapy Rooms, Calm-Down Room, Adaptive Playground, Accessible Washrooms).
* Verification of accessibility features (e.g., ramp inclines, grab rails, non-toxic padded floors, adjustable lighting).
* High-resolution photographs of each facility.

#### D. Content Fields & Data Types (per Facility)
* `id` (UUID, primary key).
* `title` (String, required): Facility name.
* `slug` (String, unique, required).
* `category` (Enum: `'Sensory'`, `'Therapy'`, `'Learning'`, `'Recreation'`).
* `description` (Text, required): Developmental purpose and equipment.
* `accessibility_features` (Array of Strings, required): e.g., ["Wheelchair Accessible", "Adjustable Luminescence"].
* `image_url` (URL, required).
* `image_alt` (String, required): Detailed descriptive alt text.
* `display_order` (Integer).
* `is_active` (Boolean).

#### E. Images or Media Required
* Professional photographs of each room with good lighting and clear spatial views.
* Mandatory descriptive alt text describing room layout, equipment, and safety features.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `facilities`).
* **Admin Editable:** Yes (Full CRUD with image upload and mandatory alt text validation).

#### G. Accessibility Requirements
* Filtering controls implemented as accessible button groups with `aria-pressed`.
* Cards maintain consistent tab order and focus rings.

---

### Page 6: Our Team (`/our-team`)

#### A. Page Objective
Introduce the school's leadership, certified special educators, allied developmental therapists, and support staff to establish professional trust.

#### B. Sections Required
1. **Leadership Desk & Special Education Directorship**
2. **Specialized Educators Directory**
3. **Allied Developmental Specialists (Speech, OT, Psychology)**
4. **Continuous Professional Training & Safeguarding Standards**

#### C. Information Required from School
* Names, designations, qualifications, and professional registrations (e.g., RCI certification or equivalent) for faculty.
* Staff roles and brief professional bios.
* Professional portrait photos (with staff publication consent).

#### D. Content Fields & Data Types (per Team Member)
* `id` (UUID, primary key).
* `full_name` (String, required): e.g., "[CLIENT_SUPPLIED_STAFF_NAME]".
* `role_title` (String, required): e.g., "Senior Special Educator".
* `department` (Enum: `'Leadership'`, `'Special Education'`, `'Therapy'`, `'Support'`).
* `qualifications` (String, required): Formal degrees and certifications.
* `bio` (Text, required): 2–3 sentences on background and passion.
* `photo_url` (URL, optional).
* `photo_alt` (String, required if photo present).
* `display_order` (Integer).
* `is_active` (Boolean).

#### E. Images or Media Required
* Standardized, high-resolution portrait photos of staff members.
* Non-photo fallback avatars with accessible initials for staff without photos.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `team_members`).
* **Admin Editable:** Yes (Full CRUD via admin dashboard).

#### G. Accessibility Requirements
* Staff cards use `<h3>` for names and `<p>` for roles.
* Qualifications clearly delineated without excessive abbreviations.

---

### Page 7: Activities & Events (`/activities`)

#### A. Page Objective
Demonstrate that student life at OM OPEN MINDS includes joyful recreation, creative arts, adaptive movement, and inclusive social celebrations.

#### B. Sections Required
1. **Inclusive Extracurricular Philosophy**
2. **Weekly Enrichment Activities (Arts, Music, Movement)**
3. **Campus Events & Community Inclusion Calendar**
4. **Recent Activities Highlights**

#### C. Information Required from School
* List of weekly activities (e.g., Music & Rhythm, Adaptive Yoga, Expressive Art, Sensory Gardening).
* Upcoming annual events calendar (e.g., Sports Day, Inclusion Celebration, Parent Workshops).
* Activity frequency, duration, and adaptive accommodations.

#### D. Content Fields & Data Types (per Activity/Event)
* `id` (UUID, primary key).
* `title` (String, required): Name of activity.
* `type` (Enum: `'Regular Activity'`, `'Upcoming Event'`, `'Past Milestone'`).
* `description` (Text, required): Benefits and execution.
* `event_date` (Date, optional: for scheduled events).
* `frequency` (String, optional: e.g., "Every Tuesday & Thursday").
* `image_url` (URL, optional).
* `image_alt` (String, required if image present).
* `is_active` (Boolean).

#### E. Images or Media Required
* Consented photographs of activities, student artwork, or campus celebrations.
* Mandatory descriptive alt text.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `activities`).
* **Admin Editable:** Yes (Full CRUD: add events, set dates, upload photos).

#### G. Accessibility Requirements
* Event dates formatted semantically with `<time datetime="YYYY-MM-DD">`.
* Category filters operable by keyboard.

---

### Page 8: Media Gallery (`/gallery`)

#### A. Page Objective
Provide a curated, accessible visual record of campus facilities, student projects, and events while strictly upholding child privacy rights.

#### B. Sections Required
1. **Child Privacy & Consent Disclosure Banner**
2. **Category Filter Bar (Campus Spaces, Activities, Creative Works)**
3. **Accessible Photographic Grid**
4. **Modal Lightbox with Full Descriptive Text**

#### C. Information Required from School
* High-resolution photographs with verified parental publication consent.
* Detailed descriptive alt text for every single photograph.
* Category assignments for each photo.

#### D. Content Fields & Data Types (per Media Item)
* `id` (UUID, primary key).
* `title` (String, required): Public caption.
* `category` (Enum: `'Campus Facilities'`, `'Classroom Moments'`, `'Creative Arts'`, `'Celebrations'`).
* `image_url` (URL, required): Supabase Storage asset URL.
* `image_alt` (String, required): Comprehensive descriptive alt text.
* `has_parental_consent` (Boolean, required, admin-only): Consent verification flag.
* `display_order` (Integer).
* `is_published` (Boolean, default: true).

#### E. Images or Media Required
* Curated photo set (JPG, WebP, PNG). Maximum file size: 2MB per image.
* No uncaptioned or unverified student imagery permitted.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `gallery_items` + Supabase Storage bucket: `gallery-media`).
* **Admin Editable:** Yes (Full CRUD with mandatory alt-text and consent checkbox).

#### G. Accessibility Requirements
* Lightbox modal implements focus trapping (`FocusTrap`) and keyboard Escape key closure.
* Screen reader receives image title and alt description immediately upon expansion.

---

### Page 9: Admissions (`/admissions`)

#### A. Page Objective
Demystify the admission journey for parents, clearly explain the consultative evaluation process, answer common questions, and provide a secure, confidential inquiry form.

#### B. Sections Required
1. **The 3-Step Consultative Admission Journey**
2. **Confidential Admissions Inquiry Form**
3. **What to Expect During the Campus Observation Visit**
4. **Admissions FAQs Accordion**

#### C. Information Required from School
* School's approved 3-step admission journey copy.
* Clear criteria for eligibility and age readiness.
* 5–8 common admissions questions and official answers.
* Confirmation email and office contact for admissions notifications.

#### D. Content Fields & Data Types
* **Admissions Inquiry Form Fields:**
  * `parent_name` (String, required, min 2 chars): Parent/Guardian full name.
  * `email` (Email string, required): Primary contact email.
  * `phone` (Phone string, required): Primary contact telephone.
  * `child_name` (String, required): Child's first name.
  * `child_age` (Number, optional): Age in years.
  * `preferred_program` (String, optional): Selected learning pathway.
  * `notes` (Text, optional): General comments or scheduling preferences.
  * *(STRICT RULE: Medical diagnoses, clinical assessments, or disability specifics are NOT collected on this public web form).*
* **Admissions FAQs Fields (per FAQ):**
  * `question` (String, required).
  * `answer` (Text, required).
  * `display_order` (Integer).

#### E. Images or Media Required
* Visual diagram or icon representations of the 3-step process.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Form submissions stored in `admissions_inquiries`; FAQs in `admissions_faqs`).
* **Admin Editable:** Yes (Admins manage inquiries in back-office; edit FAQs).

#### G. Accessibility Requirements
* All form inputs explicitly linked via `<label htmlFor="...">`.
* Inline validation errors linked via `aria-describedby` and announced via `role="alert"`.
* FAQ accordion implemented with native accessible disclosure patterns (`<button aria-expanded="...">`).

---

### Page 10: Parent Resources (`/parent-resources`)

#### A. Page Objective
Serve as an ongoing functional utility hub for enrolled and prospective families, providing term schedules, downloadable guides, home support strategies, and community links.

#### B. Sections Required
1. **Academic & Term Calendars (Downloadable PDFs & Listed Dates)**
2. **Home Support & Sensory Guidance Articles**
3. **Parent Guidelines & School Timings**
4. **Community & Allied Support Directory**

#### C. Information Required from School
* Current academic year term dates and holiday schedule.
* Approved downloadable PDF resources (e.g., School Calendar, Parent Handbook).
* 3–4 practical home routine articles or tip sheets written or vetted by the school.

#### D. Content Fields & Data Types (per Resource)
* `id` (UUID, primary key).
* `title` (String, required): e.g., "Academic Calendar 2026–2027".
* `category` (Enum: `'Calendar'`, `'Parent Guide'`, `'Sensory Tip Sheet'`).
* `description` (Text, required): Summary of content.
* `file_url` (URL, optional: for downloadable PDF).
* `external_url` (URL, optional: for helpful community link).
* `display_order` (Integer).
* `is_active` (Boolean).

#### E. Images or Media Required
* Accessible document icons (e.g., PDF icon token with text alternative).

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Supabase table: `parent_resources`).
* **Admin Editable:** Yes (Upload new PDFs, add guide links, edit calendar dates).

#### G. Accessibility Requirements
* All downloadable files must clearly state format and file size (e.g., "[PDF, 250 KB]").
* Text articles formatted with clear headings and high-contrast typography.

---

### Page 11: Contact Us (`/contact`)

#### A. Page Objective
Deliver complete, practical campus location directions, explicit barrier-free arrival guidance, direct telephone/email channels, and a general inquiry form.

#### B. Sections Required
1. **Campus Location & Barrier-Free Navigation Guide**
2. **Direct Telephone & Operating Hours**
3. **General Contact Message Form**
4. **Interactive Accessible Map Embed**

#### C. Information Required from School
* Full postal address and landmark directions.
* Specific physical accessibility navigation directions (ramp access location, accessible visitor parking, elevator guidance).
* Office telephone numbers, email addresses, and visiting consultation hours.

#### D. Content Fields & Data Types
* **Contact Location Details:**
  * `address_line_1`, `address_line_2`, `city`, `pincode`.
  * `accessibility_navigation_note` (Text, required).
  * `visiting_hours` (String, required): e.g., "Monday – Friday: 9:00 AM – 3:30 PM (By appointment)".
  * `primary_phone` (String, required).
  * `office_email` (String, required).
* **Contact Form Fields:**
  * `name` (String, required, min 2 chars).
  * `email` (Email string, required).
  * `phone` (Phone string, optional).
  * `subject` (String, required).
  * `message` (Text, required, min 10 chars).

#### E. Images or Media Required
* Campus exterior photograph showing the accessible entrance ramp.
* Accessible map view with clear contrast.

#### F. Classification & Admin Editability
* **Classification:** Dynamic (Messages stored in `contact_messages`; contact info in `site_settings`).
* **Admin Editable:** Yes (Manage messages inbox in back-office; edit phone/hours).

#### G. Accessibility Requirements
* Accessible form controls with error validation and live region announcements.
* Map embedded with descriptive `title="OM OPEN MINDS Campus Location"`.

