# OM OPEN MINDS — ThreeUI Sketchbook Website Integration

## 1. Executive Summary & Verification

The official ThreeUI component `MengToSketchbookLandingPage` (package: `@designcodeio/threeui`) has been fully integrated into the OM OPEN MINDS educational web application.

- **Canonical HTML Source:** `https://threeui.com/landing-pages/meng-to-sketchbook.html`
- **Canonical JSON Source:** `https://threeui.com/source-code/meng-to-sketchbook-landing-page.json`
- **Source Revision Verified:** SHA-256 `e0330548b1ac905cf1b81698163ffa29f8a3a8c39b8d39f9b71ba5b9255b6dd1`
- **Byte-Exact Canonical Backup:** Preserved at `public/landing-pages/meng-to-sketchbook.canonical.html`
- **All 17 Font & Illustration Assets:** Verified with 100% byte counts and SHA-256 hash matching under `public/landing-pages/meng-to-sketchbook/`.

---

## 2. Preserved Original ThreeUI Architecture & Mechanics

Every physical and interactive dimension of the original Meng To sketchbook engine has been strictly preserved without imitation:

1. **Curled Leaf 3D Physics:**
   - 18 nested strips (`N = 18`, `SPAN = 0.449`, peak curl `BETA = 0.60`).
   - Tangent sweeping through an arc with real paper bending physics rather than a rigid flat pivot.
   - Dynamic per-frame shadow (`--shade`) and specular gloss lighting (`--lit`, `--a1`, `--a2`).

2. **Interactive Magnifying Glass (Loupe):**
   - 2.3x magnification (`MAG = 2.3`).
   - Real-time masked clone of the book's canvas layer (`zoominner` synchronized via `syncZoomLayer()`).
   - Radial gradient feather masking with realistic brass bezel ring, lens glare, and walnut wooden grip.
   - Interactive draggable physics with automatic push-aside (`shoveLoupe()`) when a page leaf sweeps past.

3. **Zoom & Tilt Kinetics:**
   - Stage tilt responding smoothly to cursor position (`TILT_X = 4.5°`, `TILT_Y = 7°`).
   - Toolbar zoom controls (`zIn`, `zOut`, double-click to reset).
   - Touch-enabled drag gestures with flick velocity detection and spring settling loops (`animateTo`, `tweenTo`).

4. **Typography & Botanical Atmosphere:**
   - Instrument Serif (`instrument-serif.woff2`, `instrument-serif-italic.woff2`) for editorial headings.
   - Newsreader (`newsreader.woff2`) for editorial body prose and captions.
   - Warm paper ground (`#F5F0E6`), ink (`#302B26`), terracotta (`#C77B61`), botanical olive (`#78866B`), soft sage (`#DCE3D2`), and soft yellow (`#E8D79A`).
   - Original botanical illustrations (`botany-left.png`, `botany-right.png`, `bloom.png`, `divider.png`, `bg-wash.jpg`).

---

## 3. The Nine School Sketchbook Plates

The Singapore travel portfolio content has been replaced with nine school plates:

| Plate | Title | Subtitle | Visual Direction & Purpose |
|---|---|---|---|
| **01** | **Every Child Deserves a World of Possibilities** | *Educational Sanctuary* | Inviting school sanctuary with botanical seedlings, radiant sun motif, and core educational pillars (Individualized Learning, Communication, Practical Life). |
| **02** | **Every Journey Begins with Understanding** | *Founding Journey* | Illustrated open storybook, growing sprout, and collaborative path representing our founding purpose and family partnership. |
| **03** | **A Future Where Every Child Can Thrive** | *Vision & Core Values* | Majestic growing Tree of Potential illustrating institutional mission, vision, and core values: Kindness, Dignity, Growth, and Hope. |
| **04** | **Learning That Recognises Every Individual** | *Specialized Pathways* | Modular curriculum notebooks representing early developmental readiness, adaptive foundational academics, and life skills. |
| **05** | **Different Ways to Learn. Endless Ways to Grow.** | *Pedagogy & Care* | Multi-sensory palette, tactile wooden manipulatives, positive reinforcement, and total communication methods. |
| **06** | **Spaces That Encourage Discovery** | *Sensory Environments* | Architectural sketches of our Multisensory Calibration Room, Gross Motor Hall, and Therapeutic Courtyard. |
| **07** | **People Who Make a Difference** | *Faculty & Mentors* | Profile medallions for accredited special educators, therapy consultants, and developmental companions. |
| **08** | **Little Moments. Meaningful Milestones.** | *Celebrations & Growth* | Polaroid sketches highlighting Annual Sports Days, Art Showcases, and family fellowship milestones. |
| **09** | **Let's Begin This Journey Together** | *Admissions & Inquiries* | Illustrated quill, envelope, and wax seal guiding parents through confidential consultation and gentle campus walkthroughs. |

---

## 4. Editorial Index & Interaction

Below the 3D sketchbook hero, the **Editorial Index** displays all 9 plates in an editorial card grid:
- Numbered plates (`PLATE 01` through `PLATE 09`).
- Chapter titles and descriptive subtitles.
- Clicking any plate invokes `goTo(i)` on the 3D sketchbook, smoothly turning the book to that chapter and setting `aria-current="true"`.
- Fully responsive across desktop, tablet, and mobile with touch navigation.

---

## 5. Supabase & Admin Panel Integration

1. **Source of Truth:** The Phase 4 Admin Panel (`/admin/*`) remains the absolute source of truth.
2. **Dynamic Data Synchronization:**
   - On page mount, `HomePage.tsx` fetches published records via tested Supabase services:
     - `programmesService.getPublishedProgrammes()`
     - `facilitiesService.getPublishedFacilities()`
     - `teamService.getPublishedTeamMembers()`
     - `eventsService.getPublishedActivities()`
     - `contentService.getSiteSettings()`
   - Records are dispatched to the sketchbook frame via `window.postMessage({ type: 'OM_DATA_SYNC', payload })`.
   - Any updates made in the admin panel (creating a programme, updating faculty bio, editing campus address) immediately appear on the public sketchbook website.
3. **Confidential Admissions & Contact Processing:**
   - The interactive Admission Enquiry Form on Plate 09 transmits input securely via the parent React container to `enquiriesService.submitAdmissionEnquiry`.
   - Incorporates zero-friction honeypot spam protection (`hp_field`).
   - Adheres strictly to **Child Safeguarding**: zero collection or storage of clinical diagnoses, psychological evaluations, or medical history online.
