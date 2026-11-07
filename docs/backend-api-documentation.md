# OM OPEN MINDS — Backend Service Layer API Documentation

> **Document:** `docs/backend-api-documentation.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Client Framework:** TypeScript / Supabase JavaScript Client v2  
> **Location:** `src/services/supabase/`

---

## 1. Architecture Overview

The backend service layer provides a strictly typed abstraction over Supabase database operations, authentication RPCs, and storage buckets. All services return uniform response envelopes:
```typescript
interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}
```
Components interact exclusively through these services rather than issuing ad-hoc database queries.

---

## 2. Service Modules Directory

```text
src/services/supabase/
├── client.ts             # Central Supabase client instance
├── auth.service.ts       # Supabase Auth, session lifecycle & admin role verification
├── enquiries.service.ts  # Admissions & contact message intake and admin review
├── programmes.service.ts # Curriculum pathways CRUD & slug lookups
├── facilities.service.ts # Campus spaces directory & category filtering
├── team.service.ts       # Staff and leadership profiles directory
├── events.service.ts     # Extracurricular activities & campus events
├── announcements.service.ts # Urgent notices & ticker alerts
├── gallery.service.ts    # Media uploads, category filters & consent enforcement
├── content.service.ts    # Site settings & core pillars
└── resources.service.ts  # Downloadable parent resources & admissions FAQs
```

---

## 3. Comprehensive Module API Reference

---

### 1. `authService` ([`src/services/supabase/auth.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/auth.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `signIn(credentials)` | `{ email, password }` | `{ user, session, profile, error }` | Public | Authenticates admin user and verifies active record in `admin_profiles`. Automatically signs out unauthorized accounts. |
| `signOut()` | None | `{ error }` | Any | Terminates session, clears local storage tokens. |
| `getSession()` | None | `{ session, error }` | Any | Retrieves active stored session. |
| `getUser()` | None | `{ user, error }` | Any | Fetches current user from Supabase. |
| `getAdminProfile(userId)` | `userId: string` | `{ profile, error }` | Authenticated | Fetches `admin_profiles` metadata (role, name). |
| `verifyAdminRole()` | None | `{ isAdmin, role }` | Authenticated | Executes database RPC `public.is_admin()` and `public.get_admin_role()`. |
| `onAuthStateChange(cb)` | Callback function | Subscription object | Any | Listens to sign-in, sign-out, token refresh. |

---

### 2. `enquiriesService` ([`src/services/supabase/enquiries.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/enquiries.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `submitAdmissionEnquiry(input, honeypot)` | `input: CreateAdmissionEnquiryInput, honeypot?: string` | `SubmissionResponse<AdmissionEnquiry>` | Public | Validates input, checks honeypot, sanitizes fields, inserts to `admission_enquiries`. |
| `submitContactEnquiry(input, honeypot)` | `input: CreateContactEnquiryInput, honeypot?: string` | `SubmissionResponse<ContactEnquiry>` | Public | Submits general message to `contact_enquiries`. |
| `getAdmissionEnquiries(status?)` | `statusFilter?: AdmissionEnquiryStatus` | `{ data, error }` | Admin | Fetches enquiries ordered by date descending. |
| `updateAdmissionEnquiryStatus(id, status, notes?)` | `id, status, internalNotes?` | `{ data, error }` | Admin | Updates status state and appends private staff log. |
| `getContactEnquiries(status?)` | `statusFilter?: ContactEnquiryStatus` | `{ data, error }` | Admin | Fetches contact messages. |
| `updateContactEnquiryStatus(id, status, notes?)` | `id, status, internalNotes?` | `{ data, error }` | Admin | Marks message as read/replied. |

---

### 3. `programmesService` ([`src/services/supabase/programmes.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/programmes.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getPublishedProgrammes()` | None | `{ data: Programme[], error }` | Public | Returns active programmes sorted by `display_order`. |
| `getProgrammeBySlug(slug)` | `slug: string` | `{ data: Programme, error }` | Public | Fetches a single active programme by unique slug. |
| `getAllProgrammesAdmin()` | None | `{ data: Programme[], error }` | Admin | Returns all programmes including drafts. |
| `createProgramme(input)` | `CreateProgrammeInput` | `{ data: Programme, error }` | Admin | Inserts a new programme. |
| `updateProgramme(id, input)` | `id: string, UpdateProgrammeInput` | `{ data: Programme, error }` | Admin | Updates an existing programme. |
| `deleteProgramme(id)` | `id: string` | `{ error }` | Admin | Deletes a programme record. |

