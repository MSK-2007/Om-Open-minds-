# OM OPEN MINDS — Final Website Page Architecture & Sitemap

> **Document:** `docs/final-sitemap.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Phase:** Phase 2 — Content Architecture & Functional Requirements  
> **Status:** Final Architectural Proposal

---

## 1. Executive Summary & Page Architecture Strategy

The website architecture for **OM OPEN MINDS** is designed to provide an empathetic, transparent, and low-cognitive-load navigation experience for families of children with special needs.

Unlike mainstream collegiate websites (such as our reference, SSMRV College), which serve adult students navigating competitive degree programs, placement records, and examination portals, OM OPEN MINDS serves parents, guardians, and allied professionals. These visitors frequently arrive under emotional stress, requiring clear reassurance, straightforward developmental explanations, transparent safety details, and a supportive, non-intimidating consultation process.

---

## 2. Evaluation of Proposed Pages: Consolidation vs. Separation Analysis

The initial proposal suggested 12 distinct pages:
1. Home
2. About OM OPEN MINDS
3. Vision and Mission
4. Our Programmes
5. Our Approach
6. Facilities
7. Our Team
8. Activities and Events
9. Gallery
10. Admissions
11. Parent Resources
12. Contact Us

### Architectural Evaluation & Recommendations

| Proposed Page | Recommended Structural Treatment | Architectural Justification |
| :--- | :--- | :--- |
| **1. Home** | **Standalone Primary Route (`/`)** | Central orientation gateway; provides reassurance, immediate announcements, pillars, and gentle calls-to-action. |
| **2. About OM OPEN MINDS** | **Primary Route (`/about`)** | Serves as the institutional hub covering founding ethos, history, and governance. |
| **3. Vision and Mission** | **Integrated Section within `/about` (with deep-anchor `/about#vision-mission`)** | *Consolidation Rationale:* In special education, parents evaluate philosophy alongside history. Splitting vision and mission into a standalone thin page forces unnecessary clicks and cognitive fragmentation. It is most effective as a dedicated, prominent section within the About Us narrative. |
| **4. Our Programmes** | **Standalone Primary Route (`/programmes`)** | Direct catalog of developmental learning pathways (Early Intervention, Foundation, Life Skills, Pre-Vocational). Must remain distinct for parents seeking concrete age/stage curriculum details. |
| **5. Our Approach** | **Standalone Primary Route (`/our-approach`)** | *Separation Rationale:* "Our Approach" details the clinical and pedagogical methodology (Individualized Education Plans [IEP], multidisciplinary integration, sensory regulation, dignity-first learning). Keeping it distinct from programme catalogs allows in-depth reading for families seeking methodology without cluttering programme descriptions. |
| **6. Facilities** | **Standalone Primary Route (`/facilities`)** | Dedicated review of sensory suites, therapy spaces, safety padding, wheelchair access, and adaptive learning zones. Essential for environmental safety vetting. |
| **7. Our Team** | **Standalone Primary Route (`/our-team`)** | Highlights the multidisciplinary team (special educators, occupational therapists, speech pathologists, psychologists). Parents need reassurance regarding the professional competence of caregivers. |
| **8. Activities and Events** | **Standalone Primary Route (`/activities`)** | Combines regular extracurricular activities (music, movement, sensory arts) with campus event milestones, avoiding fragmented activity sub-pages. |
| **9. Gallery** | **Standalone Primary Route (`/gallery`)** | Dedicated photo/media hub celebrating student moments with strict privacy protection and mandatory descriptive alternative text. |
| **10. Admissions** | **Standalone Primary Route (`/admissions`)** | Step-by-step consultation journey and secure inquiry intake form. Non-intimidating, pressure-free structure. |
| **11. Parent Resources** | **Standalone Primary Route (`/parent-resources`)** | Highly valuable addition for special education: provides downloadable parent guides, term schedules, home sensory strategies, and FAQs. |
| **12. Contact Us** | **Standalone Primary Route (`/contact`)** | Comprehensive physical location directions, accessibility arrival notes (ramps, accessible parking), direct phones, and message form. |

---

## 3. Final Master Sitemap & URL Structure

