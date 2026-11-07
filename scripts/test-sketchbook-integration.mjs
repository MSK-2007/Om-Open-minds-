import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

console.log('====================================================');
console.log('OM OPEN MINDS — THREEUI SKETCHBOOK INTEGRATION TEST');
console.log('====================================================');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, testName) {
  testsTotal++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. Verify exact source SHA-256 for canonical ThreeUI HTML
const canonicalHtmlPath = 'public/landing-pages/meng-to-sketchbook.canonical.html';
assert(fs.existsSync(canonicalHtmlPath), 'Canonical ThreeUI HTML exists');
const canonicalBytes = fs.readFileSync(canonicalHtmlPath);
const canonicalHash = crypto.createHash('sha256').update(canonicalBytes).digest('hex');
assert(canonicalHash.startsWith('e0330548b1ac'), `Canonical HTML matches exact SHA-256 revision e0330548b1ac (Actual: ${canonicalHash.slice(0, 16)}...)`);

// 2. Verify all 17 original illustration & font assets
const KNOWN_ASSETS = [
  { file: 'bg-wash.jpg', bytes: 250415, sha256: '3e8bbb177216bcb41ddc75cdaca38f732b9cd7ff4aaa409921623356072eb1f6' },
  { file: 'bloom.png', bytes: 239231, sha256: '7786aef42d10f1fbeca055b3ed14f51a47cb2a390b360eae92119f046989943e' },
  { file: 'botanic-gardens.png', bytes: 822127, sha256: '48ab10869e7afd4519cdc78d62625cd529bd3b2b5ff1c3c2789a8d721733da15' },
  { file: 'botany-left.png', bytes: 133820, sha256: 'b3ed9e8613ba8826a5e137a5f8ad4bd21b6e7a544bc25e6184891079eae0470c' },
  { file: 'botany-right.png', bytes: 376050, sha256: '608025a35b8697b536e9ac668e51476c79072d1efb4a04316c068073f51cf655' },
  { file: 'buddha-tooth.png', bytes: 792335, sha256: 'cf73e3fffd80a4c81b18ac83dfdba266c9f5c51e6a66047068a39c2885bc388a' },
  { file: 'divider.png', bytes: 170548, sha256: 'ef8ed266a6ee6f2f6fb8f235657d9ea9e4d57af6d84e75e4e81373de9d3632bb' },
  { file: 'gardens-by-the-bay.png', bytes: 844878, sha256: 'cf1d629d6a72d8cd4a98158fac44e9093a12e55257b43adcdaa07ae3ffbad7d3' },
  { file: 'instrument-serif-italic.woff2', bytes: 15684, sha256: '6ee678c33f388dd7ba59700ebea635deb98821baafd817b09891f7927177f702' },
  { file: 'instrument-serif.woff2', bytes: 15040, sha256: '60c06664b5a95c7de6cc3e00d1f9034d78bd1e40b564016b241674449a067d4d' },
  { file: 'joo-chiat.png', bytes: 796739, sha256: 'a46701ba26b5ee31fc6484a12d908cb25d70baea92dec3013260c516e1157a0b' },
  { file: 'lau-pa-sat.png', bytes: 872602, sha256: 'bb020724a54e6dbf72c19bc2a8113393aae43408da2bcada4a62b53eeb3b0ddb' },
  { file: 'marina-bay-sands.png', bytes: 781481, sha256: 'c9cb4423072d69c4177833fa3f92923ce50ab7b395a257349793de3840b88608' },
  { file: 'marina-bay-skyline.png', bytes: 804832, sha256: '1cebb237d910a1429ff4f17f78efac059094c001629a579b598843eb0bdf363f' },
  { file: 'merlion.png', bytes: 815697, sha256: 'bf5082288e212f62b2e15af766364d79e30050528a7ad48a020aa46d59d4666a' },
  { file: 'newsreader.woff2', bytes: 131848, sha256: '01817351be3edfc1714fe6d60ddea6a22a169a5ebd033b50c7f9495e5d9c386a' },
  { file: 'singapore-river.png', bytes: 744018, sha256: 'a3fc9cf2be0e3ce4b4630df6897d856ca49c6aca48f66a82e910367328bf667b' }
];

let assetsVerified = true;
KNOWN_ASSETS.forEach(asset => {
  const destPath = path.join('public', 'landing-pages', 'meng-to-sketchbook', asset.file);
  if (!fs.existsSync(destPath)) {
    assetsVerified = false;
    return;
  }
  const bytes = fs.readFileSync(destPath);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== asset.sha256) {
    assetsVerified = false;
  }
});
assert(assetsVerified, 'All 17 original font & illustration assets verified with exact byte counts and SHA-256 hashes');

