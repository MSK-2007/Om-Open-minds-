# OM OPEN MINDS — Storage Architecture & Access Policies

> **Document:** `docs/storage-architecture.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Service:** Supabase Storage (S3-Compatible Object Storage)  
> **Phase:** Phase 3 Storage Provisioning & Safeguarding

---

## 1. Storage Architecture Overview

The Supabase Storage environment is segregated into three dedicated buckets based on privacy sensitivity and audience requirements:

```text
Supabase Storage Architecture
├── 1. [public-school-assets] (Public Bucket)
│   ├── Purpose: Institutional brand assets, campus facility photos, static icons
│   ├── Access: Public Read (CDN cached) | Authenticated Admin Write
│   ├── Size Limit: 2.0 MB per asset
│   └── Formats: image/jpeg, image/png, image/webp, image/svg+xml
│
├── 2. [approved-gallery] (Public Bucket with Pre-Condition Verification)
│   ├── Purpose: Curated student moments and event photographs with verified parental consent
│   ├── Access: Public Read (CDN cached) | Authenticated Admin Write
│   ├── Size Limit: 2.0 MB per asset
│   └── Formats: image/jpeg, image/png, image/webp (No SVGs or animated GIFs)
│
└── 3. [private-administrative-files] (STRICT PRIVATE BUCKET)
    ├── Purpose: Internal administrative templates, exported enquiry logs, staff guidelines
    ├── Access: ZERO Public Access | Authenticated Admin Read & Write (Signed URLs only)
    ├── Size Limit: 5.0 MB per document
    └── Formats: application/pdf, spreadsheet (.xlsx), text/csv
```

---

## 2. Bucket-by-Bucket Security Specifications

---

### Bucket 1: `public-school-assets`
* **Visibility:** Public (`public = true`).
* **CDN Caching:** Default 3600 seconds (1 hour).
* **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
* **Max File Size:** `2,097,152 bytes` (2.0 MB).
* **Storage Hierarchy:**
  * `brand/` — Official school logo, favicon, seal, and partner trust badges.
  * `facilities/` — Photographs of the sensory integration room, therapy suites, and adaptive playground.
  * `team/` — Standardized faculty and leadership portraits.
* **Access Rules:**
  * Anyone can read via public URL: `https://<PROJECT-ID>.supabase.co/storage/v1/object/public/public-school-assets/...`
  * Upload, update, and delete operations require an authenticated session where `public.is_admin() = true`.

---

### Bucket 2: `approved-gallery`
* **Visibility:** Public (`public = true`), but **gated by database-level consent checks**.
* **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`. (Executable files, scripts, and vector formats are blocked to prevent Cross-Site Scripting [XSS]).
* **Max File Size:** `2,097,152 bytes` (2.0 MB).
* **Child Safeguarding Workflow:**
  1. An image uploaded to `approved-gallery` is assigned a random UUID filename (e.g., `approved/gallery-1731000000-a8f9c1.webp`).
  2. The upload UI **mandates** checking the consent confirmation: *"Signed parental release is on file."*
  3. The database record is created in `gallery_items` with `has_parental_consent = true`.
  4. If an image is uploaded without consent confirmation, its record is marked `is_published = false`, preventing frontend rendering.
* **Rapid Revocation Protocol:**
  * If a parent withdraws media release consent, administrators can immediately toggle `is_published: false` in the dashboard or delete the asset. The image is purged from public view within seconds.

---

### Bucket 3: `private-administrative-files`
* **Visibility:** **STRICTLY PRIVATE (`public = false`)**.
* **Allowed MIME Types:** `application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/csv`.
* **Max File Size:** `5,242,880 bytes` (5.0 MB).
* **Storage Hierarchy:**
  * `exports/` — Encrypted exports of parent inquiries for internal committee review.
  * `policies/` — Internal child safeguarding operational manuals.
* **Access Rules:**
  * **ZERO public access.** Direct URL hits return HTTP 403 Forbidden.
  * Authenticated administrators access files using short-lived time-bounded Signed URLs (e.g., valid for 60 seconds) generated via `supabase.storage.from('private-administrative-files').createSignedUrl(path, 60)`.
* **Child Privacy Standard:**
  * **Medical records, psychiatric evaluations, or clinical diagnosis files are NOT stored in this bucket.** The school's policy requires sensitive clinical documentation to be maintained in physical clinical archives or air-gapped on-premise systems.

---

## 3. Storage Operational Lifecycle

### A. File Naming Conventions
To prevent path traversal, file collisions, and metadata disclosure:
* Client filenames (e.g., `MyChild_Photo_Nov2026.jpg`) are stripped before upload.
* The system generates a cryptographic random name:
  `{bucket_folder}/{category}-{timestamp}-{random_hash}.{ext}`
  Example: `sensory/facility-1731000000-b7e21a.webp`

### B. Replacement Behaviour
When updating an existing facility or gallery image:
1. The new image is uploaded under a fresh unique name.
2. The database entity is updated to point to the new URL.
3. The obsolete binary object is deleted from the storage bucket via `supabase.storage.from(bucket).remove([oldPath])`.

### C. Deletion Behaviour
1. When a gallery item or facility is deleted in the admin panel, the service layer executes a two-step atomic cleanup:
   - First deletes the relational row in PostgreSQL.
   - Second calls the Supabase Storage API to permanently remove the physical file from storage.

