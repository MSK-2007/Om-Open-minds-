# OM OPEN MINDS — Phase 4 Administrative Security Audit

> **Document:** `docs/admin-security-audit.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Audit Date:** November 2026  
> **Target System:** Administrative Back-Office & Supabase Database Engine  
> **Status:** Passed 10 of 10 Security Invariants (100% Compliance)

---

## 1. Executive Summary

A comprehensive security audit of the OM OPEN MINDS administrative system was conducted in accordance with Phase 4 security requirements. The audit evaluated client-side route protection, session persistence, role-based authorization, database Row Level Security (RLS), child privacy safeguards, and storage bucket isolation.

### Key Finding
The platform enforces security **strictly at the database engine level**. Compromising or bypassing the client React frontend does not grant unauthorized access to sensitive family inquiries or administrative tables, because PostgreSQL RLS policies evaluate `auth.uid()` and `public.is_admin()` server-side for every query.

---

## 2. The 10 Security Invariants Audit

| Invariant # | Security Requirement | Architectural Enforcement | Automated Test Result |
| :---: | :--- | :--- | :---: |
| **1** | Unauthenticated users cannot access admin routes | Handled by [`ProtectedRoute.tsx`](file:///c:/Manish/School%20project/src/app/ProtectedRoute.tsx). Redirects unauthenticated traffic to `/admin/login` preserving return URL in location state. | ✅ **PASS** |
| **2** | Authenticated non-admin users cannot access admin data | Two-tier check: [`authService.signIn()`](file:///c:/Manish/School%20project/src/services/supabase/auth.service.ts) verifies user ID against `public.admin_profiles WHERE is_active = true`. Unauthorized sessions are terminated immediately. | ✅ **PASS** |
| **3** | Admins can access only their permitted operations | RLS policies distinguish between `staff` and `super_admin`. Table deletions on enquiries and staff profile mutations require `is_super_admin()`. | ✅ **PASS** |
| **4** | Public users cannot read admission enquiries | Strict RLS: `public.admission_enquiries` has **zero SELECT policies** for the `anon` or `public` roles. | ✅ **PASS** |
| **5** | Public users cannot read contact enquiries | Strict RLS: `public.contact_enquiries` has **zero SELECT policies** for public roles. | ✅ **PASS** |
| **6** | Public users cannot modify protected website content | All content tables (`programmes`, `facilities`, `team_members`, `activities`, `announcements`, `site_settings`) require `is_admin() = true` for `INSERT`, `UPDATE`, and `DELETE`. | ✅ **PASS** |
| **7** | Published content is publicly readable according to RLS | SELECT policies for `anon` filter strictly by `is_active = true`. | ✅ **PASS** |
| **8** | Unpublished content is not publicly accessible | Draft and inactive records (`is_active = false`) are completely invisible to public queries. | ✅ **PASS** |
| **9** | Private storage files remain private | The bucket `private-administrative-files` is configured with `public = false`. Public users cannot read or list objects. | ✅ **PASS** |
| **10** | Admin logout invalidates the active application session | `authService.signOut()` calls `supabase.auth.signOut()`, revoking the session token and clearing local state in [`AuthProvider.tsx`](file:///c:/Manish/School%20project/src/app/AuthProvider.tsx). | ✅ **PASS** |

---

## 3. Child Safeguarding & Privacy Audit

In a specialized school environment, data privacy is a child protection issue. The audit verified:

1. **Zero Diagnostic Data Intake:**
   * Public admission forms and database columns strictly reject or omit psychiatric diagnoses, therapy reports, or psychological evaluations.
   * All diagnostic records are handled strictly offline during confidential in-person family consultations.
2. **Parental Consent Enforcement for Media:**
   * Gallery upload interfaces enforce mandatory confirmation of documented parental consent.
   * Public RLS policy on `gallery_items` restricts reads to `WHERE is_published = true AND has_parental_consent = true`.
3. **Descriptive Alternative Text Mandate:**
   * All image upload endpoints enforce alt text length $\ge 15$ characters before permitting insertion.

---

## 4. Test Script Verification

The automated verification suite was executed via [`scripts/test-admin-security.mjs`](file:///c:/Manish/School%20project/scripts/test-admin-security.mjs):

```text
=============================================================================
OM OPEN MINDS — Phase 4 Admin Security & Access Control Test Suite
=============================================================================
[Test 1]  ✓ Client-Side Route Guard (Unauthenticated Access) — PASS
[Test 2]  ✓ Database Admin Privilege Verification — PASS
[Test 3]  ✓ Role-Based Operational Matrix — PASS
[Test 4]  ✓ Public Admission Enquiries Zero-Read Policy — PASS
[Test 5]  ✓ Public Contact Messages Zero-Read Policy — PASS
[Test 6]  ✓ Public Content Mutation Guard — PASS
[Test 7]  ✓ Published Content Public Readability — PASS
[Test 8]  ✓ Unpublished Content Isolation — PASS
[Test 9]  ✓ Private Storage Isolation — PASS
[Test 10] ✓ Session Termination & Invalidation — PASS
-----------------------------------------------------------------------------
Security Test Suite Summary: 10 of 10 assertions PASSED.
=============================================================================
```

