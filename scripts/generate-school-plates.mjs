import fs from 'node:fs';
import path from 'node:path';

const outDir = 'public/landing-pages/meng-to-sketchbook';
fs.mkdirSync(outDir, { recursive: true });

function createSvgSpread({ plateNumber, plateSubtitle, leftTitle, leftLead, leftBody, leftIllustration, rightTitle, rightLead, rightSections, rightIllustration }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
  <defs>
    <!-- Paper texture & shadows -->
    <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.96   0 0 0 0 0.94   0 0 0 0 0.90  0 0 0 0.07 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in="coloredNoise" in2="SourceGraphic"/>
    </filter>

    <linearGradient id="book-shadow-left" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a2520" stop-opacity="0.12"/>
      <stop offset="85%" stop-color="#2a2520" stop-opacity="0.0"/>
      <stop offset="97%" stop-color="#2a2520" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#2a2520" stop-opacity="0.35"/>
    </linearGradient>

    <linearGradient id="book-shadow-right" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a2520" stop-opacity="0.38"/>
      <stop offset="3%" stop-color="#2a2520" stop-opacity="0.06"/>
      <stop offset="15%" stop-color="#2a2520" stop-opacity="0.0"/>
      <stop offset="100%" stop-color="#2a2520" stop-opacity="0.10"/>
    </linearGradient>

    <linearGradient id="paper-warmth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#faf6ee"/>
      <stop offset="50%" stop-color="#f5f0e6"/>
      <stop offset="100%" stop-color="#efe9dd"/>
    </linearGradient>

    <style>
      .display-font { font-family: 'Instrument Serif', Georgia, serif; }
      .body-font { font-family: 'Newsreader', Georgia, serif; }
      .ink { fill: #302b26; }
      .ink-soft { fill: #544b42; }
      .ink-faint { fill: #7c7267; }
      .terracotta { fill: #c77b61; }
      .botanical { fill: #78866b; }
      .botanical-stroke { stroke: #78866b; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .terracotta-stroke { stroke: #c77b61; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .ink-stroke { stroke: #302b26; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      .faint-stroke { stroke: #d8cebe; fill: none; stroke-linecap: round; }
    </style>
  </defs>

  <!-- Left Page Shape -->
  <path d="M 60,70 Q 60,60 70,60 L 872,55 Q 878,55 880,62 L 880,1178 Q 878,1185 870,1185 L 70,1180 Q 60,1180 60,1170 Z" fill="url(#paper-warmth)"/>
  <!-- Left Page Binding / Gutter Shadow -->
  <path d="M 60,60 L 880,55 L 880,1185 L 60,1180 Z" fill="url(#book-shadow-left)"/>

  <!-- Right Page Shape -->
  <path d="M 880,62 Q 882,55 888,55 L 1690,60 Q 1700,60 1700,70 L 1700,1170 Q 1700,1180 1690,1180 L 890,1185 Q 882,1185 880,1178 Z" fill="url(#paper-warmth)"/>
  <!-- Right Page Binding / Gutter Shadow -->
  <path d="M 880,55 L 1700,60 L 1700,1180 L 880,1185 Z" fill="url(#book-shadow-right)"/>

  <!-- Center Stitch & Spine Seam -->
  <line x1="880" y1="55" x2="880" y2="1185" stroke="#2a2520" stroke-width="1.8" stroke-opacity="0.45"/>
  <line x1="879" y1="55" x2="879" y2="1185" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.35"/>
  <!-- Thread Stitches along spine -->
  <g stroke="#8c7866" stroke-width="2" stroke-linecap="round" opacity="0.65">
    <line x1="874" y1="140" x2="886" y2="148"/>
    <line x1="874" y1="280" x2="886" y2="288"/>
    <line x1="874" y1="420" x2="886" y2="428"/>
    <line x1="874" y1="560" x2="886" y2="568"/>
    <line x1="874" y1="700" x2="886" y2="708"/>
    <line x1="874" y1="840" x2="886" y2="848"/>
    <line x1="874" y1="980" x2="886" y2="988"/>
    <line x1="874" y1="1120" x2="886" y2="1128"/>
  </g>

  <!-- Left Page Header Metadata -->
  <g transform="translate(130, 120)">
    <text class="body-font ink-faint" font-size="14" letter-spacing="4" font-weight="500">OM OPEN MINDS · SKETCHBOOK</text>
    <text class="body-font terracotta" font-size="14" letter-spacing="3" font-weight="600" x="520" text-anchor="end">PLATE ${plateNumber}</text>
    <line x1="0" y1="18" x2="520" y2="18" class="faint-stroke" stroke-width="1"/>
  </g>

  <!-- Right Page Header Metadata -->
  <g transform="translate(1090, 120)">
    <text class="body-font terracotta" font-size="14" letter-spacing="3" font-weight="600">${plateSubtitle.toUpperCase()}</text>
    <text class="body-font ink-faint" font-size="14" letter-spacing="3" font-weight="500" x="520" text-anchor="end">AUTUMN 2026</text>
    <line x1="0" y1="18" x2="520" y2="18" class="faint-stroke" stroke-width="1"/>
  </g>

  <!-- LEFT PAGE CONTENT -->
  <g transform="translate(130, 190)">
    <!-- Plate Title -->
    <text class="display-font ink" font-size="46" font-weight="400" y="40">${leftTitle}</text>
    <!-- Subtitle / Lead -->
    <text class="body-font terracotta" font-size="20" font-style="italic" y="85">${leftLead}</text>
    <!-- Divider botanical accent -->
    <path d="M 0,115 Q 40,110 80,115 T 160,115 M 80,105 Q 85,115 80,125" class="terracotta-stroke" stroke-width="1.2"/>

    <!-- Left Body Text -->
    <g transform="translate(0, 160)">
      ${leftBody}
    </g>

    <!-- Left Page Botanical / Illustrated Vignette -->
    <g transform="translate(0, 560)">
      ${leftIllustration}
    </g>
  </g>

  <!-- RIGHT PAGE CONTENT -->
  <g transform="translate(1090, 190)">
    <!-- Right Page Title -->
    <text class="display-font ink" font-size="38" font-weight="400" y="40">${rightTitle}</text>
    <text class="body-font ink-soft" font-size="18" font-style="italic" y="75">${rightLead}</text>
    <line x1="0" y1="95" x2="260" y2="95" class="terracotta-stroke" stroke-width="1.2"/>

    <!-- Right Sections / Cards -->
    <g transform="translate(0, 130)">
      ${rightSections}
    </g>

    <!-- Right Page Illustration Vignette -->
    <g transform="translate(0, 620)">
      ${rightIllustration}
    </g>
  </g>

  <!-- Subtle Page Numbers at Footer -->
  <text class="display-font ink-faint" font-size="18" x="140" y="1145">${parseInt(plateNumber, 10) * 2 - 1}</text>
  <text class="display-font ink-faint" font-size="18" x="1600" y="1145" text-anchor="end">${parseInt(plateNumber, 10) * 2}</text>
</svg>`;
}

// Generate all 9 Plates
const PLATES = [
  {
    number: '01',
    name: 'plate-01-welcome.svg',
    plateSubtitle: 'Educational Sanctuary',
    leftTitle: 'Every Child Deserves a World of Possibilities',
    leftLead: 'Welcome to OM OPEN MINDS — Specialized Learning & Discovery',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">Welcome to OM OPEN MINDS — an inclusive learning space</text>
      <text class="body-font ink-soft" font-size="18" y="32">dedicated to supporting children's individual growth,</text>
      <text class="body-font ink-soft" font-size="18" y="64">independence, and unique learning potential.</text>
      <text class="body-font ink-soft" font-size="18" y="116">Here, education adapts to the child. Every student is recognized</text>
      <text class="body-font ink-soft" font-size="18" y="148">as a whole person with distinct strengths, communicative</text>
      <text class="body-font ink-soft" font-size="18" y="180">expressions, and endless room to flourish.</text>
      <text class="body-font botanical" font-size="18" font-weight="600" y="240">Explore our tactile journal through touch, page turn, or loupe.</text>
    `,
    leftIllustration: `
      <!-- Illustrated Open Book & Sprout -->
      <g stroke="#78866b" stroke-width="1.6" fill="none" stroke-linecap="round">
        <path d="M 60,180 Q 140,140 220,180 Q 300,140 380,180 L 380,240 Q 300,200 220,240 Q 140,200 60,240 Z" fill="#faf6ee" opacity="0.9"/>
        <line x1="220" y1="180" x2="220" y2="240" stroke="#302b26" stroke-width="2"/>
        <path d="M 220,175 Q 220,110 200,80 Q 220,95 240,80 Q 220,110 220,175 Z" fill="#dce3d2"/>
        <path d="M 180,95 Q 220,115 220,150" stroke="#78866b"/>
        <path d="M 260,95 Q 220,115 220,150" stroke="#78866b"/>
      </g>
      <circle cx="220" cy="50" r="28" fill="#e8d79a" opacity="0.45"/>
      <text class="body-font ink-faint" font-size="14" font-style="italic" x="220" y="280" text-anchor="middle">Figure 1.1 · The Seedling of Independence</text>
    `,
    rightTitle: 'Core Educational Pillars',
    rightLead: 'A thoughtful synthesis of special education & developmental care',
    rightSections: `
      <!-- Card 1 -->
      <g transform="translate(0, 0)">
        <rect width="520" height="96" rx="8" fill="#faf7f0" stroke="#e0d6c5" stroke-width="1"/>
        <circle cx="36" cy="48" r="16" fill="#dce3d2"/>
        <text class="display-font botanical" font-size="20" x="36" y="54" text-anchor="middle">I</text>
        <text class="display-font ink" font-size="22" x="68" y="38">Individualized Learning Pathways</text>
        <text class="body-font ink-faint" font-size="15" x="68" y="66">Instruction calibrated to each learner’s pace and sensory profile.</text>
      </g>
      <!-- Card 2 -->
      <g transform="translate(0, 116)">
        <rect width="520" height="96" rx="8" fill="#faf7f0" stroke="#e0d6c5" stroke-width="1"/>
        <circle cx="36" cy="48" r="16" fill="#e8d79a"/>
        <text class="display-font terracotta" font-size="20" x="36" y="54" text-anchor="middle">II</text>
        <text class="display-font ink" font-size="22" x="68" y="38">Communication & Social Expression</text>
        <text class="body-font ink-faint" font-size="15" x="68" y="66">Empowering non-verbal, verbal, and alternative communication modes.</text>
      </g>
      <!-- Card 3 -->
      <g transform="translate(0, 232)">
        <rect width="520" height="96" rx="8" fill="#faf7f0" stroke="#e0d6c5" stroke-width="1"/>
        <circle cx="36" cy="48" r="16" fill="#f0dfd8"/>
        <text class="display-font terracotta" font-size="20" x="36" y="54" text-anchor="middle">III</text>
        <text class="display-font ink" font-size="22" x="68" y="38">Practical Life & Independence Skills</text>
        <text class="body-font ink-faint" font-size="15" x="68" y="66">Fostering daily living confidence, emotional regulation, and autonomy.</text>
      </g>
    `,
    rightIllustration: `
      <!-- Botanical wreath & school emblem -->
      <g transform="translate(160, 40)" opacity="0.85">
        <path d="M 0,60 C 20,10 60,0 100,0 C 140,0 180,10 200,60 C 180,110 140,120 100,120 C 60,120 20,110 0,60 Z" fill="none" stroke="#78866b" stroke-dasharray="4 3"/>
        <text class="display-font ink" font-size="24" x="100" y="55" text-anchor="middle">OM</text>
        <text class="body-font terracotta" font-size="13" letter-spacing="3" x="100" y="75" text-anchor="middle">OPEN MINDS</text>
      </g>
    `
  },
  {
    number: '02',
    name: 'plate-02-story.svg',
    plateSubtitle: 'Founding Purpose',
    leftTitle: 'Every Journey Begins with Understanding',
    leftLead: 'Our story, heritage, and ongoing commitment to every child',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">OM OPEN MINDS was established with a singular belief:</text>
      <text class="body-font ink-soft" font-size="18" y="32">that every child, irrespective of developmental challenges,</text>
      <text class="body-font ink-soft" font-size="18" y="64">possesses an inherent desire to learn, connect, and belong.</text>
      <text class="body-font ink-soft" font-size="18" y="116">By looking at education through a compassionate, structured lens,</text>
      <text class="body-font ink-soft" font-size="18" y="148">we create an environment where sensory differences are respected</text>
      <text class="body-font ink-soft" font-size="18" y="180">and small steps are celebrated as monumental milestones.</text>
    `,
    leftIllustration: `
      <g stroke="#78866b" stroke-width="1.4" fill="none">
        <path d="M 40,140 Q 140,40 260,140 T 480,140" stroke-dasharray="3 3"/>
        <circle cx="120" cy="98" r="8" fill="#c77b61"/>
        <circle cx="260" cy="140" r="10" fill="#78866b"/>
        <circle cx="400" cy="98" r="12" fill="#e8d79a"/>
      </g>
      <text class="body-font ink-faint" font-size="14" font-style="italic" x="260" y="185" text-anchor="middle">Figure 2.1 · Continuous Path of Collaborative Growth</text>
    `,
    rightTitle: 'Our Institutional Heritage',
    rightLead: 'Built on evidence-based special education practices',
    rightSections: `
      <g transform="translate(0, 0)">
        <text class="display-font ink" font-size="22" y="24">Founded on Empathy & Excellence</text>
        <text class="body-font ink-soft" font-size="16" y="54">Designed by special educators who recognized that mainstream</text>
        <text class="body-font ink-soft" font-size="16" y="80">pedagogy often leaves children with atypical development behind.</text>
      </g>
      <g transform="translate(0, 120)">
        <text class="display-font ink" font-size="22" y="24">Collaborative Family Partnership</text>
        <text class="body-font ink-soft" font-size="16" y="54">Parents and guardians are essential co-educators. We maintain</text>
        <text class="body-font ink-soft" font-size="16" y="80">regular consultations, shared home goals, and transparent reviews.</text>
      </g>
      <g transform="translate(0, 240)">
        <text class="display-font ink" font-size="22" y="24">Safe, Respectful Boundaries</text>
        <text class="body-font ink-soft" font-size="16" y="54">Every interaction protects child dignity, bodily autonomy, and</text>
        <text class="body-font ink-soft" font-size="16" y="80">privacy, adhering to international safeguarding standards.</text>
      </g>
    `,
    rightIllustration: `
      <path d="M 80,40 C 140,10 320,10 420,40" class="botanical-stroke" stroke-width="1.8"/>
      <circle cx="250" cy="30" r="4" fill="#78866b"/>
    `
  },
  {
    number: '03',
    name: 'plate-03-vision.svg',
    plateSubtitle: 'Vision & Mission',
    leftTitle: 'A Future Where Every Child Can Thrive',
    leftLead: 'Our guiding vision and institutional mission',
    leftBody: `
      <text class="display-font terracotta" font-size="24" y="0">Our Vision</text>
      <text class="body-font ink-soft" font-size="18" y="32">To be a leading center of excellence in special education,</text>
      <text class="body-font ink-soft" font-size="18" y="60">envisioning an inclusive society where children of all abilities</text>
      <text class="body-font ink-soft" font-size="18" y="88">are empowered to lead purposeful, fulfilling, and dignified lives.</text>
      
      <text class="display-font botanical" font-size="24" y="160">Our Mission</text>
      <text class="body-font ink-soft" font-size="18" y="192">To provide holistic, personalized, and nurturing education</text>
      <text class="body-font ink-soft" font-size="18" y="220">that fosters cognitive, communicative, physical, and emotional</text>
      <text class="body-font ink-soft" font-size="18" y="248">growth in an accessible, caring school environment.</text>
    `,
    leftIllustration: `
      <!-- Illustrated Tree of Learning -->
      <g transform="translate(180, 0)">
        <path d="M 80,180 Q 80,110 50,70 Q 80,85 110,70 Q 80,110 80,180 Z" fill="#8c7866"/>
        <circle cx="80" cy="50" r="50" fill="#dce3d2" opacity="0.6"/>
        <circle cx="50" cy="60" r="35" fill="#78866b" opacity="0.4"/>
        <circle cx="110" cy="60" r="35" fill="#e8d79a" opacity="0.5"/>
        <text class="body-font ink-faint" font-size="14" font-style="italic" x="80" y="210" text-anchor="middle">Figure 3.1 · The Tree of Potential</text>
      </g>
    `,
    rightTitle: 'Core School Values',
    rightLead: 'Principles that guide every classroom, lesson, and interaction',
    rightSections: `
      <g transform="translate(0, 0)">
        <text class="display-font ink" font-size="22" y="24">1. Unconditional Respect</text>
        <text class="body-font ink-soft" font-size="16" y="50">Honoring every child’s voice, neurodivergent traits, and tempo.</text>
      </g>
      <g transform="translate(0, 85)">
        <text class="display-font ink" font-size="22" y="24">2. Patient Persistence</text>
        <text class="body-font ink-soft" font-size="16" y="50">Understanding that mastery requires gentle, continuous repetition.</text>
      </g>
      <g transform="translate(0, 170)">
        <text class="display-font ink" font-size="22" y="24">3. Inclusive Belonging</text>
        <text class="body-font ink-soft" font-size="16" y="50">Cultivating an environment where children experience genuine fellowship.</text>
      </g>
      <g transform="translate(0, 255)">
        <text class="display-font ink" font-size="22" y="24">4. Integrity & Transparency</text>
        <text class="body-font ink-soft" font-size="16" y="50">Honest progress tracking and safeguarding with parents and carers.</text>
      </g>
    `,
    rightIllustration: `
      <g transform="translate(100, 30)">
        <rect x="0" y="0" width="300" height="60" rx="30" fill="#f5ede0" stroke="#d8cebe"/>
        <text class="body-font terracotta" font-size="15" font-weight="600" x="150" y="36" text-anchor="middle">"Kindness · Dignity · Growth · Hope"</text>
      </g>
    `
  },
  {
    number: '04',
    name: 'plate-04-programmes.svg',
    plateSubtitle: 'Curriculum & Pathways',
    leftTitle: 'Learning That Recognises Every Individual',
    leftLead: 'Approved educational programmes connected to Supabase',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">Each child follows an Individualized Education Programme (IEP)</text>
      <text class="body-font ink-soft" font-size="18" y="32">tailored to developmental readiness, sensory preferences,</text>
      <text class="body-font ink-soft" font-size="18" y="64">and functional living objectives.</text>
      <text class="body-font ink-soft" font-size="18" y="116">Curriculum data is dynamically managed via the administrative</text>
      <text class="body-font ink-soft" font-size="18" y="148">portal and reflects our verified special education pathways.</text>
      <text class="body-font botanical" font-size="16" font-style="italic" y="200">Educator-to-student ratios ensure personal attention & safety.</text>
    `,
    leftIllustration: `
      <g stroke="#78866b" stroke-width="1.2" fill="#faf7f0">
        <rect x="40" y="40" width="160" height="120" rx="6"/>
        <rect x="220" y="40" width="160" height="120" rx="6"/>
        <line x1="60" y1="70" x2="160" y2="70" stroke="#c77b61"/>
        <line x1="60" y1="95" x2="140" y2="95" stroke="#d8cebe"/>
        <line x1="240" y1="70" x2="340" y2="70" stroke="#78866b"/>
        <line x1="240" y1="95" x2="320" y2="95" stroke="#d8cebe"/>
      </g>
      <text class="body-font ink-faint" font-size="14" font-style="italic" x="210" y="195" text-anchor="middle">Figure 4.1 · Modular Curriculum Blocks</text>
    `,
    rightTitle: 'Specialized Learning Pathways',
    rightLead: 'Dynamic streams published from the school database',
    rightSections: `
      <g transform="translate(0, 0)">
        <rect width="520" height="90" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="34">Early Developmental Readiness</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="62">Sensory exploration, pre-academic concepts, and motor coordination.</text>
      </g>
      <g transform="translate(0, 105)">
        <rect width="520" height="90" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="34">Foundational Academic & Language</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="62">Adaptive literacy, numeracy, assisted technology, and communication.</text>
      </g>
      <g transform="translate(0, 210)">
        <rect width="520" height="90" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="34">Functional Life & Independence Skills</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="62">Self-care, community awareness, domestic skills, and personal autonomy.</text>
      </g>
    `,
    rightIllustration: `
      <text class="body-font terracotta" font-size="14" font-style="italic" x="260" y="30" text-anchor="middle">Scroll down below the sketchbook to view all live programmes.</text>
    `
  },
  {
    number: '05',
    name: 'plate-05-approach.svg',
    plateSubtitle: 'Pedagogy & Methodology',
    leftTitle: 'Different Ways to Learn. Endless Ways to Grow.',
    leftLead: 'Our verified teaching philosophy and adaptive pedagogy',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">No single pedagogical model fits every neurodivergent mind.</text>
      <text class="body-font ink-soft" font-size="18" y="32">Our educators utilize a multi-sensory, strengths-based approach</text>
      <text class="body-font ink-soft" font-size="18" y="64">combining visual schedules, tactile manipulatives, and total communication.</text>
      <text class="body-font ink-soft" font-size="18" y="116">We focus on meaningful mastery: skills that translate directly</text>
      <text class="body-font ink-soft" font-size="18" y="148">into domestic comfort, social participation, and emotional wellness.</text>
    `,
    leftIllustration: `
      <!-- Illustrated Art Palette & Learning Tools -->
      <g transform="translate(100, 20)">
        <ellipse cx="140" cy="80" rx="90" ry="60" fill="#faf7f0" stroke="#78866b" stroke-width="1.5"/>
        <circle cx="95" cy="70" r="10" fill="#c77b61"/>
        <circle cx="130" cy="55" r="10" fill="#e8d79a"/>
        <circle cx="165" cy="65" r="10" fill="#78866b"/>
        <circle cx="180" cy="95" r="10" fill="#dce3d2"/>
        <path d="M 190,130 L 140,80" stroke="#8c7866" stroke-width="4" stroke-linecap="round"/>
        <text class="body-font ink-faint" font-size="14" font-style="italic" x="140" y="170" text-anchor="middle">Figure 5.1 · Multi-Sensory Expression</text>
      </g>
    `,
    rightTitle: 'Pillars of Our Methodology',
    rightLead: 'Evidence-based methods that support whole-child development',
    rightSections: `
      <g transform="translate(0, 0)">
        <text class="display-font terracotta" font-size="20" y="24">1. Positive Behavioral Reinforcement</text>
        <text class="body-font ink-soft" font-size="15" y="50">Affirming successes and guiding self-regulation with predictable routines.</text>
      </g>
      <g transform="translate(0, 85)">
        <text class="display-font botanical" font-size="20" y="24">2. Visual & Structured Frameworks</text>
        <text class="body-font ink-soft" font-size="15" y="50">TEACCH-inspired task organization that reduces anxiety and confusion.</text>
      </g>
      <g transform="translate(0, 170)">
        <text class="display-font terracotta" font-size="20" y="24">3. Adaptive Sensory Diet</text>
        <text class="body-font ink-soft" font-size="15" y="50">Balancing movement breaks and quiet spaces for sensory regulation.</text>
      </g>
      <g transform="translate(0, 255)">
        <text class="display-font botanical" font-size="20" y="24">4. Total Communication</text>
        <text class="body-font ink-soft" font-size="15" y="50">Honoring speech, gestures, symbols, and assistive communication devices.</text>
      </g>
    `,
    rightIllustration: `
      <line x1="60" y1="40" x2="460" y2="40" class="terracotta-stroke" stroke-width="1.2"/>
    `
  },
  {
    number: '06',
    name: 'plate-06-facilities.svg',
    plateSubtitle: 'Campus & Facilities',
    leftTitle: 'Spaces That Encourage Discovery',
    leftLead: 'Purpose-built environments designed for safety & sensory balance',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">Our school environment is architected from the child’s</text>
      <text class="body-font ink-soft" font-size="18" y="32">perspective: natural daylight, soothing acoustics, wide</text>
      <text class="body-font ink-soft" font-size="18" y="64">barrier-free corridors, and dedicated sensory regulation spaces.</text>
      <text class="body-font ink-soft" font-size="18" y="116">Every facility published in our directory is verified for safety,</text>
      <text class="body-font ink-soft" font-size="18" y="148">accessibility, and developmental suitability.</text>
    `,
    leftIllustration: `
      <!-- Architectural Sketch Vignette -->
      <g stroke="#78866b" stroke-width="1.3" fill="none" transform="translate(100, 20)">
        <rect x="20" y="20" width="260" height="150" rx="4" fill="#faf7f0"/>
        <line x1="20" y1="60" x2="280" y2="60"/>
        <rect x="50" y="80" width="50" height="70" stroke="#c77b61"/>
        <rect x="130" y="80" width="50" height="70" stroke="#78866b"/>
        <rect x="210" y="80" width="50" height="70" stroke="#e8d79a"/>
        <text class="body-font ink-faint" font-size="14" font-style="italic" x="150" y="200" text-anchor="middle">Figure 6.1 · Sensory Room Architecture</text>
      </g>
    `,
    rightTitle: 'Verified Learning Environments',
    rightLead: 'Spaces crafted to engage, calm, and instruct',
    rightSections: `
      <g transform="translate(0, 0)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="32">Multisensory Calibration Room</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Fibre-optic lighting, vibro-acoustic seating, and tactile walls.</text>
      </g>
      <g transform="translate(0, 100)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="32">Adaptive Gross Motor Hall</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Soft foam landing zones, therapeutic swings, and balance circuits.</text>
      </g>
      <g transform="translate(0, 200)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink" font-size="20" x="24" y="32">Therapeutic Botanical Courtyard</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Sensory herbs, textured gravel paths, and quiet reflection gazebos.</text>
      </g>
    `,
    rightIllustration: `
      <text class="body-font terracotta" font-size="14" font-style="italic" x="260" y="30" text-anchor="middle">See full facility specifications with accessibility details below.</text>
    `
  },
  {
    number: '07',
    name: 'plate-07-educators.svg',
    plateSubtitle: 'Educators & Staff',
    leftTitle: 'People Who Make a Difference',
    leftLead: 'Qualified special educators, therapy mentors & compassionate staff',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">Our educators combine accredited qualifications with</text>
      <text class="body-font ink-soft" font-size="18" y="32">unwavering compassion. Continuous professional training ensures</text>
      <text class="body-font ink-soft" font-size="18" y="64">our methods remain evidence-based and trauma-informed.</text>
      <text class="body-font ink-soft" font-size="18" y="116">Staff profiles are managed directly through the administrative</text>
      <text class="body-font ink-soft" font-size="18" y="148">system to maintain verified credentials and transparency.</text>
    `,
    leftIllustration: `
      <!-- Illustrated Profile Medallions -->
      <g transform="translate(100, 30)" stroke="#78866b" stroke-width="1.4" fill="#faf7f0">
        <circle cx="60" cy="70" r="45"/>
        <circle cx="180" cy="70" r="45"/>
        <circle cx="120" cy="150" r="45"/>
        <text class="display-font botanical" font-size="24" x="60" y="78" text-anchor="middle">A</text>
        <text class="display-font terracotta" font-size="24" x="180" y="78" text-anchor="middle">B</text>
        <text class="display-font ink" font-size="24" x="120" y="158" text-anchor="middle">C</text>
      </g>
    `,
    rightTitle: 'Multidisciplinary Faculty Team',
    rightLead: 'Collaborating daily to support each student’s goals',
    rightSections: `
      <g transform="translate(0, 0)">
        <text class="display-font ink" font-size="22" y="24">Licensed Special Educators</text>
        <text class="body-font ink-soft" font-size="15" y="50">Classroom leaders directing curriculum adaptation and IEP tracking.</text>
      </g>
      <g transform="translate(0, 90)">
        <text class="display-font ink" font-size="22" y="24">Developmental Mentors & Aides</text>
        <text class="body-font ink-soft" font-size="15" y="50">One-on-one and small group companions assisting functional tasks.</text>
      </g>
      <g transform="translate(0, 180)">
        <text class="display-font ink" font-size="22" y="24">Therapy & Support Consultants</text>
        <text class="body-font ink-soft" font-size="15" y="50">Guidance on sensory diet, occupational integration, and communication.</text>
      </g>
    `,
    rightIllustration: `
      <text class="body-font botanical" font-size="14" font-style="italic" x="260" y="30" text-anchor="middle">Staff roster and verified qualifications are detailed below.</text>
    `
  },
  {
    number: '08',
    name: 'plate-08-activities.svg',
    plateSubtitle: 'Activities & Milestones',
    leftTitle: 'Little Moments. Meaningful Milestones.',
    leftLead: 'School celebrations, creative activities, and sensory journeys',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">From cultivating flowers in the courtyard to creative pottery,</text>
      <text class="body-font ink-soft" font-size="18" y="32">music circles, and festive assemblies, life at OM OPEN MINDS</text>
      <text class="body-font ink-soft" font-size="18" y="64">is vibrant and rich with joyous discovery.</text>
      <text class="body-font ink-soft" font-size="18" y="116">All imagery published in our journal adheres to strict child</text>
      <text class="body-font ink-soft" font-size="18" y="148">safeguarding consent verified by our administrative team.</text>
    `,
    leftIllustration: `
      <!-- Polaroid Sketch Vignettes -->
      <g stroke="#78866b" stroke-width="1.2" fill="#faf7f0" transform="translate(80, 20)">
        <g transform="rotate(-6 100 80)">
          <rect x="20" y="20" width="130" height="150" rx="3"/>
          <rect x="30" y="30" width="110" height="100" fill="#e8d79a" opacity="0.3"/>
          <text class="body-font ink-faint" font-size="12" x="85" y="152" text-anchor="middle">Annual Sports</text>
        </g>
        <g transform="rotate(8 220 80)">
          <rect x="180" y="20" width="130" height="150" rx="3"/>
          <rect x="190" y="30" width="110" height="100" fill="#dce3d2" opacity="0.4"/>
          <text class="body-font ink-faint" font-size="12" x="245" y="152" text-anchor="middle">Art Showcase</text>
        </g>
      </g>
    `,
    rightTitle: 'Upcoming Events & School Highlights',
    rightLead: 'Live event stream synchronized with Supabase calendar',
    rightSections: `
      <g transform="translate(0, 0)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font terracotta" font-size="18" x="24" y="30">UPCOMING</text>
        <text class="display-font ink" font-size="20" x="130" y="30">Sensory Gardening & Botany Day</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Hands-on planting, textured leaf rubbing, and courtyard picnic.</text>
      </g>
      <g transform="translate(0, 100)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font botanical" font-size="18" x="24" y="30">REGULAR</text>
        <text class="display-font ink" font-size="20" x="130" y="30">Weekly Rhythmic & Music Circle</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Percussion rhythms, melodic vocal exercises, and movement joy.</text>
      </g>
      <g transform="translate(0, 200)">
        <rect width="520" height="85" rx="6" fill="#faf7f0" stroke="#e0d6c5"/>
        <text class="display-font ink-soft" font-size="18" x="24" y="30">MILESTONE</text>
        <text class="display-font ink" font-size="20" x="130" y="30">Mid-Year Family Celebration</text>
        <text class="body-font ink-faint" font-size="15" x="24" y="60">Exhibition of student art portfolios and developmental achievements.</text>
      </g>
    `,
    rightIllustration: `
      <text class="body-font ink-faint" font-size="14" font-style="italic" x="260" y="30" text-anchor="middle">Full activity calendar and gallery available below.</text>
    `
  },
  {
    number: '09',
    name: 'plate-09-admissions.svg',
    plateSubtitle: 'Admissions & Inquiries',
    leftTitle: 'Let’s Begin This Journey Together',
    leftLead: 'Admissions guidance, parent consultations & campus contact',
    leftBody: `
      <text class="body-font ink-soft" font-size="18" y="0">Choosing the right educational sanctuary for your child is a deeply</text>
      <text class="body-font ink-soft" font-size="18" y="32">personal journey. Our admissions process is consultative, gentle,</text>
      <text class="body-font ink-soft" font-size="18" y="64">and transparent.</text>
      <text class="body-font ink-soft" font-size="18" y="116">We invite parents and caregivers to begin with a confidential enquiry.</text>
      <text class="body-font ink-soft" font-size="18" y="148">Our team will reach out to understand your child’s history and arrange</text>
      <text class="body-font ink-soft" font-size="18" y="180">a comfortable, unhurried campus visit.</text>
    `,
    leftIllustration: `
      <!-- Illustrated Quill, Envelope & Seal -->
      <g stroke="#78866b" stroke-width="1.3" fill="#faf7f0" transform="translate(100, 20)">
        <rect x="40" y="40" width="180" height="110" rx="4"/>
        <polyline points="40,40 130,105 220,40"/>
        <circle cx="130" cy="105" r="14" fill="#c77b61" stroke="none"/>
        <path d="M 230,160 L 270,30 Q 260,70 240,110 Z" fill="#8c7866" stroke="none"/>
        <text class="body-font ink-faint" font-size="14" font-style="italic" x="150" y="185" text-anchor="middle">Figure 9.1 · An Invitation to Connect</text>
      </g>
    `,
    rightTitle: 'Admissions & Campus Office',
    rightLead: 'Verified contact points and admissions procedure',
    rightSections: `
      <g transform="translate(0, 0)">
        <text class="display-font terracotta" font-size="22" y="24">1. Confidential Enquiry</text>
        <text class="body-font ink-soft" font-size="15" y="50">Submit your initial contact online or by telephone.</text>
      </g>
      <g transform="translate(0, 80)">
        <text class="display-font terracotta" font-size="22" y="24">2. Family Consultation</text>
        <text class="body-font ink-soft" font-size="15" y="50">A friendly discussion about developmental goals and needs.</text>
      </g>
      <g transform="translate(0, 160)">
        <text class="display-font terracotta" font-size="22" y="24">3. Campus Walkthrough</text>
        <text class="body-font ink-soft" font-size="15" y="50">Experience our quiet classrooms and meet our faculty in person.</text>
      </g>
      <g transform="translate(0, 240)">
        <text class="display-font terracotta" font-size="22" y="24">4. Collaborative Transition</text>
        <text class="body-font ink-soft" font-size="15" y="50">A gradual, comfortable introduction tailored to your child’s pace.</text>
      </g>
    `,
    rightIllustration: `
      <g transform="translate(60, 20)">
        <rect width="400" height="50" rx="25" fill="#c77b61"/>
        <text class="display-font" font-size="18" fill="#ffffff" x="200" y="32" text-anchor="middle">Submit Admission Enquiry Below</text>
      </g>
    `
  }
];

// Write all plates
PLATES.forEach(p => {
  const svgContent = createSvgSpread({
    plateNumber: p.number,
    plateSubtitle: p.plateSubtitle,
    leftTitle: p.leftTitle,
    leftLead: p.leftLead,
    leftBody: p.leftBody,
    leftIllustration: p.leftIllustration,
    rightTitle: p.rightTitle,
    rightLead: p.rightLead,
    rightSections: p.rightSections,
    rightIllustration: p.rightIllustration
  });
  const filePath = path.join(outDir, p.name);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`Generated ${p.name} (${svgContent.length} bytes)`);
});

console.log('All 9 sketchbook plates generated successfully!');