---

### 4. `facilitiesService` ([`src/services/supabase/facilities.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/facilities.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getPublishedFacilities(category?)`| `category?: FacilityCategory` | `{ data: Facility[], error }` | Public | Returns active campus rooms, filterable by category. |
| `getFacilityBySlug(slug)` | `slug: string` | `{ data: Facility, error }` | Public | Fetches a single facility by slug. |
| `getAllFacilitiesAdmin()` | None | `{ data: Facility[], error }` | Admin | Returns all facility records. |
| `createFacility(input)` | `CreateFacilityInput` | `{ data: Facility, error }` | Admin | Creates a new facility entry. |
| `updateFacility(id, input)` | `id, UpdateFacilityInput` | `{ data: Facility, error }` | Admin | Modifies facility details or alt text. |
| `deleteFacility(id)` | `id: string` | `{ error }` | Admin | Removes facility record. |

---

### 5. `teamService` ([`src/services/supabase/team.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/team.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getPublishedTeamMembers(dept?)` | `department?: TeamDepartment` | `{ data: TeamMember[], error }` | Public | Returns active staff members, filterable by department. |
| `getAllTeamMembersAdmin()` | None | `{ data: TeamMember[], error }` | Admin | Returns complete staff directory. |
| `createTeamMember(input)` | `CreateTeamMemberInput` | `{ data: TeamMember, error }` | Admin | Creates a faculty profile. |
| `updateTeamMember(id, input)` | `id, UpdateTeamMemberInput` | `{ data: TeamMember, error }` | Admin | Updates bio, credentials, or photo. |
| `deleteTeamMember(id)` | `id: string` | `{ error }` | Admin | Deletes staff profile. |

---

### 6. `announcementsService` ([`src/services/supabase/announcements.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/announcements.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getActiveAnnouncements()` | None | `{ data: Announcement[], error }` | Public | Returns active, unexpired announcements valid for current date. |
| `getAllAnnouncementsAdmin(cat?)`| `category?: AnnouncementCategory` | `{ data: Announcement[], error }` | Admin | Returns full notice history. |
| `createAnnouncement(input)` | `CreateAnnouncementInput` | `{ data: Announcement, error }` | Admin | Posts a new announcement. |
| `updateAnnouncement(id, input)` | `id, UpdateAnnouncementInput` | `{ data: Announcement, error }` | Admin | Updates content or validity dates. |
| `deleteAnnouncement(id)` | `id: string` | `{ error }` | Admin | Deletes an announcement. |

---

### 7. `galleryService` ([`src/services/supabase/gallery.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/gallery.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getPublishedGalleryItems(catId?)`| `categoryId?: string` | `{ data: GalleryItem[], error }` | Public | **STRICT:** Returns items where `is_published = true AND has_parental_consent = true`. |
| `getGalleryCategories()` | None | `{ data: GalleryCategory[], error }`| Public | Returns active album categories. |
| `uploadAndCreateGalleryItem(file, meta)` | `file: File, meta: Omit<CreateGalleryItemInput, 'image_url'>` | `{ data: GalleryItem, error }` | Admin | Validates alt text ($\ge 15$ chars) and parental consent; uploads to `approved-gallery` bucket; creates DB row. |
| `updateGalleryItem(id, input)` | `id, UpdateGalleryItemInput` | `{ data: GalleryItem, error }` | Admin | Updates title or alt text. |
| `deleteGalleryItem(id, imageUrl?)` | `id, imageUrl?` | `{ error }` | Admin | Removes DB record and deletes physical file from storage. |

---

### 8. `resourcesService` ([`src/services/supabase/resources.service.ts`](file:///c:/Manish/School%20project/src/services/supabase/resources.service.ts))

| Method | Parameters | Return Type | Role Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `getPublishedResources(cat?)` | `category?: ResourceCategory` | `{ data: ParentResource[], error }` | Public | Returns downloadable parent guides and calendar links. |
| `getAdmissionsFaqs()` | None | `{ data: AdmissionsFaq[], error }` | Public | Returns active FAQ question/answer pairs. |
| `createResource(input)` | `CreateParentResourceInput` | `{ data: ParentResource, error }` | Admin | Adds a new parent resource link or file. |
| `createFaq(input)` | `CreateAdmissionsFaqInput` | `{ data: AdmissionsFaq, error }` | Admin | Adds an admissions FAQ. |

