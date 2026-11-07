# OM OPEN MINDS — Row Level Security (RLS) Policy Matrix

> **Document:** `docs/rls-security-policies.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Security Standard:** Zero-Trust Database Access & Strict Child Privacy Enforcement  
> **Phase:** Phase 3 RLS Verification

---

## 1. Zero-Trust Access Model

In OM OPEN MINDS, Row Level Security (RLS) is activated on **100% of exposed database tables**. 

By default in PostgreSQL, enabling RLS denies all access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) to all roles until explicit, granular policies are declared.

```text
PostgreSQL RLS Matrix
├── Public Anonymous Role (anon)
│   ├── READ: Only active, published institutional content
│   ├── READ: Gallery items ONLY if is_published = true AND has_parental_consent = true
│   ├── INSERT: Valid admission and contact enquiries
│   └── ZERO ACCESS: Cannot select, update, or delete any enquiry or profile
│
└── Authenticated Admin Role (authenticated + is_admin())
    ├── READ/WRITE: Full management of website content, programmes, facilities
    ├── READ/WRITE: Moderate gallery items and verify parental consent
    ├── READ/WRITE: Review, status-tag, and append internal notes to enquiries
    └── RESTRICTED: admin_profiles mutations limited to super_admin role
```

---

## 2. Exhaustive Table-by-Table Policy Matrix

| Table Name | Operation | Role | Policy Name & Condition | Security Intent |
| :--- | :---: | :---: | :--- | :--- |
| **`admin_profiles`** | `SELECT` | `authenticated` | `Admins can view their own profile`<br>`USING (id = auth.uid())` | Staff inspect own role. |
| **`admin_profiles`** | `SELECT` | `authenticated` | `Super admins can view all profiles`<br>`USING (public.is_super_admin())` | User administration. |
| **`admin_profiles`** | `INSERT` | `authenticated` | `Super admins can create admin profiles`<br>`WITH CHECK (public.is_super_admin())` | Prevents unauthorized staff creation. |
| **`admin_profiles`** | `UPDATE` | `authenticated` | `Super admins can update admin profiles`<br>`USING (public.is_super_admin())` | Prevents self-assigned elevation. |
| **`admin_profiles`** | `DELETE` | `authenticated` | `Super admins can delete admin profiles`<br>`USING (public.is_super_admin())` | Controlled account removal. |
| **`site_settings`** | `SELECT` | `public` | `Public can view site settings`<br>`USING (true)` | Display address, phone, hours. |
| **`site_settings`** | `ALL` | `authenticated` | `Admins can manage site settings`<br>`USING (public.is_admin())` | Admin configuration updates. |
| **`core_pillars`** | `SELECT` | `public` | `Public can view active core pillars`<br>`USING (is_active = true)` | View published pillars only. |
| **`core_pillars`** | `ALL` | `authenticated` | `Admins can manage core pillars`<br>`USING (public.is_admin())` | Staff pillar curation. |
| **`programmes`** | `SELECT` | `public` | `Public can view active programmes`<br>`USING (is_active = true)` | Public sees published courses. |
| **`programmes`** | `ALL` | `authenticated` | `Admins can manage programmes`<br>`USING (public.is_admin())` | Curriculum updates by staff. |
| **`facilities`** | `SELECT` | `public` | `Public can view active facilities`<br>`USING (is_active = true)` | Public inspects campus rooms. |
| **`facilities`** | `ALL` | `authenticated` | `Admins can manage facilities`<br>`USING (public.is_admin())` | Staff facility directory CRUD. |
| **`team_members`** | `SELECT` | `public` | `Public can view active team members`<br>`USING (is_active = true)` | View verified faculty roster. |
| **`team_members`** | `ALL` | `authenticated` | `Admins can manage team members`<br>`USING (public.is_admin())` | Manage staff bios & photos. |
| **`activities`** | `SELECT` | `public` | `Public can view active activities`<br>`USING (is_active = true)` | View events & activities. |
| **`activities`** | `ALL` | `authenticated` | `Admins can manage activities`<br>`USING (public.is_admin())` | Manage campus calendar. |
| **`announcements`** | `SELECT` | `public` | `Public can view active valid announcements`<br>`USING (is_active = true AND publish_date <= CURRENT_DATE AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE))` | Shows only active, non-expired circulars. |
| **`announcements`** | `ALL` | `authenticated` | `Admins can manage announcements`<br>`USING (public.is_admin())` | Full notice management. |
| **`gallery_categories`**| `SELECT` | `public` | `Public can view active gallery categories`<br>`USING (is_active = true)` | Browse albums. |
| **`gallery_categories`**| `ALL` | `authenticated` | `Admins can manage gallery categories`<br>`USING (public.is_admin())` | Category management. |
| **`gallery_items`** | `SELECT` | `public` | `Public can view consented published gallery items`<br>`USING (is_published = true AND has_parental_consent = true)` | **STRICT: Students cannot be shown without parental release.** |
| **`gallery_items`** | `ALL` | `authenticated` | `Admins can manage gallery items`<br>`USING (public.is_admin())` | Review consent and publish. |
| **`parent_resources`** | `SELECT` | `public` | `Public can view active parent resources`<br>`USING (is_active = true)` | Download calendars & guides. |
| **`parent_resources`** | `ALL` | `authenticated` | `Admins can manage parent resources`<br>`USING (public.is_admin())` | Upload and link PDFs. |
| **`admissions_faqs`** | `SELECT` | `public` | `Public can view active admissions faqs`<br>`USING (is_active = true)` | View parent disclosures. |
| **`admissions_faqs`** | `ALL` | `authenticated` | `Admins can manage admissions faqs`<br>`USING (public.is_admin())` | Edit parent questions. |
| **`admission_enquiries`**| `INSERT` | `public` | `Public can submit admission enquiries`<br>`WITH CHECK (length(trim(parent_name)) >= 2 AND length(trim(email)) >= 5 AND length(trim(phone)) >= 7 AND length(trim(child_name)) >= 1)` | Anonymous intake with validation. |
| **`admission_enquiries`**| `SELECT` | `public` | **NO POLICY (DENIED)** | **Strict: Public can NEVER read enquiries.** |
| **`admission_enquiries`**| `UPDATE` | `public` | **NO POLICY (DENIED)** | **Strict: Public cannot alter enquiries.** |
| **`admission_enquiries`**| `DELETE` | `public` | **NO POLICY (DENIED)** | **Strict: Public cannot delete enquiries.** |
| **`admission_enquiries`**| `SELECT` | `authenticated` | `Admins can view admission enquiries`<br>`USING (public.is_admin())` | Staff review incoming leads. |
| **`admission_enquiries`**| `UPDATE` | `authenticated` | `Admins can update admission enquiries`<br>`USING (public.is_admin())` | Staff update status & notes. |
| **`admission_enquiries`**| `DELETE` | `authenticated` | `Super admins can delete admission enquiries`<br>`USING (public.is_super_admin())` | Controlled deletion. |
| **`contact_enquiries`** | `INSERT` | `public` | `Public can submit contact enquiries`<br>`WITH CHECK (length(trim(name)) >= 2 AND length(trim(email)) >= 5 AND length(trim(subject)) >= 2 AND length(trim(message)) >= 5)` | Anonymous message submission. |
| **`contact_enquiries`** | `SELECT` | `public` | **NO POLICY (DENIED)** | **Strict: Public cannot read messages.** |
| **`contact_enquiries`** | `SELECT` | `authenticated` | `Admins can view contact enquiries`<br>`USING (public.is_admin())` | Staff review messages. |
| **`contact_enquiries`** | `UPDATE` | `authenticated` | `Admins can update contact enquiries`<br>`USING (public.is_admin())` | Update read status. |
| **`contact_enquiries`** | `DELETE` | `authenticated` | `Super admins can delete contact enquiries`<br>`USING (public.is_super_admin())` | Controlled deletion. |

---

## 3. Policy Verification Testing Protocol

To verify these policies in a live Supabase environment:

### Anonymous Client Test (`anon` key)
1. `SELECT * FROM admission_enquiries;` $\rightarrow$ **Expected:** Returns empty result set (`0 rows`) even if records exist.
2. `INSERT INTO admission_enquiries (parent_name, email, phone, child_name) VALUES (...);` $\rightarrow$ **Expected:** Succeeds with code 201.
3. `UPDATE admission_enquiries SET status = 'contacted';` $\rightarrow$ **Expected:** Fails (0 rows modified / permission denied).
4. `SELECT * FROM gallery_items WHERE has_parental_consent = false;` $\rightarrow$ **Expected:** Returns empty result set.

### Authenticated Staff Test (`authenticated` session with active profile)
1. `SELECT * FROM admission_enquiries;` $\rightarrow$ **Expected:** Returns all submitted enquiries.
2. `UPDATE admission_enquiries SET status = 'contacted' WHERE id = '...';` $\rightarrow$ **Expected:** Succeeds.
3. `SELECT public.is_admin();` $\rightarrow$ **Expected:** Returns `true`.

