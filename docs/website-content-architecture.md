# OM OPEN MINDS — Website Content Architecture

> **Document:** `docs/website-content-architecture.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Disabilities)  
> **Phase:** Phase 1 Architectural Blueprint  
> **Status:** Specification Ready for Client Content Collection

---

## 1. Overview & Information Flow Strategy

The content architecture for OM OPEN MINDS establishes a reassuring, transparent, and structured information pathway for families of children with diverse learning needs. 

The website addresses three distinct audience journeys:
1. **Prospective Parents & Guardians:** Seeking an empathetic, capable, and safe learning environment; requiring clear programme understanding and an accessible consultation process.
2. **Current Families & Community:** Seeking daily/term announcements, calendar milestones, event photo highlights, and direct administrative communication.
3. **Special Education Professionals & Regulatory Bodies:** Seeking institutional credentials, pedagogical philosophy, compliance, and governance.

---

## 2. Global Site Taxonomy & Navigation Hierarchy

```
[OM OPEN MINDS Global Taxonomy]
│
├── Top Accessibility & Utility Bar
│   ├── Skip to Main Content Anchor (#main-content)
│   ├── Text Size & Contrast Toggles (WCAG 2.1 AA)
│   ├── Emergency / Help Hotline Contact
│   └── Admin Portal Access Link (/admin/login)
│
├── Primary Header & Navigation Landmark
│   ├── Institution Logo & Name (/ )
│   ├── Home (/)
│   ├── About Us (/about)
│   ├── Programmes (/programmes)
│   ├── Facilities (/facilities)
│   ├── Activities (/activities)
│   ├── Gallery (/gallery)
│   ├── Admissions (/admissions)
│   ├── Contact (/contact)
│   └── "Schedule Consultation" Primary CTA Button (/admissions#inquiry-form)
│
├── Page Main Landmark (<main id="main-content">)
│   └── [Page-Specific Sequenced Sections]
│
└── Institutional Footer Landmark (<footer>)
    ├── Institution Overview & Mission Statement
    ├── Quick Navigation Links
    ├── Physical Address & Accessibility Access Notes (Ramps, Parking)
    ├── Direct Contact Channels (Phone, Email, Visiting Hours)
    ├── Statutory & Policy Links (Child Protection, Privacy, Accessibility Statement)
    └── Copyright & Technical Foundation Notice
```

---

## 3. Homepage Content Sequence

The homepage sequence is engineered to guide parents from immediate reassurance to actionable consultation:

```
[Homepage Sequence]
├── Section 1: Hero & Institutional Positioning Banner
├── Section 2: Announcements & Parent Circulars Ticker
├── Section 3: Institutional Introduction & Educational Ethos
├── Section 4: Core Pillars / Why OM OPEN MINDS
├── Section 5: Educational Programmes & Learning Pathways
├── Section 6: Specialized Facilities & Adaptive Infrastructure
├── Section 7: Leadership Desk / Director's Welcome
├── Section 8: Developmental Activities & Campus Life
├── Section 9: Family Voices & Testimonials
├── Section 10: Milestones, Accreditations & Recognitions
└── Section 11: Consultative Admissions Call-to-Action
```

---

## 4. Comprehensive Section Specifications

Below is the exhaustive specification for every homepage and global architectural section.

---

### Section 1: Top Accessibility & Utility Bar
* **Purpose:** Ensures instant compliance with accessibility guidelines (WCAG 2.1 AA) and provides immediate access to emergency contacts and administrative access without cluttering the primary header.
* **Information Required from Client:**
  * Emergency telephone number / parent helpline.
  * Direct office operating hours for telephone inquiries.
* **Content Fields:**
  * `emergency_phone` (String, required): Public hotline telephone number.
  * `office_hours_summary` (String, optional): e.g., "Mon-Fri: 8:30 AM – 3:30 PM".
  * `admin_link_label` (String, default: "Staff Portal"): Label for administrative access.
* **Dynamic Supabase Data:** No (Configured in global constants or site settings table).
* **Admin Manageability:** Optional (Managed via site settings).

---

### Section 2: Primary Header & Navigation Landmark
* **Purpose:** Provides consistent, accessible, and intuitive wayfinding across all pages with zero cognitive overload.
* **Information Required from Client:**
  * Official institution name formatting and tagline.
  * High-resolution accessible SVG logo (and dark/light contrast variants).
* **Content Fields:**
  * `institution_name` (String, required): "OM OPEN MINDS".
  * `tagline` (String, required): Institutional motto or descriptor.
  * `logo_image_url` (URL, required): Asset path to scalable vector logo.
  * `logo_alt_text` (String, required): Descriptive screen-reader text.
  * `navigation_items` (Array of objects, required): Array of `{ label: string, path: string }`.
  * `cta_button_text` (String, default: "Consultation Request").
* **Dynamic Supabase Data:** No (Static route taxonomy; CTA destination link configured).
* **Admin Manageability:** No (Hardcoded routes ensure zero broken links).

---

### Section 3: Hero & Institutional Positioning Banner
* **Purpose:** Serves as the initial emotional and intellectual touchpoint. Affirms the school's commitment to nurturing children with special needs, validating parental trust immediately upon landing.
* **Information Required from Client:**
  * Primary hero headline and reassuring secondary subheadline.
  * High-quality, authentic photographs of the learning environment (or accessible structural placeholder until supplied).
  * Direct call-to-action button destinations.
* **Content Fields:**
  * `hero_title` (String, required): Main positioning statement (e.g., affirming individual potential).
  * `hero_subtitle` (Text, required): 2–3 sentences articulating individualized care and developmental pedagogy.
  * `primary_cta_label` (String, required): e.g., "Schedule a Consultation".
  * `primary_cta_url` (String, required): Target route (`/admissions`).
  * `secondary_cta_label` (String, optional): e.g., "Explore Programmes".
  * `secondary_cta_url` (String, optional): Target route (`/programmes`).
  * `hero_image_url` (URL, optional): Main photographic banner.
  * `hero_image_alt` (String, required if image present): Detailed descriptive alt text.
* **Dynamic Supabase Data:** Yes (Allows non-technical updates to seasonal messaging).
* **Admin Manageability:** Yes (Managed via Admin Dashboard under "Site Content > Hero").

---

### Section 4: Announcements & Parent Circulars Ticker
* **Purpose:** Displays high-priority, time-sensitive operational notices (e.g., admission dates, parent workshops, term schedules, holiday closures) with accessible screen-reader live region support.
* **Information Required from Client:**
  * Initial batch of operational notices or circulars.
  * Notice categorization rules (e.g., General Notice, Urgent Alert, Calendar Update).
* **Content Fields:**
  * `id` (UUID, auto-generated): Unique identifier.
  * `title` (String, required): Concise announcement headline.
  * `content` (Text, optional): Full detail or description.
  * `category` (Enum, required): `'general'` | `'urgent'` | `'admissions'` | `'event'`.
  * `link_url` (URL or internal path, optional): Target link for more details or downloadable PDF.
  * `is_active` (Boolean, default: true): Visibility flag.
  * `display_order` (Integer, default: 0): Sequence ranking.
  * `publish_date` (Date, required): Timestamp for publication.
  * `expiration_date` (Date, optional): Date when the alert automatically archives.
* **Dynamic Supabase Data:** Yes (Supabase table: `announcements`).
* **Admin Manageability:** Yes (Full CRUD via Admin Dashboard: add, edit, archive, toggle priority).

---

### Section 5: Institutional Introduction & Educational Ethos
* **Purpose:** Introduces the school's origin, founding purpose, and multidisciplinary methodology, replacing mainstream collegiate claims with empathetic, evidence-based developmental principles.
* **Information Required from Client:**
  * School establishment background and founder's inspiration.
  * Core mission and vision statements.
  * Overview of the multidisciplinary philosophy (how educators, therapists, and parents collaborate).
* **Content Fields:**
  * `section_heading` (String, required): e.g., "About OM OPEN MINDS".
  * `mission_statement` (Text, required): Clear declaration of institutional purpose.
  * `vision_statement` (Text, required): Long-term vision for student independence and community integration.
  * `philosophy_summary` (Text, required): Detailed paragraph explaining the child-centered, dignity-first educational approach.
  * `key_highlights` (Array of Strings, optional): 3–4 bulleted highlights (e.g., individualized pacing, multidisciplinary approach).
* **Dynamic Supabase Data:** Yes (Supabase table: `institutional_profile`).
* **Admin Manageability:** Yes (Managed via Admin Dashboard).

---

### Section 6: Core Pillars / "Why OM OPEN MINDS"
* **Purpose:** Answers prospective parents' primary questions regarding why this institution is equipped to support their child's specific developmental trajectory.
* **Information Required from Client:**
  * 4–6 core differentiators (e.g., low educator-to-student ratios, specialized and certified staff, adaptive campus infrastructure, individualized education programs).
  * Supporting descriptions for each pillar.
* **Content Fields:**
  * `id` (UUID, auto-generated): Unique identifier.
  * `pillar_title` (String, required): e.g., "Individualized Education Plans (IEP)".
  * `pillar_description` (Text, required): 2–3 sentences explaining how this benefits the learner.
  * `icon_key` (String, required): Semantic icon token identifier.
  * `display_order` (Integer, default: 0): Sequence priority.
* **Dynamic Supabase Data:** Yes (Supabase table: `core_pillars`).
* **Admin Manageability:** Yes (Add, edit, reorder pillars via Admin Dashboard).

---

### Section 7: Educational Programmes & Learning Pathways
* **Purpose:** Presents the school's educational and developmental pathways clearly and reassurance-first, avoiding rigid clinical labeling or medicalized jargon.
* **Information Required from Client:**
  * Authentic list of programmes offered (e.g., Early Intervention, Primary Foundation, Functional Life Skills, Pre-Vocational Readiness).
  * Target age brackets or developmental stages for each.
  * Key learning focus areas and developmental goals per programme.
* **Content Fields:**
  * `id` (UUID, auto-generated): Primary key.
  * `title` (String, required): Name of the programme (e.g., "Early Learning & Intervention").
  * `slug` (String, unique, required): URL-friendly slug (e.g., `early-learning-intervention`).
  * `age_or_stage` (String, optional): Target age range or developmental stage description.
  * `description` (Text, required): Summary of curriculum approach.
  * `key_goals` (Array of Strings, optional): Specific milestone goals (e.g., communication, motor skills, social interaction).
  * `display_order` (Integer, default: 0): Sorting order.
  * `is_active` (Boolean, default: true): Publication status.
* **Dynamic Supabase Data:** Yes (Supabase table: `programmes`).
* **Admin Manageability:** Yes (Full CRUD: administrators can add new programmes, update descriptions, toggle visibility).

---

### Section 8: Specialized Facilities & Adaptive Infrastructure
* **Purpose:** Provides transparent insight into the physical and sensory safety of the campus, showcasing therapeutic spaces, wheelchair accessibility, and calming environments.
* **Information Required from Client:**
  * Inventory of specialized campus spaces (e.g., Sensory Integration Rooms, Occupational/Speech Therapy Suites, Accessible Play Zones, Quiet Calm-Down Zones, Adaptive Classrooms).
  * High-resolution photos of each space.
  * Verification of accessibility features (e.g., ramp slopes, braille signage, safety padding).
* **Content Fields:**
  * `id` (UUID, auto-generated): Primary key.
  * `title` (String, required): Facility name (e.g., "Sensory Integration Suite").
  * `slug` (String, unique, required): e.g., `sensory-integration-suite`.
  * `category` (String, required): Categorization tag (e.g., "Therapy", "Learning", "Recreation").
  * `description` (Text, required): Explaining the developmental utility of the room.
  * `accessibility_features` (Array of Strings, optional): e.g., ["Wheelchair Accessible", "Anti-injury padded flooring", "Adjustable lighting"].
  * `image_url` (URL, required): Photographic asset.
  * `image_alt` (String, required): Mandatory descriptive alt text describing the space.
  * `display_order` (Integer, default: 0): Presentation order.
  * `is_active` (Boolean, default: true): Status flag.
* **Dynamic Supabase Data:** Yes (Supabase table: `facilities`).
* **Admin Manageability:** Yes (Full CRUD via Admin Dashboard with enforced alt-text validation).

---

### Section 9: Leadership Desk / Director's Message
* **Purpose:** Humanizes the school leadership and establishes direct personal connection with families. Replaces corporate collegiate rhetoric with warmth, professional integrity, and an open-door policy.
* **Information Required from Client:**
  * Official message from the Director / Head of School.
  * Leader's full name, formal qualifications, and professional credentials in special education.
  * Professional portrait photograph.
* **Content Fields:**
  * `leader_name` (String, required): Full name and credentials.
  * `leader_title` (String, required): Official role (e.g., "Founder & Director of Special Education").
  * `leader_message` (Text, required): 3–4 paragraphs addressing prospective families with empathy and shared commitment.
  * `leader_photo_url` (URL, optional): Asset path to portrait.
  * `leader_photo_alt` (String, required if photo present): Descriptive alt text.
  * `signature_image_url` (URL, optional): Scalable signature graphic.
* **Dynamic Supabase Data:** Yes (Supabase table: `leadership_messages`).
* **Admin Manageability:** Yes (Managed via Admin Dashboard).

---

### Section 10: Developmental Activities & Campus Life
* **Purpose:** Demonstrates vibrant social and extracurricular participation, assuring parents that their child will experience joy, creativity, social bonding, and adaptive physical education.
* **Information Required from Client:**
  * Authentic list of activities conducted (e.g., Adaptive Sports, Expressive Arts, Music Therapy, Gardening, Social Community Outings).
  * Typical schedule / frequency.
  * Photographic evidence of activities with parental release consent.
* **Content Fields:**
  * `id` (UUID, auto-generated): Primary key.
  * `title` (String, required): e.g., "Adaptive Movement & Physical Play".
  * `slug` (String, unique, required): URL-friendly identifier.
  * `description` (Text, required): Description of how the activity supports motor skills, teamwork, and confidence.
  * `frequency` (String, optional): e.g., "Weekly Sessions", "Bi-weekly Workshop".
  * `display_order` (Integer, default: 0): Order index.
  * `is_active` (Boolean, default: true): Visibility toggle.
* **Dynamic Supabase Data:** Yes (Supabase table: `activities`).
* **Admin Manageability:** Yes (Full CRUD via Admin Dashboard).

---

### Section 11: Family Voices & Testimonials
* **Purpose:** Provides authentic peer validation from families whose children attend the school. Crucial for overcoming parental anxiety and establishing emotional credibility.
* **Information Required from Client:**
  * Written testimonials from current or past parents (collected with verified parental consent).
  * Child's milestone growth summary (anonymized if requested by family).
* **Content Fields:**
  * `id` (UUID, auto-generated): Primary key.
  * `parent_name` (String, required): Name of parent/guardian (e.g., "Parent of 7-year-old student" or named if consent given).
  * `testimonial_text` (Text, required): Authentic feedback describing their family's experience.
  * `child_progress_highlight` (String, optional): Brief outcome note (e.g., "Gained confidence in communication").
  * `display_order` (Integer, default: 0): Order sequence.
  * `is_published` (Boolean, default: false): Must be explicitly reviewed and published by admin.
* **Dynamic Supabase Data:** Yes (Supabase table: `testimonials`).
* **Admin Manageability:** Yes (Review, publish, unpublish, and reorder via Admin Dashboard).

---

### Section 12: Milestones, Accreditations & Recognitions
* **Purpose:** Provides institutional legitimacy and compliance credentials (special education society affiliations, safety standards, certified educator memberships) without collegiate ranking gimmicks.
* **Information Required from Client:**
  * Educational registrations, government recognition, or trust affiliations.
  * Special educator council affiliations or certifications.
  * Key institutional milestones (e.g., years of service, community inclusion awards).
* **Content Fields:**
  * `id` (UUID, auto-generated): Primary key.
  * `title` (String, required): Name of accreditation or milestone.
  * `issuing_body` (String, required): Authority or organization conferring the recognition.
  * `year_achieved` (String, optional): e.g., "2024".
  * `description` (Text, optional): Summary of what this certification signifies for educational quality.
  * `badge_image_url` (URL, optional): Logo of certifying authority.
  * `badge_alt_text` (String, required if logo present): Descriptive alt text.
  * `display_order` (Integer, default: 0): Sequence ranking.
* **Dynamic Supabase Data:** Yes (Supabase table: `milestones`).
* **Admin Manageability:** Yes (Managed via Admin Dashboard).

---

### Section 13: Consultative Admissions Call-to-Action
* **Purpose:** Converts parent interest into a non-intimidating, supportive initial consultation. Explains the step-by-step process so parents know exactly what to expect.
* **Information Required from Client:**
  * The actual steps of the school's consultation and admission journey (e.g., Step 1: Initial Discovery Call $\rightarrow$ Step 2: Gentle Campus Observation $\rightarrow$ Step 3: Collaborative IEP Roadmap).
  * Consultation contact email and scheduling phone number.
* **Content Fields:**
  * `cta_heading` (String, required): e.g., "Begin Your Child's Journey With Us".
  * `step_1_title` & `step_1_description` (Strings, required): Step 1 details.
  * `step_2_title` & `step_2_description` (Strings, required): Step 2 details.
  * `step_3_title` & `step_3_description` (Strings, required): Step 3 details.
  * `form_anchor_button_label` (String, default: "Submit an Admissions Inquiry").
* **Dynamic Supabase Data:** Static structural steps with dynamic submission handler.
* **Admin Manageability:** Text content manageable; submissions route to `admissions_inquiries` table.

---

### Section 14: Institutional Footer Landmark
* **Purpose:** Houses mandatory statutory disclosures, clear physical directions, accessibility access notes, operating hours, and comprehensive contact links.
* **Information Required from Client:**
  * Complete campus address, landmark cues, and transport guidance.
  * Specific physical accessibility details (e.g., "Ramp entrance located at Gate 2; elevator access to all floors; accessible parking available").
  * Official email addresses, telephone lines, and administrative visiting hours.
  * Policy documentation (Privacy, Child Protection / Safeguarding, Terms of Consultation).
* **Content Fields:**
  * `campus_address` (Text, required): Physical location.
  * `accessibility_navigation_note` (Text, required): Directions for visitors with mobility aids.
  * `telephone_numbers` (Array of Strings, required): Office numbers.
  * `inquiry_email` (String, required): Official contact email.
  * `visiting_hours` (String, required): Scheduled hours for campus tours and consultations.
  * `statutory_links` (Array of objects, required): Links to policies.
* **Dynamic Supabase Data:** No (Configured in global constants or site settings table).
* **Admin Manageability:** Managed via Admin Settings.

---

## 5. Data Flow & CMS Integration Matrix

The table below illustrates how each proposed frontend section connects with the Supabase database schema and the administrative panel:

| Section Name | Frontend Route | Supabase Table Name | Dynamic? | Admin CMS Capabilities |
| :--- | :--- | :--- | :---: | :--- |
| **Top Accessibility Bar** | Global | `site_settings` | No / Config | Edit phone & helpline hours |
| **Header Navigation** | Global | Code constants | No | Static structure for zero 404s |
| **Hero Section** | `/` | `site_settings` | Yes | Edit title, subtitle, CTA destination |
| **Announcements Ticker**| `/`, `/about` | `announcements` | **Yes** | Add, edit, activate/deactivate, date schedule |
| **Institutional Intro** | `/`, `/about` | `institutional_profile` | Yes | Update mission, vision, philosophy |
| **Core Pillars** | `/`, `/about` | `core_pillars` | Yes | Reorder, edit pillars and icons |
| **Programmes Catalog** | `/`, `/programmes` | `programmes` | **Yes** | Full CRUD, stage definitions, learning goals |
| **Facilities Directory**| `/`, `/facilities` | `facilities` | **Yes** | Full CRUD, image uploads with mandatory alt-text |
| **Leadership Message** | `/`, `/about` | `leadership_messages` | Yes | Update director's address and portrait |
| **Activities Showcase** | `/`, `/activities` | `activities` | **Yes** | Full CRUD, schedule updates, descriptions |
| **Family Testimonials** | `/`, `/about` | `testimonials` | **Yes** | Moderation queue: approve, publish, reorder |
| **Milestones & Awards** | `/`, `/about` | `milestones` | Yes | Add/edit accreditations and certifications |
| **Admissions Inquiries**| `/admissions` | `admissions_inquiries` | **Yes** | Review incoming leads, status updates, notes |
| **Contact Submissions** | `/contact` | `contact_messages` | **Yes** | Message inbox, read/unread status, archive |
| **Footer Disclosures** | Global | `site_settings` | No / Config | Edit address, accessibility directions, hours |

