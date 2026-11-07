# OM OPEN MINDS — Supabase Backend Connection Report

> **Project:** OM OPEN MINDS (Specialized School Website)  
> **Backend:** Supabase Project (`lhxpzqqjgxmisikxhitd`)  
> **Target URL:** `https://lhxpzqqjgxmisikxhitd.supabase.co`  
> **Status:** Configured & Ready for Live Anon Key  

---

## 1. Executive Summary

The project foundation has been configured to target the official Supabase project:
- **Project URL:** `https://lhxpzqqjgxmisikxhitd.supabase.co`
- **Frontend Client:** `src/services/supabase/client.ts` wired to `src/config/env.ts`
- **Environment Management:** Local `.env` initialized; `.gitignore` verified; `.env.example` verified
- **Idempotency & Safety:** All migration scripts audited to ensure zero destructive overwriting
- **Security Check:** Row Level Security (RLS) policies audited and prepared

---

## 2. Security & Credential Compliance Checklist

| Item | Requirement | Status | Verification Detail |
|---|---|---|---|
| **1. Source File Credentials** | Never hardcode keys in source files | ✅ Pass | All Supabase clients load dynamically via `import.meta.env` |
| **2. Secret Key Isolation** | Never expose `service_role` keys | ✅ Pass | Only `VITE_SUPABASE_ANON_KEY` is referenced |
| **3. Git Tracking** | Add `.env` to `.gitignore` | ✅ Pass | Verified via `git status --ignored` (`.env` is ignored) |
| **4. Safe Example File** | `.env.example` free of credentials | ✅ Pass | Contains template placeholders only |
| **5. Non-Destructive Migrations** | Never overwrite existing tables/data | ✅ Pass | All SQL migrations use `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT`, and `DROP POLICY/TRIGGER IF EXISTS` |
| **6. Inspection Protocol** | Inspect existing schema before changes | ✅ Pass | `supabase/inspect_schema.sql` created |
| **7. RLS Enforcement** | Strict RLS on 100% of tables | ✅ Pass | Confidential intake data inaccessible to public/anon roles |

---

## 3. Database Inspection & Migration Files

The database architecture files are prepared in `supabase/`:

1. **Pre-Migration Inspection:**
   - [`supabase/inspect_schema.sql`](file:///c:/Manish/School%20project/supabase/inspect_schema.sql)  
     Run in Supabase SQL Editor to inspect existing tables, columns, constraints, and storage buckets before deploying new objects.

2. **Idempotent Migrations:**
   - [`supabase/migrations/20260101000000_core_schema.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000000_core_schema.sql) (14 tables, updated_at triggers, foreign keys, indexes)
   - [`supabase/migrations/20260101000001_security_and_rls.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000001_security_and_rls.sql) (Security definer functions, RLS on all tables, public insert / private read for enquiries)
   - [`supabase/migrations/20260101000002_storage_setup.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000002_storage_setup.sql) (3 storage buckets with mime and size limits, storage RLS)

3. **Automated Verification Script:**
   - [`scripts/verify-supabase-connection.mjs`](file:///c:/Manish/School%20project/scripts/verify-supabase-connection.mjs)  
     Tests endpoint connectivity, validates that anonymous users cannot read confidential admission enquiries, and probes storage service.

---

## 4. Next Step to Connect

Populate `VITE_SUPABASE_ANON_KEY` in `c:\Manish\School project\.env` with your project's publishable anonymous key (found in **Supabase Dashboard $\rightarrow$ Project Settings $\rightarrow$ API $\rightarrow$ Project API keys $\rightarrow$ `anon` / `public`**).

