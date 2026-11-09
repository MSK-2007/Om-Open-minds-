# OM OPEN MINDS — Phase 5 Public Website Implementation Guide

**Project:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
**Document:** Public Website Technical Implementation  
**Phase:** Phase 5 — Public Website Development  
**Date:** November 9, 2026  
**Status:** **COMPLETED & VERIFIED**

---

## 1. Overview & Architecture Strategy

Phase 5 delivered the complete, production-ready public website for **OM OPEN MINDS**. Built on top of the Phase 1–4 foundational architecture, the public website implements a warm, welcoming, and empowering neo-brutalist design system.

The website serves neurodivergent children and their families, with special attention to:
* **Low Cognitive Load:** Clear visual contrast, clean typography, unambiguous navigation, and gentle pacing.
* **Radical Empathy & Dignity:** Language that honors neurodivergent learning profiles without pathologizing or clinical labeling.
* **Child Safeguarding by Design:** Zero online collection of psychiatric diagnoses, medical records, or unconsented student photographs.
* **Resilient Data Architecture:** Complete integration with Supabase services paired with high-quality curated institutional fallbacks ensuring the website remains 100% operational regardless of remote cloud migration status.

---

## 2. Authoritative Design System Implementation

The visual system adheres strictly to the approved design specification:

### 2.1 Color Palette
* **Background (`#FFFDF5`):** Warm, calming cream background replacing harsh stark whites to reduce sensory glare.
* **Foreground (`#1E293B`):** Deep slate providing crisp, high-contrast readability (meeting WCAG 2.2 AAA contrast standards).
* **Muted Background (`#F1F5F9`) & Muted Text (`#64748B`):** Supporting secondary elements and captions.
* **Primary Accent (`#8B5CF6`):** Vibrant violet used for primary action buttons, active navigation pills, and interactive highlights.
* **Secondary Accent (`#F472B6`):** Cheerful soft rose/pink for playful decorative badges, borders, and callouts.
* **Tertiary Accent (`#FBBF24`):** Warm sunshine yellow for announcements, notice tickers, and hover accents.
* **Quaternary Accent (`#34D399`):** Soothing emerald green for verified badges, accessibility confirmations, and calming touches.
* **Card & Input Background (`#FFFFFF`):** Crisp white for foreground content containers.
* **Outline & Border (`#1E293B`):** Solid `2px solid #1E293B` defining all cards, buttons, badges, and inputs.

### 2.2 Typography
* **Headings:** `Outfit` (weights 700 and 800), imported via Google Fonts. Geometric, friendly, and assertive.
* **Body:** `Plus Jakarta Sans` (weights 400 and 500), imported via Google Fonts. Highly legible sans-serif optimized for screen reading.

### 2.3 Neo-Brutalist Visual Language
* **Hard Offset Shadows:**
  * Default card shadow: `4px 4px 0px #1E293B`
  * Hover card/button shadow: `6px 6px 0px #1E293B` with `-2px -2px` translation
  * Active/pressed shadow: `2px 2px 0px #1E293B` with `+2px +2px` translation
  * Mobile shadow: Reduced to `2px 2px 0px #1E293B` for compact displays
* **Borders:** Consistent `2px solid #1E293B` across all interactive elements.
* **Rounded Corners:** Generous rounding (`16px` to `24px` on cards, `9999px` for pill buttons and badges).
* **Patterns & Stickers:** Subtle dot grids (`.bg-dots`), diagonal stripes (`.bg-stripes`), floating SVG squiggles, and starbursts.

### 2.4 Motion & Accessibility
* Bouncy, smooth transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
* Continuous marquee notice ticker for urgent school announcements (pauses on hover and focus).
* Full `@media (prefers-reduced-motion: reduce)` override disabling all animations and transitions for sensitive users.

---

## 3. Public Pages & Route Implementations

### 3.1 Header & Announcements Ticker (`src/components/layout/Header.tsx`)
* **Notice Ticker:** Live ticker bar fetching active school announcements from `announcementsService.getActiveAnnouncements()` with fallback.
* **Brand Identity:** Distinct "OM" violet badge + school title with specialized education tag.
* **Desktop Navigation:** Pill navigation links highlighting the active route with solid violet background and 2px border.
* **Mobile Navigation Drawer:** Responsive hamburger toggle button ($\ge 44$px touch target) with accessible `aria-expanded` and `aria-controls` attributes.
* **Direct Actions:** "Book Consultation" pill CTA button and direct "Staff Portal" link.

