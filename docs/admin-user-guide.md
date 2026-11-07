# OM OPEN MINDS — Administrative Panel User Guide

> **Document:** `docs/admin-user-guide.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Audience:** School Leadership, Administrative Staff, Admissions Coordinators, Editorial Staff  
> **Phase:** Phase 4 Operations Manual  
> **Version:** 1.0 (Production Architecture)

---

## 1. Introduction & Mission Alignment

The OM OPEN MINDS Administrative Console provides authorized school personnel with secure, intuitive tools to manage prospective student inquiries, campus communications, educational pathways, and institutional announcements.

### Key Operating Principles
1. **Child Safeguarding First:** Photographs featuring students may only be uploaded and published when documented parental media consent is verified on file.
2. **Confidential Admissions Intake:** In accordance with our privacy framework, web forms never collect medical or psychiatric records. Admissions intake is strictly consultative.
3. **Accessibility Compliance:** Every uploaded image and media asset requires descriptive alternative text ($\ge 15$ characters) to support screen-reader accessibility.

---

## 2. Access & Authentication

### 2.1 Signing In
1. Navigate to [`/admin/login`](file:///c:/Manish/School%20project/src/pages/admin/AdminLoginPage.tsx) in your browser.
2. Enter your authorized school email address and password.
3. Click **Sign In to Dashboard**.
4. The system validates your credentials against Supabase Auth and verifies that your account possesses an active profile in `public.admin_profiles`.

> **Note:** Public registration is permanently disabled. New staff accounts must be provisioned by a Super Administrator.

### 2.2 Signing Out
* Click the **Sign Out** button located in the top-right corner of the Admin Header at any time.
* Signing out terminates your active session token across all tabs and redirects to the login screen.

---

## 3. Dashboard Overview (`/admin/dashboard`)

The dashboard serves as the operational home base:
* **Metric Cards:**
  * **Admission Enquiries:** Total submissions and pending intake requests.
  * **Contact Messages:** Total community messages and unread count.
  * **Educational Offerings:** Active published programmes and campus events.
  * **Notices & Media:** Active announcements and approved gallery items.
* **Management Shortcuts:** One-click shortcuts to post an announcement, add a programme, or upload media.
* **Recent Feeds:** Real-time stream of the latest 5 admission requests and contact inquiries with quick inline status updates.

---

## 4. Admissions Intake Management (`/admin/admissions`)

The Admissions module handles confidential consultation requests from families seeking school placement.

### 4.1 Viewing & Filtering Requests
* **Search:** Filter by parent name, child name, email, phone number, or preferred programme.
* **Status Filter:** Filter by lifecycle state:
  * `Pending` (New intake awaiting initial review)
  * `In Review` (Under administrative assessment)
  * `Contacted` (Initial warm introductory call completed)
  * `Consultation Scheduled` (In-person campus observation visit arranged)
  * `Archived` (Completed or inactive intake)
* **Sorting:** Toggle between newest first and oldest first.

### 4.2 Reviewing Enquiry Details
1. Click **View / Review** on any enquiry row.
2. The confidential details modal displays:
   * Parent/guardian contact information (clickable phone and email links).
   * Child's name, age, and preferred developmental programme.
   * Open-ended parent questions or notes.
3. **Internal Staff Notes:** Add confidential notes regarding phone conversations, child interests, or scheduled visit dates.
4. **Status Actions:** Click the appropriate transition button (e.g. *Mark Contacted*, *Schedule Consultation*).

---

## 5. General Contact Messages (`/admin/contact`)

Handles general inquiries from vendors, visiting educators, donors, and community partners.

* **Message List:** Displays sender name, email, phone, subject, and preview.
* **Read Status:** Opening a message automatically updates its state from `Unread` to `Read`.
* **Reply Tracking:** Use **Mark as Replied** to record that administrative correspondence was sent.

---

## 6. Programmes Management (`/admin/programmes`)

Manage the developmental stages and learning pathways offered by OM OPEN MINDS.

### 6.1 Creating a Programme
1. Click **+ Add Programme**.
2. Complete the required fields:
   * **Programme Title:** (e.g., *Early Developmental Intervention*).
   * **Stage / Age Group:** (e.g., *Ages 3–6 Years • Foundational Readiness*).
   * **Educator Ratio:** (e.g., *1:3* or *1:4*).
   * **Full Description:** Detailed explanation of pedagogical approach, sensory adaptations, and daily rhythm.
   * **Curriculum Highlights:** Enter bullet points (one per line).
   * **Display Order:** Numerical position on the public programmes page.
   * **Published Checkbox:** Controls whether the programme is visible to the public.
3. Click **Create Programme**.

---

## 7. Campus Facilities Management (`/admin/facilities`)

Manage physical campus environments (multisensory suites, physical therapy gyms, speech suites).

### 7.1 Key Requirements
* **Category:** Classify as *Sensory*, *Therapy*, *Learning*, or *Recreation*.
* **Accessibility Features:** Enter specific accommodations (e.g. *Step-free ramp access*, *Acoustic dampening*), one per line.
* **Image Alternative Text:** Mandatory descriptive text ($\ge 15$ characters) explaining the visual elements of the facility photo.

---

## 8. Faculty & Allied Specialists (`/admin/team`)

Manage profiles for school leadership, certified special educators, and therapists.

* **Department:** Classify under *Leadership*, *Special Education*, *Therapy*, or *Support*.
* **Qualifications:** Enter accredited certifications (e.g. *M.Sc Occupational Therapy, Sensory Integration Certified*).
* **Biography:** Professional philosophy and background.

---

## 9. Announcements & Urgent Alerts (`/admin/announcements`)

Broadcast notices to parents and site visitors.

* **Urgent Alerts:** Displayed prominently on top announcement bars.
* **Admissions Notices:** Displayed in the admissions marquee.
* **Publish & Expiration Dates:** Set automated start and end dates. Notices automatically unpublish after the expiration date passes.

---

## 10. Accessible Media & Gallery (`/admin/gallery`)

Upload campus photos and student moments.

### 10.1 Child Safeguarding Protocol
Before uploading any photograph:
1. Verify that signed parental media consent is recorded in school records.
2. Check the mandatory **Parental Consent Confirmed** box.
3. Enter a descriptive **Alternative Text** ($\ge 15$ characters).
4. Select the appropriate **Album Category** (or create a new album under *Manage Albums*).
5. Photos are uploaded to the secure `approved-gallery` bucket and published according to your toggle.

---

## 11. Institutional Settings (`/admin/settings`)

Centralized control for institutional data:
* **Legal & Display Name**
* **Reception Phone & Email**
* **Campus Address & Visiting Hours**
* **Admissions Open/Closed Indicator**
* **Urgent Banner Notice** (appears instantly across the top of all public pages when populated)
* **Copyright & Regulatory Declarations**
