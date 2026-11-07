# OM OPEN MINDS — Media Management & Child Privacy Specification

> **Document:** `docs/media-management-specification.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Phase:** Phase 2 Storage Architecture & Child Safeguarding Policy  
> **Status:** Specification Baseline for Supabase Storage Integration

---

## 1. Ethical Imperative: Child Safeguarding & Image Privacy

In an educational institution dedicated to children with disabilities, **the publication of student photographs, names, and activities carries profound ethical, psychological, and legal responsibilities**:

1. **Zero Assumption of Public Use:** **NO** photograph containing a student's face or identifying characteristics may be assumed to be available for public web publication by default.
2. **Explicit, Written Parental/Guardian Consent:** Every photograph depicting an identifiable student must have an active, verified, and signed *Parental Media Release Consent Form* physically or digitally archived on school premises.
3. **Right to Immediate Revocation:** Parents maintain the unconditional right to withdraw image consent at any time. The technical architecture must support **instant removal/unpublishing** of any image across all public views within minutes of a request.
4. **No Sensitive Medical Contexts:** Photographs must never associate a child with specific medical procedures, therapy crises, sensory distress, or clinical diagnostic labels.
5. **Dignity & Respect:** Imagery must depict students with dignity, agency, and celebration—never framed through pity, deficit models, or tokenism.

---

## 2. Storage Architecture & Supabase Bucket Strategy

All media assets will reside in dedicated, access-controlled Supabase Storage buckets:

```text
Supabase Storage
├── 1. [public-assets] (Public read, Admin write)
│   ├── brand/ (Logos, favicons, official institutional badges)
│   └── icons/ (Accessible UI icons, decorative line tokens)
│
├── 2. [campus-facilities] (Public read, Admin write)
│   ├── sensory-rooms/ (High-res room photographs)
│   ├── therapy-suites/ (Equipment and therapy space views)
│   └── outdoor-play/ (Playground and sensory garden views)
│
├── 3. [gallery-media] (Public read, Admin write)
│   ├── celebrations/ (Consented campus event moments)
│   ├── creative-arts/ (Student artwork and project photographs)
│   └── classroom-learning/ (Consented collaborative learning moments)
│
└── 4. [parent-documents] (Public read, Admin write)
    ├── calendars/ (Academic and term PDF schedules)
    └── guidelines/ (Parent handbooks and policy PDFs)
```

---

## 3. Media Ingestion Specifications

### A. Gallery Categories
Administrators must assign every uploaded image to an approved taxonomy:
1. `Campus Facilities` (Physical rooms, sensory suites, accessibility ramps).
2. `Classroom Learning` (Hands-on learning, collaborative group tasks).
3. `Creative Arts` (Painting, pottery, music sessions, student artwork).
4. `Celebrations & Inclusion` (Sports day, annual festivals, milestones).

### B. File Type & Format Restrictions
To ensure cross-device performance and high visual fidelity:
* **Permitted Image Formats:** `image/jpeg` (`.jpg`, `.jpeg`), `image/png` (`.png`), `image/webp` (`.webp`).
* **Permitted Document Formats:** `application/pdf` (`.pdf`) for parent resources.
* **Prohibited Formats:** Executables (`.exe`), scripts (`.js`, `.sh`), uncompressed RAW files (`.cr2`, `.nef`), or animated GIFs (to prevent triggering vestibular seizures or sensory overload).

### C. File Size & Dimension Constraints
* **Maximum Image File Size:** `2.0 MB` (enforced at upload client-side and via Supabase bucket limits).
* **Maximum PDF File Size:** `5.0 MB`.
* **Recommended Dimensions:**
  * Hero Banners: `1920 x 1080 px` (16:9 ratio).
  * Facility & Gallery Images: `1200 x 800 px` (3:2 ratio) or `1000 x 1000 px` (1:1 ratio).
  * Staff Portraits: `600 x 600 px` (1:1 ratio).

---

## 4. Mandatory Accessibility Metadata

**A media item cannot be published without complete accessibility metadata.** The administrative upload interface enforces the following fields prior to committing:

| Metadata Field | Type | Validation Rule | Purpose |
| :--- | :--- | :--- | :--- |
| **Title / Caption** | String | Required; min 3, max 100 chars. | Visible caption displayed below the media. |
| **Alternative Text (`alt`)** | String | **Mandatory; min 15, max 250 chars.** | Detailed descriptive text announced by screen readers. |
| **Category** | Enum | Required; must match approved list. | Controls gallery filtering. |
| **Parental Consent Checkbox** | Boolean | **Mandatory (must be `true`).** | Staff verification of signed consent. |
| **Display Sequence** | Integer | Optional; default: 0. | Ordering within albums. |

> **Validation Enforcement:** If the `image_alt` field is empty or contains fewer than 15 characters, the upload button is disabled with an inline accessibility alert:  
> *"Alternative text is mandatory for accessibility. Please describe the photograph for screen-reader users."*

---

## 5. Administrative Permissions & Lifecycle Workflow

### A. Upload Permissions
* Only authenticated users with `role IN ('super_admin', 'staff', 'editor')` can upload media.
* File names are automatically sanitized and converted to unique UUID strings (e.g., `om-gallery-3f82a1b9-4d2c.webp`) to prevent file-system overwrites or path disclosure.

### B. Image Replacement Behaviour
* When an administrator replaces an existing facility or gallery photograph:
  1. The new image is uploaded with a fresh unique URL.
  2. The database record is updated to point to the new URL.
  3. The legacy file is scheduled for deletion from Supabase Storage to prevent orphaned storage bloat.
  4. The previous alternative text remains editable and must be reviewed to match the replacement image.

### C. Deletion & Rapid Revocation Workflow
If a parent requests that an image of their child be removed:
* **Immediate Unpublish:** The administrator can immediately toggle `is_published: false` in the dashboard. The image instantly vanishes from the public gallery on the next page refresh.
* **Permanent Deletion:** When a photo is deleted in the admin dashboard:
  1. Database record in `gallery_items` is deleted.
  2. Supabase Storage API call deletes the binary file from the bucket.
  3. CDN edge cache is invalidated.

