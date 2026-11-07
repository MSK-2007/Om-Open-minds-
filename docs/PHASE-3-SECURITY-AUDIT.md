# OM OPEN MINDS — Phase 3 Security Audit & Compliance Review

> **Document:** `docs/PHASE-3-SECURITY-AUDIT.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Auditor Role:** Senior Backend Engineer & Security Architect  
> **Scope:** Full Repository Audit across Code, SQL Migrations, Services & Environment  
> **Date:** November 2026

---

## 1. Executive Summary & Audit Verdict

| Audit Vector | Standard Checked | Result | Status |
| :--- | :--- | :---: | :---: |
| **1. Credential Exposure** | Zero `service_role` or secret keys in frontend code | Verified clean | **PASS** |
| **2. Database Boundary** | Row Level Security (RLS) enabled on 100% of exposed tables | 14 of 14 tables protected | **PASS** |
| **3. Anonymous Permissions** | Public restricted to published content; zero enquiry reads | Verified strict | **PASS** |
| **4. Administrative Access** | Role checks enforced by database kernel via `SECURITY DEFINER` | Verified non-bypassable | **PASS** |
| **5. Storage Security** | Private files gated; student photos gated by consent check | 3 buckets isolated | **PASS** |
| **6. Child Privacy Safeguards** | Zero medical, diagnostic, or clinical intake on public forms | Enforced by design | **PASS** |
| **7. Input Sanitization** | Client & service-side validation; honeypot spam protection | Verified | **PASS** |

**OVERALL AUDIT VERDICT: SECURE & COMPLIANT**  
The architecture adheres to zero-trust principles and respects child safeguarding imperatives.

---

## 2. Detailed Checklist & Verification Findings

### A. Secret & Credential Exposure Review
* **Files Inspected:**
  * `.env.example`
  * `src/config/env.ts`
  * `src/services/supabase/client.ts`
  * All `.ts`, `.tsx`, and `.md` files.
* **Findings:**
  * Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are read by client-side code.
  * No `SUPABASE_SERVICE_ROLE_KEY` or privileged database passwords exist anywhere in the repository.
  * `.gitignore` explicitly excludes `.env`, `.env.local`, and all production credential files.
* **Verdict:** **PASS**.

### B. Row Level Security (RLS) Coverage
* **Files Inspected:** `supabase/migrations/20260101000001_security_and_rls.sql`
* **Findings:**
  * RLS is explicitly commanded on all 14 tables: `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;`.
  * Public read policies strictly filter for `is_active = true`.
  * Public users have zero `SELECT`, `UPDATE`, or `DELETE` access to `admin_profiles`, `admission_enquiries`, or `contact_enquiries`.
* **Verdict:** **PASS**.

### C. Self-Assigned Role Elevation Defense
* **Risk Audited:** Can an authenticated user grant themselves `super_admin` or alter their active status in `admin_profiles`?
* **Verification:**
  * In `admin_profiles`, the policy `Super admins can update admin profiles` requires `public.is_super_admin()`.
  * Standard staff users have a read-only policy for their own record (`id = auth.uid()`), with no update permissions on `role`.
  * The helper function `public.is_admin()` is declared as `SECURITY DEFINER` and checks `is_active = true`, preventing spoofed JWT claim attacks.
* **Verdict:** **PASS**.

### D. Enquiries Data Confidentiality
* **Risk Audited:** Can public visitors view other parents' contact numbers or children's names?
* **Verification:**
  * In `admission_enquiries`, public users are granted `INSERT` permissions with column-level length validation.
  * There is **NO** `SELECT` policy for the `public` or `anon` role. Any `supabase.from('admission_enquiries').select('*')` issued with an anonymous key returns an empty result set (`0 rows`) even if records exist.
  * Only authenticated staff members passing `public.is_admin()` can query or review inquiries.
* **Verdict:** **PASS**.

### E. Child Safeguarding & Image Privacy
* **Risk Audited:** Can student photos be published without consent or scraped from storage?
* **Verification:**
  * In `gallery_items`, the public select policy requires `USING (is_published = true AND has_parental_consent = true)`.
  * The administrative service layer `galleryService.uploadAndCreateGalleryItem` explicitly validates that `has_parental_consent == true` and `length(alt_text) >= 15` before allowing upload.
  * `private-administrative-files` bucket is strictly non-public (`public = false`), accessible only by authenticated staff via signed short-lived URLs.
* **Verdict:** **PASS**.

### F. Spam & Automated Script Defense
* **Risk Audited:** Susceptibility of public forms to bot spam and denial-of-service filling.
* **Verification:**
  * Dual-layer honeypot detection silently rejects automated submissions without frustrating human users with inaccessible CAPTCHAs.
  * Form inputs are validated for minimum lengths and email formats before network requests are dispatched.
* **Verdict:** **PASS**.

---

## 3. Identified Risks & Recommended Operational Safeguards

While the codebase and database policies are structurally secure, the following operational safeguards are recommended for production deployment:

1. **Email Service Integration (Post-Launch):**
   * Currently, admissions inquiries write directly to the database. In production, connect a Supabase Database Webhook or Edge Function to alert staff via transactional email (e.g., Resend, AWS SES) immediately upon form submission.
2. **IP Hashing for Rate Limiting:**
   * The schema provides an `ip_hash` column. In production, hash client IP addresses with a salt before logging to prevent storing raw IP addresses (complying with global privacy laws).
3. **Periodic Audit of Parental Consents:**
   * School administrative staff should perform an annual audit of the `gallery_items` table to ensure student photographs remain aligned with active enrollment and current parental release status.

