# OM OPEN MINDS — Supabase Database Setup & Deployment Guide

> **Document:** `docs/database-setup-guide.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Workflow:** Supabase CLI / Management Dashboard Deployment  
> **Phase:** Phase 3 Operations Guide

---

## 1. Prerequisites

Before setting up the backend:
1. Ensure [Node.js](https://nodejs.org/) (v18+) is installed.
2. Ensure you have access to a [Supabase](https://supabase.com/) account or a local Supabase CLI environment.
3. Supabase CLI installed locally or via `npx supabase`.

---

## 2. Environment Configuration

1. In the root of the project directory (`c:\Manish\School project`), copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your Supabase project credentials:
   ```env
   # Project URL from Supabase Settings > API
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co

   # Anonymous Public API Key from Supabase Settings > API
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   > **SECURITY MANDATE:** Never insert the `service_role` secret into `.env` or any client-facing file. The application operates strictly with the anonymous key combined with Row Level Security (RLS).

---

## 3. Applying Database Migrations

The migrations in `supabase/migrations/` are ordered, repeatable, and non-destructive:

```text
supabase/migrations/
├── 20260101000000_core_schema.sql         # 1. Tables, extensions, constraints, indexes
├── 20260101000001_security_and_rls.sql     # 2. Security functions and RLS policies
└── 20260101000002_storage_setup.sql       # 3. Storage buckets and storage RLS
```

### Option A: Using the Supabase CLI (Recommended)
1. Link your local project to your remote Supabase instance:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   ```
2. Push migrations to the database:
   ```bash
   npx supabase db push
   ```

### Option B: Using the Supabase Web SQL Editor
If CLI access is not configured:
1. Navigate to your Supabase Project Dashboard $\rightarrow$ **SQL Editor**.
2. Open and copy the contents of [`supabase/migrations/20260101000000_core_schema.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000000_core_schema.sql) $\rightarrow$ Click **Run**.
3. Open and copy the contents of [`supabase/migrations/20260101000001_security_and_rls.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000001_security_and_rls.sql) $\rightarrow$ Click **Run**.
4. Open and copy the contents of [`supabase/migrations/20260101000002_storage_setup.sql`](file:///c:/Manish/School%20project/supabase/migrations/20260101000002_storage_setup.sql) $\rightarrow$ Click **Run**.

---

## 4. Provisioning the Initial Super Administrator Account

Because public administrator registration is strictly prohibited by security design, the initial Super Admin account must be provisioned directly via the console:

### Step 1: Create the User in Supabase Auth
1. Go to **Authentication** $\rightarrow$ **Users** $\rightarrow$ **Add User** $\rightarrow$ **Create User**.
2. Enter the administrator's official email (e.g., `admin@omopenminds.example`) and a secure password.
3. Confirm the user creation.
4. Copy the generated **User UID** (e.g., `4a7b2c91-e83f-42a1-b8f9-123456789abc`).

### Step 2: Register the Admin Profile in PostgreSQL
1. Navigate to **SQL Editor** and run the following insert statement (substituting the actual User UID and name):
   ```sql
   INSERT INTO public.admin_profiles (id, full_name, role, is_active)
   VALUES (
     '4a7b2c91-e83f-42a1-b8f9-123456789abc', -- Substitute with the actual User UID from Step 1
     'School Director / Lead Administrator',
     'super_admin',
     true
   );
   ```
2. Verification:
   ```sql
   SELECT id, full_name, role, is_active FROM public.admin_profiles;
   ```
   The user can now sign in at `/admin/login` and access `/admin/dashboard`.

---

## 5. Storage Buckets Verification

Navigate to **Storage** in the Supabase Dashboard and verify that three buckets exist:
1. `public-school-assets` — Public (2 MB limit, images & SVGs).
2. `approved-gallery` — Public (2 MB limit, JPG/PNG/WebP only).
3. `private-administrative-files` — **Private** (5 MB limit, PDFs & spreadsheets).

---

## 6. Troubleshooting Common Issues

* **Error: `permission denied for table ...` on public select:**
  * Ensure that RLS migration `20260101000001_security_and_rls.sql` has been executed. Check that `is_active = true` on the target record.
* **Error: `Unauthorized: This account does not possess active administrative access privileges`:**
  * The user successfully authenticated with Supabase Auth, but their UID does not exist in `public.admin_profiles` with `is_active = true`. Follow Section 4 to insert the profile.
* **Storage upload fails with HTTP 403:**
  * Ensure the user is signed in with an active administrative account. Public anonymous users cannot upload to any storage bucket.