### 3.2 Homepage (`src/pages/public/HomePage.tsx`)
Delivers all 15 required sections in an engaging sequence:
1. **Header & Navigation:** Responsive navigation with announcements ticker.
2. **Hero Section:** Welcoming headline *"Every Child Learns. Differently. Joyfully."*, key value proposition, primary and secondary CTAs, trust metrics bar (1:4 ratio, 100% IEP, daily therapy), and playful geometric illustration card.
3. **Welcome & Core Pillars:** 4 interactive pillar cards (Individualized IEP, Low Ratios, Integrated Therapy, Sensory-Safe Spaces).
4. **About the School:** Narrative explaining why standard schools fail neurodivergent children and how OM OPEN MINDS adapts the environment.
5. **Vision & Mission:** Side-by-side vision and mission highlight boxes with starburst accents.
6. **Programmes Overview:** Cards detailing the 4 developmental pathways with curriculum highlights and educator ratios.
7. **Educational Approach:** Key methodology cards covering sensory regulation, IEP collaboration, positive reinforcement, and AAC.
8. **Facilities Highlights:** Campus sensory suite, occupational therapy center, speech lab, and sensory garden previews with verified accessibility checklists.
9. **Team & Educators:** Multidisciplinary faculty cards with qualifications and professional bios.
10. **Activities & Events:** Enrichment workshop previews with regular schedules and milestone dates.
11. **Gallery Preview:** Consented student moments and sensory space photographs with full alt-text.
12. **Parent Resources:** Downloadable parent toolkits and interactive admissions FAQs accordion.
13. **Admissions CTA Banner:** High-contrast violet banner inviting parents for a private, sensory-friendly walkthrough.
14. **Contact & Quick Inquiry:** Campus location details, visiting hours, and quick contact form with honeypot bot defense.
15. **Footer:** Institutional information, child safeguarding pledge, accessibility badge, and staff login.

### 3.3 About OM OPEN MINDS (`src/pages/public/AboutPage.tsx`)
* **Route:** `/about`
* Founding ethos and history explaining the shift from clinical deficit models to child-affirming pedagogy.
* Anchored `#vision-mission` section for deep navigation.
* Institutional values: Radical Dignity, Empathetic Partnership, Clinical Co-Teaching, and Joy & Celebration.
* Direct calls-to-action for admissions and programmes.

### 3.4 Programmes Catalog (`src/pages/public/ProgrammesPage.tsx`)
* **Route:** `/programmes`
* Interactive pathway filter tabs (`All`, `Early Intervention`, `Primary Foundation`, `Life Skills`, `Pre-Vocational`).
* Detailed pathway cards displaying:
  * Stage & age bracket guidelines.
  * In-depth description.
  * Bulleted curriculum and developmental skill domains.
  * Educator-to-student ratio badges.
  * Allied therapy co-teaching notes.
* Direct "Inquire for this Pathway" buttons routing to admissions.

### 3.5 Our Approach (`src/pages/public/OurApproachPage.tsx`)
* **Route:** `/our-approach`
* Deep-dive clinical and pedagogical framework:
  1. The IEP cycle (assessment, goal setting, quarterly family reviews).
  2. Sensory integration and environmental regulation science.
  3. Total Communication & Augmentative Alternative Communication (AAC).
  4. Positive Behavioral Support (PBS) rejecting compliance-based punishments.
  5. Allied therapy co-teaching inside the classroom.
* Detailed comparison matrix: Conventional Classrooms vs. OM OPEN MINDS.

### 3.6 Campus Facilities (`src/pages/public/FacilitiesPage.tsx`)
* **Route:** `/facilities`
* Category filtering (`All`, `Sensory`, `Therapy`, `Learning`, `Recreation`).
* Suite cards with real photographs, category badges, architectural purpose, and verified accessibility feature tags.
* Universal Campus Accessibility Standards guide (zero-step architecture, acoustic insulation, calibrated lighting, wide doorways).
* Quiet-hour walkthrough booking CTA.

### 3.7 Our Team (`src/pages/public/OurTeamPage.tsx`)
* **Route:** `/our-team`
* Department filtering (`All`, `Leadership`, `Special Education`, `Therapy`, `Support`).
* Profile cards displaying photos, role titles, licensing credentials, and empathetic bios.
* Professional Standards & Safeguarding Commitment (RCI licensing, background checks, neurodiversity-affirming training, low staff turnover).

### 3.8 Activities & Events (`src/pages/public/ActivitiesPage.tsx`)
* **Route:** `/activities`
* Filtering by `All`, `Regular Activity`, `Upcoming Event`, and `Past Milestone`.
* Event timing, frequency badges, and sensory adaptation details.
* Sensory Accommodation Principles for all school celebrations (voluntary participation, noise controls, chill-out suites, flexible timing).

### 3.9 Media Gallery (`src/pages/public/GalleryPage.tsx`)
* **Route:** `/gallery`
* Prominent Child Safeguarding Notice: 100% parental consent verified.
* Album category tabs.
* Interactive accessible modal image viewer: Clicking any photo opens an accessible `<Modal>` dialog displaying high-resolution preview and complete WCAG alt-text description.

