# OM OPEN MINDS — Web Platform (Phase 1)

> **Phase 1: Project Foundation & Architecture**  
> Technical baseline, modular application structure, Supabase client integration, accessibility groundwork, and administrative routing for the OM OPEN MINDS school platform.

---

## 1. Project Overview

**OM OPEN MINDS** is a specialized educational institution dedicated to children with disabilities and diverse learning needs. 

This repository houses the technical foundation for the client website, encompassing:
- A public-facing informative website presenting educational programmes, specialized facilities, activities, admissions information, and institutional contacts.
- A segregated administrative portal prepared for future authentication, admissions inquiries review, contact message administration, and content management.

In accordance with Phase 1 directives, **no final visual design, animations, brand colours, or fictitious school statistics have been implemented**. The platform uses neutral, semantic structural placeholders while establishing production-grade software patterns and WCAG 2.1 AA accessibility conventions.

---

## 2. Technology Stack

- **Runtime Environment:** Node.js (v24+)
- **Frontend Framework:** React 18 (TypeScript)
- **Build Tool:** Vite 6
- **Routing Engine:** React Router (v6) with data router architecture (`createBrowserRouter`)
- **Backend / BaaS:** Supabase (`@supabase/supabase-js` v2)
- **Code Quality:** TypeScript (strict mode) & ESLint
- **Styling Architecture:** Semantic HTML5 & CSS-in-JS neutral layouts with focus states

---

## 3. Folder Architecture

The codebase adheres to a strict separation of concerns between presentation, routing, services, hooks, and configuration:

```text
om-open-minds/
├── .env.example                  # Environment configuration template
├── .eslintrc.cjs                 # ESLint rules and parser configuration
├── .gitignore                    # Version control exclusions
├── index.html                    # Root HTML5 document with accessibility landmarks
├── package.json                  # Dependencies and execution scripts
├── tsconfig.json                 # TypeScript compiler configuration (strict mode)
├── tsconfig.node.json            # Node/Vite specific TypeScript config
├── vite.config.ts                # Vite bundler configuration with path aliases
├── public/                       # Static public assets (favicon, robots, etc.)
│   └── favicon.svg
├── supabase/                     # Supabase database configuration & migrations
│   └── migrations/
│       ├── README.md             # Supabase CLI deployment workflow instructions
│       └── 20260101000000_baseline_schema.sql # Baseline schema blueprint with RLS
└── src/
    ├── app/                      # Application entry, top-level providers & routing
    │   ├── App.tsx               # Root provider wrapper (Auth, Router)
    │   ├── index.css             # High-contrast reset & focus outline styles
    │   ├── main.tsx              # DOM mounting point
    │   ├── ProtectedRoute.tsx    # Administrative authentication guard
    │   └── router.tsx            # React Router tree definition
    ├── components/
    │   ├── accessibility/        # Assistive technology utilities
    │   │   ├── FocusTrap.tsx     # Keyboard focus trapping helper
    │   │   ├── index.ts
    │   │   ├── LiveRegion.tsx    # Screen-reader dynamic announcement region
    │   │   ├── SkipToContent.tsx # WCAG Level A skip-navigation anchor
    │   │   └── VisuallyHidden.tsx# Screen-reader only text utility
    │   ├── common/               # Shared UI atoms (neutral structural placeholders)
    │   │   ├── Button.tsx        # Semantic accessible button
    │   │   ├── Card.tsx          # Neutral container component
    │   │   ├── ErrorMessage.tsx  # Accessible error alert (role="alert")
    │   │   ├── index.ts
    │   │   ├── Input.tsx         # Accessible form input with linked labels & errors
    │   │   └── LoadingSpinner.tsx# Screen-reader accessible loading status
    │   └── layout/               # Semantic shell landmarks
    │       ├── AdminHeader.tsx   # Back-office top header
    │       ├── AdminSidebar.tsx  # Back-office navigation sidebar
    │       ├── Footer.tsx        # Public footer landmark
    │       ├── Header.tsx        # Public header with primary navigation
    │       └── index.ts
    ├── config/                   # Global configuration & environment validation
    │   ├── constants.ts          # Routes, application metadata, IDs
    │   ├── env.ts                # Environment variable reader and validator
    │   └── index.ts
    ├── hooks/                    # Custom React hooks
    │   ├── index.ts
    │   ├── useAnnounce.ts        # Screen reader announcement hook
    │   ├── useAuth.tsx           # Supabase Auth context provider and hook
    │   └── useFocusOnMount.ts    # Accessible element focus management
    ├── layouts/                  # Route layouts
    │   ├── AdminLayout.tsx       # Shell for administrative views
    │   ├── index.ts
    │   └── PublicLayout.tsx      # Shell for public website views
    ├── pages/
    │   ├── admin/                # Back-office pages
    │   │   ├── AdminDashboardPage.tsx # Overview dashboard placeholder
    │   │   ├── AdminLoginPage.tsx     # Admin authentication form
    │   │   └── index.ts
    │   └── public/               # Public school website pages
    │       ├── AboutPage.tsx
    │       ├── ActivitiesPage.tsx
    │       ├── AdmissionsPage.tsx
    │       ├── ContactPage.tsx
    │       ├── FacilitiesPage.tsx
    │       ├── GalleryPage.tsx
    │       ├── HomePage.tsx
    │       ├── index.ts
    │       ├── NotFoundPage.tsx  # Accessible 404 handler
    │       └── ProgrammesPage.tsx
    ├── services/
    │   └── supabase/             # Data access and API abstractions
    │       ├── admissions.service.ts # Admissions inquiry submission service
    │       ├── auth.service.ts       # Supabase Auth integration service
    │       ├── client.ts             # Central typed Supabase client
    │       ├── contact.service.ts    # Public contact form service
    │       └── index.ts
    ├── types/                    # TypeScript interfaces & types
    │   ├── auth.types.ts         # User, session, and credential types
    │   ├── common.types.ts       # Async status and component prop types
    │   ├── database.types.ts     # Supabase relational entity definitions
    │   ├── index.ts
    │   └── supabase.ts           # Typed Supabase client aliases
    └── utils/                    # Helper utilities
        ├── accessibility.ts      # Keyboard event & ARIA live utilities
        ├── index.ts
        └── validation.ts         # Form validation helpers
```

