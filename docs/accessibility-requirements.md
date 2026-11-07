# OM OPEN MINDS — Accessibility Requirements & WCAG 2.2 AA Compliance

> **Document:** `docs/accessibility-requirements.md`  
> **Institution:** OM OPEN MINDS (Specialized School for Children with Diverse Learning Needs)  
> **Standard:** Web Content Accessibility Guidelines (WCAG) 2.2 Level AA  
> **Status:** Mandatory Engineering & Content Baseline

---

## 1. Institutional Imperative

Accessibility is not an auxiliary feature or afterthought for OM OPEN MINDS; **it is the foundational premise of our digital existence**. 

Because our school serves children with diverse neurological, sensory, cognitive, and physical capabilities, their families and caregivers frequently utilize assistive technologies (screen readers, screen magnifiers, switch devices, eye-gaze tracking, speech recognition). The website must provide an effortless, dignified, and barrier-free digital environment.

---

## 2. Core Pillars of WCAG 2.2 AA Compliance

```text
WCAG 2.2 AA Compliance Engine
├── 1. Perceivable
│   ├── Meaningful Alternative Text for all imagery
│   ├── Minimum 4.5:1 Contrast Ratio for text (3:1 for large text & UI controls)
│   ├── Text resizeable up to 200% without loss of layout or functionality
│   └── Multi-media accompanied by complete text transcripts
│
├── 2. Operable
│   ├── 100% Keyboard Operability (No mouse required)
│   ├── Visible, high-contrast focus rings (:focus-visible { outline: 3px solid #0284c7 })
│   ├── Skip-to-Content link as the first focusable element
│   ├── No unexpected focus traps or timed-out sessions
│   └── Minimum 24x24 px touch targets (Target Size Criterion 2.5.8)
│
├── 3. Understandable
│   ├── Consistent navigation and naming conventions across all pages
│   ├── Clear, plain-language text (Grade 8 reading level baseline)
│   ├── Explicit form field labels (<label htmlFor="...">)
│   └── Predictive error identification and suggestions
│
└── 4. Robust
    ├── Valid HTML5 landmarks (<header>, <nav>, <main>, <aside>, <footer>)
    ├── Correct ARIA roles where native HTML does not suffice
    └── Screen-reader live announcement regions for dynamic state changes
```

---

## 3. Technical Implementation Specifications

### A. Keyboard Accessibility & Navigation
* **Tab Order:** The keyboard Tab sequence strictly follows visual reading order (top-to-bottom, left-to-right).
* **Focus Indicators:** Every interactive element (buttons, links, inputs, selects, textareas) features a distinct, 3px solid focus indicator with a 2px offset (`:focus-visible`).
* **Skip Navigation:** The `#main-content` anchor is placed at the very top of the DOM. When focused with the Tab key, it becomes prominently visible, allowing keyboard navigators to bypass repetitive headers and navigation links.
* **Component Focus Trapping:** Modal dialogs (such as gallery lightboxes and image previews) trap keyboard focus within the dialog container while active. Pressing the Escape key immediately dismisses the modal and restores focus to the triggering element.

### B. Screen Reader Compatibility & Semantic Architecture
* **Landmarks:** Every page must include standard HTML5 landmark elements:
  * `<header role="banner">` for global branding and primary navigation.
  * `<nav role="navigation" aria-label="...">` with explicit labels (e.g., `aria-label="Main Navigation"`, `aria-label="Admin Navigation"`).
  * `<main id="main-content" role="main">` containing unique page content.
  * `<footer> role="contentinfo">` containing institutional disclosures and contact channels.
* **Heading Hierarchy:**
  * Strict single-`<h1>` policy per page representing the page title.
  * Section titles use `<h2>`; sub-items/cards use `<h3>`.
  * Heading levels are never skipped (e.g., `h1` directly to `h3` is strictly prohibited).
* **Dynamic Announcements:**
  * Dynamic asynchronous events (form submission progress, confirmation messages, error alerts) are wired to an ARIA live region (`#a11y-live-announcer`) configured with `role="status"` and `aria-live="polite"`.
  * Critical form failures trigger `role="alert"` and `aria-live="assertive"`.

### C. Meaningful Alternative Text (`alt`) Guidelines
Images serve different functional roles and must be annotated accordingly:

| Image Type | Context | Alt Text Requirement | Example |
| :--- | :--- | :--- | :--- |
| **Informative Image** | Facility photograph | Describe physical layout, equipment, and accessibility adaptations. | `alt="Sensory room equipped with a soft padded floor, gentle blue fiber-optic lights, and a suspended platform swing."` |
| **Action / Activity Image** | Student activity (consented) | Describe the activity and engagement without diagnostic labels. | `alt="Three students sitting in adaptive supportive chairs painting ceramic pots during a creative art workshop."` |
| **Portrait Photograph** | Team member | State full name, title, and visual description. | `alt="Portrait of Dr. Ananya Rao, Director of Special Education, smiling in a bright office."` |
| **Functional Icon** | Phone or email icon | Describe the destination action rather than the graphic. | `alt="Call administrative office"` |
| **Purely Decorative Graphic** | Background wave or line divider | Mark with empty alt text so screen readers skip it. | `alt="" aria-hidden="true"` |

### D. Forms & Input Validation
* **Explicit Label Association:** Every input, select, and textarea element has an explicit `<label htmlFor="{unique_id}">`. Generic placeholder text is NEVER used as a replacement for visible labels.
* **Required Indicators:** Required fields are marked with visible asterisks and an accessible screen-reader note (`aria-required="true"`).
* **Error Describers:** Validation error messages are assigned unique IDs and connected to inputs via `aria-describedby="{input_id}-error"`.
* **Invalid State:** Fields failing validation immediately receive `aria-invalid="true"`.
* **Focus on Error:** When a form submission fails, keyboard focus is programmatically shifted to the first invalid input element.

### E. Motion & Sensory Sensitivities
Children and adults with sensory processing differences or vestibular disorders can experience severe nausea, dizziness, or seizures from autoplaying animations or unprompted motion:
* **Prefers-Reduced-Motion:** The platform strictly honors the `prefers-reduced-motion: reduce` OS media query. All transitions, scrolling carousels, and animations are immediately suppressed or replaced with instantaneous static cuts.
* **No Auto-Playing Media:** Audio, video, and sliding image carousels MUST NOT autoplay. Carousels must provide clear Pause, Previous, and Next buttons.
* **No Flashing Content:** No visual element may flash or flicker more than twice per second (violates 3-flash threshold, WCAG Criterion 2.3.1).

### F. Language & Cognitive Readability
* **Reading Level:** Body copy aims for clear, concise plain English (Grade 8 reading level baseline), avoiding complex administrative verbiage.
* **Acronym Disclosures:** Special education acronyms (e.g., IEP, OT, PT, SLP, RCI) must be fully spelled out upon their first occurrence on each page (e.g., *"Individualized Education Plan (IEP)"*).
* **Clear Link Text:** Ambiguous link labels such as "Click Here", "More", or "Read More" are strictly forbidden. Links must clearly describe their destination (e.g., *"Read more about our Early Intervention Programme"*).