### 3.10 Admissions Consultation (`src/pages/public/AdmissionsPage.tsx`)
* **Route:** `/admissions`
* The 4-Step Consultation Journey:
  1. Initial Parent Inquiry
  2. Private Campus Tour
  3. Gentle Play-Based Observation (non-stressful playroom setting)
  4. Collaborative IEP Proposal
* Document Guidelines: Clear explanation that no clinical/medical diagnostic documents are required for initial consultation.
* **Confidential Intake Form:**
  * Parent/guardian name, email, phone.
  * Child's preferred name and age.
  * Preferred pathway dropdown.
  * Sensory comforts, communication preferences, and questions.
  * Client and server-side validation.
  * Zero-friction honeypot spam trap (`tabIndex={-1}`, hidden).
  * Submitting state disabling the button to prevent duplicate submissions.
  * Accessible alert banners on submission success or error.

### 3.11 Parent Resources (`src/pages/public/ParentResourcesPage.tsx`)
* **Route:** `/parent-resources`
* Category filter tabs (`All`, `Parent Guide`, `Sensory Tip Sheet`, `Calendar`, `Policy`).
* Downloadable document cards with file format (PDF) and size indicators.
* Interactive Admissions & School FAQs accordion with keyword search filter and expand/collapse toggles.

### 3.12 Contact & Campus Directions (`src/pages/public/ContactPage.tsx`)
* **Route:** `/contact`
* Physical campus boulevard address, official phone numbers, and admissions email.
* Visiting hours (Mon–Fri school hours, Saturday family consultations).
* Accessibility Arrival Guide (wheelchair drop-off bays, step-free access, sensory waiting lounge).
* General Contact Form with honeypot spam protection and instant feedback alerts.

### 3.13 404 Not Found Page (`src/pages/public/NotFoundPage.tsx`)
* Accessible, reassuring page with friendly neo-brutalist styling guiding lost visitors back to the homepage.

### 3.14 Institutional Footer (`src/components/layout/Footer.tsx`)
* Comprehensive 4-column footer with school summary, development pathway links, quick navigation, visiting hours card, Child Safeguarding pledge banner, and WCAG 2.2 AA verified badge.

---

## 4. Supabase Content Integration & Fallback Strategy

The public website utilizes the existing TypeScript service modules in `src/services/supabase/`:

| Data Stream | Supabase Service Method | Cloud Behavior | Fallback Behavior |
|---|---|---|---|
| **Programmes** | `programmesService.getPublishedProgrammes()` | Queries `public.programmes` (`is_active = true`) | Renders `FALLBACK_PROGRAMMES` |
| **Facilities** | `facilitiesService.getPublishedFacilities()` | Queries `public.facilities` (`is_active = true`) | Renders `FALLBACK_FACILITIES` |
| **Team Roster** | `teamService.getPublishedTeamMembers()` | Queries `public.team_members` (`is_active = true`) | Renders `FALLBACK_TEAM` |
| **Activities** | `eventsService.getPublishedActivities()` | Queries `public.activities` (`is_active = true`) | Renders `FALLBACK_ACTIVITIES` |
| **Announcements**| `announcementsService.getActiveAnnouncements()` | Queries `public.announcements` (valid dates) | Renders `FALLBACK_ANNOUNCEMENTS` |
| **Gallery Media**| `galleryService.getPublishedGalleryItems()` | Queries `public.gallery_items` (consented & published) | Renders `FALLBACK_GALLERY` |
| **Resources** | `resourcesService.getPublishedResources()` | Queries `public.parent_resources` (`is_active = true`) | Renders `FALLBACK_RESOURCES` |
| **FAQs** | `resourcesService.getAdmissionsFaqs()` | Queries `public.admissions_faqs` (`is_active = true`) | Renders `FALLBACK_FAQS` |
| **Admissions** | `enquiriesService.submitAdmissionEnquiry()` | Inserts to `public.admission_enquiries` (RLS zero-read) | Dispatches with honeypot trap |
| **Contact Msg** | `enquiriesService.submitContactEnquiry()` | Inserts to `public.contact_enquiries` (RLS zero-read) | Dispatches with honeypot trap |

**Key Architectural Principle:** When administrators add, update, or publish records through the Phase 4 Admin Panel in Supabase, the public pages immediately reflect those updates. If the remote database tables are pending migration execution, the curated fallback dataset keeps the site fully operational, beautiful, and informative.

---

## 5. Child Safeguarding & Privacy Safeguards

1. **Zero Clinical Diagnostic Inquiries:** The web intake forms strictly omit fields for medical diagnoses, psychological evaluation uploads, or IQ scores. Intake is consultative and supportive.
2. **Parental Consent Enforcement:** Public gallery images require verified parental release on file.
3. **Descriptive WCAG Alt-Text:** All images feature informative alternative text describing the sensory environment or activity.
4. **Honeypot Bot Protection:** Invisible trap fields prevent automated bot spam on intake forms without frustrating human parents.