---

## 4. Installation Instructions

Ensure you have [Node.js](https://nodejs.org/) (version 18 or 20+) installed on your machine.

1. Clone or open the repository workspace in your terminal:
   ```bash
   cd "c:\Manish\School project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 5. Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server at `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and builds production distribution in `dist/` |
| `npm run typecheck` | Executes TypeScript type checking without emitting files |
| `npm run lint` | Runs ESLint analysis across all source files |
| `npm run preview` | Serves the production build locally for verification |

---

## 6. Supabase Setup Instructions

1. Create a project at [Supabase](https://supabase.com/).
2. Navigate to **Project Settings > API**.
3. Copy the **Project URL** and the **anon (public)** key.
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Insert your credentials:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
6. **Security Mandate:** Never supply the `service_role` secret to any client-facing code or file prefixed with `VITE_`.
7. Once provisioned, apply the baseline database schema using Supabase CLI:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   *(Or copy the contents of `supabase/migrations/20260101000000_baseline_schema.sql` into the Supabase SQL Editor).*

---

## 7. Environment Variable Configuration

| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | The REST endpoint of your Supabase instance | Public / Client |
| `VITE_SUPABASE_ANON_KEY` | Anonymous API key with Row Level Security enforcement | Public / Client |

If these variables are omitted during initial local development, the application falls back gracefully with a non-blocking configuration warning, enabling full inspection of public routes and placeholders.

---

## 8. Route Documentation

### Public Routes (Wrapped in `PublicLayout`)
- `/` — Home Page
- `/about` — About the School, Mission & Philosophy
- `/programmes` — Educational Programmes & Special Needs Curricula
- `/facilities` — Campus & Specialized Infrastructure
- `/activities` — Extracurricular, Therapeutic & Developmental Activities
- `/gallery` — Accessible Media Gallery
- `/admissions` — Admissions Information & Assessment Consultation
- `/contact` — Campus Location & Inquiries
- `*` — Accessible 404 Not Found Page

### Administrative Routes
- `/admin/login` — Public administrative authentication form.
- `/admin/dashboard` — Protected administrative dashboard. Unauthenticated visitors are automatically redirected to `/admin/login`.

---

## 9. Accessibility Foundation

Given that OM OPEN MINDS serves children with special needs, accessibility is engineered directly into the platform foundation:

1. **Semantic HTML5:** Strict utilization of landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<article>`, `<section>`).
2. **Skip to Content:** A dedicated skip-link (`#main-content`) is present on every page to allow keyboard navigators to bypass top navigation.
3. **Focus Visibility:** Custom `:focus-visible` styling guarantees 3px high-contrast outlines for all interactive elements.
4. **Live Announcements:** Dynamic ARIA live region (`#a11y-live-announcer`) announces async events and route updates to assistive technologies.
5. **Form Association:** All form inputs feature explicit `<label htmlFor>` connections, `aria-invalid` markers, and `aria-describedby` error linkages.
6. **Heading Hierarchy:** Strict descending single-`h1` to `h2` heading hierarchy on all pages.

---

## 10. Future Implementation Phases

- **Phase 2 — UI Design System & Client Media:**
  - Ingestion of client reference websites and official brand guidelines.
  - Development of colour palette, typography scale, sensory-friendly design tokens, and components.
  - Ingestion of authentic school copy, staff bios, and facility photographs with vetted alt text.
- **Phase 3 — Interactive Features & Backend Wiring:**
  - Live admissions inquiry form connected to Supabase table `admissions_inquiries`.
  - Contact form integration with email notification trigger (Supabase Edge Functions).
  - Admin dashboard tables for reviewing admissions and contact messages.
- **Phase 4 — Production Hardening & Full Audit:**
  - Automated Axe / Lighthouse accessibility testing targeting 100% WCAG 2.1 AA score.
  - End-to-end testing with Playwright.
  - Supabase database backups, rate limiting, and production domain deployment.