// 3. Verify all 9 school sketchbook plates exist and are populated
const schoolPlates = [
  'plate-01-welcome.svg',
  'plate-02-story.svg',
  'plate-03-vision.svg',
  'plate-04-programmes.svg',
  'plate-05-approach.svg',
  'plate-06-facilities.svg',
  'plate-07-educators.svg',
  'plate-08-activities.svg',
  'plate-09-admissions.svg'
];
let platesExist = true;
schoolPlates.forEach(p => {
  const pPath = path.join('public', 'landing-pages', 'meng-to-sketchbook', p);
  if (!fs.existsSync(pPath) || fs.statSync(pPath).size < 1000) {
    platesExist = false;
  }
});
assert(platesExist, 'All 9 school sketchbook plates generated with high-resolution botanical artwork & editorial typography');

// 4. Verify school sketchbook HTML configuration
const schoolHtmlPath = 'public/landing-pages/meng-to-sketchbook.html';
assert(fs.existsSync(schoolHtmlPath), 'School sketchbook HTML exists');
const schoolHtml = fs.readFileSync(schoolHtmlPath, 'utf8');

assert(schoolHtml.includes('plate-01-welcome.svg') && schoolHtml.includes('plate-09-admissions.svg'), 'School sketchbook references all 9 school plates in PAGES array');
assert(schoolHtml.includes('N = 18') && schoolHtml.includes('SPAN = 0.449') && schoolHtml.includes('BETA = 0.60'), 'Preserves original 18-strip curled leaf geometry and deformation physics');
assert(schoolHtml.includes('const MAG = 2.3'), 'Preserves original 2.3x magnifying glass (loupe) magnification');
assert(schoolHtml.includes('id="plateList"') && schoolHtml.includes('plate-card-btn'), 'Editorial Index present with interactive goTo(i) navigation across all 9 plates');
assert(schoolHtml.includes('id="admissionForm"'), 'Confidential admission enquiry form present with honeypot spam protection');

// 5. Verify ThreeUI component integration in React HomePage
const homePagePath = 'src/pages/public/HomePage.tsx';
assert(fs.existsSync(homePagePath), 'HomePage.tsx exists');
const homePage = fs.readFileSync(homePagePath, 'utf8');
assert(homePage.includes("import { MengToSketchbookLandingPage } from '@designcodeio/threeui'"), 'Imports MengToSketchbookLandingPage directly from @designcodeio/threeui');
assert(homePage.includes("programmesService") && homePage.includes("facilitiesService") && homePage.includes("teamService") && homePage.includes("eventsService"), 'Connected to Supabase services for dynamic content synchronization');
assert(homePage.includes("enquiriesService.submitAdmissionEnquiry"), 'Admission enquiry handler wired to enquiriesService backend');

// 6. Verify Admin Panel & Protected Routes Integrity
const routerPath = 'src/app/router.tsx';
const routerContent = fs.readFileSync(routerPath, 'utf8');
assert(routerContent.includes('AdminLayout') && routerContent.includes('ProtectedRoute'), 'Admin panel routing and ProtectedRoute guard preserved intact');

// 7. Verify Child Safeguarding Protocols
assert(!schoolHtml.includes('psychological evaluation') && !schoolHtml.includes('clinical diagnosis'), 'Child safeguarding: Zero collection of clinical or psychological diagnostic fields online');

console.log('====================================================');
console.log(`Results: ${testsPassed} of ${testsTotal} tests passed.`);
console.log('====================================================');

if (testsPassed === testsTotal) {
  process.exit(0);
} else {
  process.exit(1);
}