```text
om-open-minds/
│
├── Top Utility Strip (Global)
│   ├── Skip to Content Anchor (#main-content)
│   ├── Accessibility Controls (Contrast, Font Sizing)
│   ├── Urgent Parent Helpline / Contact Phone
│   └── Staff & Admin Portal Link (/admin/login)
│
├── Primary Navigation Taxonomy
│   ├── 1. Home (/)
│   ├── 2. About Us (/about)
│   │   ├── Section: Founding Story & Ethos (#story)
│   │   ├── Section: Vision & Mission (#vision-mission)
│   │   └── Section: Governance & Accreditations (#governance)
│   ├── 3. Our Programmes (/programmes)
│   │   ├── Stage 1: Early Intervention & Development
│   │   ├── Stage 2: Primary Foundation
│   │   ├── Stage 3: Functional Academics & Life Skills
│   │   └── Stage 4: Pre-Vocational Readiness & Transition
│   ├── 4. Our Approach (/our-approach)
│   │   ├── Individualized Education Plans (IEP)
│   │   ├── Multidisciplinary Teamwork Model
│   │   ├── Sensory Regulation & Safety
│   │   └── Dignity & Child-Paced Learning
│   ├── 5. Facilities (/facilities)
│   │   ├── Sensory Integration Rooms
│   │   ├── Therapy & Developmental Suites
│   │   ├── Adaptive Classrooms
│   │   └── Barrier-Free Campus & Play Areas
│   ├── 6. Our Team (/our-team)
│   │   ├── Leadership Desk & Special Education Directorship
│   │   ├── Certified Special Educators
│   │   └── Allied Developmental Specialists (Therapists, Counselors)
│   ├── 7. Activities & Events (/activities)
│   │   ├── Weekly Enrichment (Music, Arts, Adaptive Movement)
│   │   └── Campus Milestones & Community Inclusion Events
│   ├── 8. Media Gallery (/gallery)
│   │   ├── Campus Spaces Gallery
│   │   ├── Creative & Learning Moments Gallery
│   │   └── Consent & Child Privacy Policy Notice
│   ├── 9. Admissions (/admissions)
│   │   ├── 3-Step Consultation Journey
│   │   ├── Admissions Inquiry Form
│   │   └── Admissions FAQ
│   ├── 10. Parent Resources (/parent-resources)
│   │   ├── Academic & Term Calendars
│   │   ├── Home Developmental Support Guides
│   │   └── Recommended Reading & Community Links
│   └── 11. Contact Us (/contact)
│       ├── Campus Location & Barrier-Free Navigation Guide
│       ├── Direct Telephone & Email Channels
│       └── General Inquiries Form
│
└── Administrative Portal Taxonomy (/admin)
    ├── /admin/login (Staff Authentication)
    └── /admin/dashboard (Protected Back-Office)
        ├── /admin/dashboard/inquiries (Admissions & Contact Management)
        ├── /admin/dashboard/announcements (Urgent Notices & Circulars)
        ├── /admin/dashboard/programmes (Curriculum & Pathways CMS)
        ├── /admin/dashboard/facilities (Campus Spaces & Alt-Text CMS)
        ├── /admin/dashboard/team (Staff Directory & Leadership CMS)
        ├── /admin/dashboard/resources (Downloadable Guides & Circulars)
        └── /admin/dashboard/gallery (Media Upload & Privacy Consent CMS)
```

---

## 4. Purpose and Scope of Every Page

### Page 1: Home (`/`)
* **Core Purpose:** The central orientation gateway. Reassures parents of their child's dignity, presents urgent school notices, outlines the core institutional differentiators, and provides gentle, clear conversion paths to consultation.
* **Key User Action:** Learn about the school ethos and schedule an introductory consultation.

### Page 2: About OM OPEN MINDS (`/about`)
* **Core Purpose:** Establishes institutional credibility and philosophy. Combines the school's founding narrative, vision, mission, and legal/trust governance into a coherent, inspiring story.
* **Key User Action:** Understand the school's heritage, ethical foundation, and institutional backing.

### Page 3: Our Programmes (`/programmes`)
* **Core Purpose:** Details the educational and developmental pathways offered by the school, categorized by developmental readiness rather than rigid medical categories or standard grades.
* **Key User Action:** Identify which learning pathway aligns with their child's current developmental stage.

### Page 4: Our Approach (`/our-approach`)
* **Core Purpose:** Explains the school's evidence-based pedagogy: how IEPs are formulated, how allied therapists coordinate with special educators, how sensory regulation is maintained, and how dignity is preserved.
* **Key User Action:** Gain deep confidence in the scientific and compassionate methods used to educate and care for children.

### Page 5: Facilities (`/facilities`)
* **Core Purpose:** Transparently showcases the physical safety and therapeutic richness of the school's environment (sensory rooms, wheelchair access, adaptive sports zones).
* **Key User Action:** Verify campus accessibility and physical safety before visiting in person.

### Page 6: Our Team (`/our-team`)
* **Core Purpose:** Introduces the dedicated professionals behind the school: leadership, licensed special educators, occupational/speech therapists, and support staff.
* **Key User Action:** Connect names and professional qualifications to the caregivers who will nurture their child.

### Page 7: Activities & Events (`/activities`)
* **Core Purpose:** Illustrates campus life, creative expression, sensory play, and inclusive social celebrations, proving that learning at OM OPEN MINDS is joyful and holistic.
* **Key User Action:** Explore extracurricular enrichment and upcoming community events.

### Page 8: Media Gallery (`/gallery`)
* **Core Purpose:** Provides visual documentation of learning environments, campus events, and student creativity, operating under strict child privacy safeguards and accessible alt-text guidelines.
* **Key User Action:** View accessible visual glimpses of campus life.

### Page 9: Admissions (`/admissions`)
* **Core Purpose:** Transparently outlines the gentle 3-step admission journey (Discovery Call $\rightarrow$ Campus Observation $\rightarrow$ Collaborative IEP Roadmap) and provides a secure, non-intimidating inquiry intake form.
* **Key User Action:** Submit an admission consultation inquiry without disclosing sensitive medical or diagnostic details.

### Page 10: Parent Resources (`/parent-resources`)
* **Core Purpose:** Provides ongoing functional support for current and prospective families: term schedules, downloadable guides, home sensory strategies, and FAQs.
* **Key User Action:** Download calendars, access home support resources, and find answers to common questions.

### Page 11: Contact Us (`/contact`)
* **Core Purpose:** Delivers complete practical contact information, including visiting consultation hours, direct telephone lines, and explicit barrier-free directions (ramp locations, accessible parking).
* **Key User Action:** Find campus physical location, call the office, or submit a general message.

### Page 12: Administrative Portal (`/admin/*`)
* **Core Purpose:** A secure back-office for school staff to review admission inquiries, manage parent notices, update programmes, upload consented gallery media, and maintain resources without touching code.
* **Key User Action:** Authenticated staff review inquiries, update statuses, and publish school updates.

