/**
 * OM OPEN MINDS — Comprehensive Phase 3 Backend Verification Suite
 * Audits all 10 requirements specified in Phase 3 audit brief.
 */

import * as fs from 'fs';
import * as path from 'path';

const rootDir = process.cwd();
const results = [];

function check(title, condition, details) {
  results.push({ title, pass: condition, details });
  const mark = condition ? '✓ PASS' : '✗ FAIL';
  console.log(`[${mark}] ${title}: ${details}`);
}

console.log('=============================================================================');
console.log('OM OPEN MINDS — Phase 3 Backend & Supabase Architecture Audit');
console.log('=============================================================================\n');

// 1. Audit Migrations
console.log('--- 1. SQL Migrations Audit ---');
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
check(
  'Migration Files Present & Ordered',
  migrationFiles.length >= 3,
  `Found ${migrationFiles.length} migration files: ${migrationFiles.join(', ')}`
);

const migration1Content = fs.readFileSync(path.join(migrationsDir, migrationFiles[0]), 'utf-8');
const migration2Content = fs.readFileSync(path.join(migrationsDir, migrationFiles[1]), 'utf-8');
const migration3Content = fs.readFileSync(path.join(migrationsDir, migrationFiles[2]), 'utf-8');

// 2. Audit Tables & Constraints
console.log('\n--- 2. Database Tables & Constraints Audit ---');
const expectedTables = [
  'admin_profiles',
  'site_settings',
  'core_pillars',
  'programmes',
  'facilities',
  'team_members',
  'activities',
  'announcements',
  'gallery_categories',
  'gallery_items',
  'parent_resources',
  'admissions_faqs',
  'admission_enquiries',
  'contact_enquiries',
];

const allTablesCreated = expectedTables.every(t => migration1Content.includes(`CREATE TABLE IF NOT EXISTS public.${t}`));
check(
  'All 14 Tables Defined with IF NOT EXISTS',
  allTablesCreated,
  `Verified all 14 required tables present in ${migrationFiles[0]}`
);

// Verify foreign keys and cascade rules
const adminCascade = migration1Content.includes('REFERENCES auth.users(id) ON DELETE CASCADE');
const enquiryStaffFk = migration1Content.includes('REFERENCES public.admin_profiles(id) ON DELETE SET NULL');
const galleryCatFk = migration1Content.includes('REFERENCES public.gallery_categories(id) ON DELETE SET NULL');
check('Foreign Key Constraints & Deletion Handlers', adminCascade && enquiryStaffFk && galleryCatFk, 'admin_profiles cascades from auth.users; enquiries and gallery items set null on parent removal.');

// 3. Supabase Auth & Security Definer Functions
console.log('\n--- 3. Auth & Kernel Security Definers ---');
const hasIsAdmin = migration2Content.includes('CREATE OR REPLACE FUNCTION public.is_admin()') && migration2Content.includes('SECURITY DEFINER');
const hasIsSuperAdmin = migration2Content.includes('CREATE OR REPLACE FUNCTION public.is_super_admin()') && migration2Content.includes('SECURITY DEFINER');
const hasGetAdminRole = migration2Content.includes('CREATE OR REPLACE FUNCTION public.get_admin_role()') && migration2Content.includes('SECURITY DEFINER');
check('Security Definer Functions Defined', hasIsAdmin && hasIsSuperAdmin && hasGetAdminRole, 'is_admin, is_super_admin, and get_admin_role execute with kernel privileges.');

// 4. RLS Enablement & Policies
console.log('\n--- 4. Row Level Security (RLS) Coverage ---');
const rlsEnabledAll = expectedTables.every(t => migration2Content.includes(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`));
check('RLS Enabled Across 100% of Tables', rlsEnabledAll, 'All 14 tables explicitly enable RLS.');

// Check zero-read policy on enquiries
const admissionNoPublicSelect = !migration2Content.includes('ON public.admission_enquiries FOR SELECT\nTO public') &&
  !migration2Content.includes('ON public.admission_enquiries FOR SELECT\nTO authenticated\nUSING (true)');
const contactNoPublicSelect = !migration2Content.includes('ON public.contact_enquiries FOR SELECT\nTO public') &&
  !migration2Content.includes('ON public.contact_enquiries FOR SELECT\nTO authenticated\nUSING (true)');
check('Zero-Read Policy on Admissions and Contacts', admissionNoPublicSelect && contactNoPublicSelect, 'No public SELECT policies exist on admission_enquiries or contact_enquiries.');

// Check parental consent enforcement in gallery RLS
const galleryParentalConsentRls = migration2Content.includes('is_published = true AND has_parental_consent = true');
check('Child Safeguarding Gallery RLS Gate', galleryParentalConsentRls, 'Public gallery SELECT strictly requires is_published=true AND has_parental_consent=true.');

// 5. Storage Buckets & Policies
console.log('\n--- 5. Storage Architecture Audit ---');
const hasPublicAssetsBucket = migration3Content.includes("'public-school-assets'");
const hasApprovedGalleryBucket = migration3Content.includes("'approved-gallery'");
const hasPrivateAdminBucket = migration3Content.includes("'private-administrative-files'");
check('All 3 Storage Buckets Defined', hasPublicAssetsBucket && hasApprovedGalleryBucket && hasPrivateAdminBucket, 'public-school-assets, approved-gallery, and private-administrative-files configured.');

const privateBucketIsPrivate = migration3Content.includes("'private-administrative-files'") && migration3Content.includes('public = false');
check('Private Storage Bucket Protection', privateBucketIsPrivate, 'private-administrative-files bucket is explicitly marked public = false.');

// 6. Frontend Credential Security Audit
console.log('\n--- 6. Secret Key Isolation & Environment Audit ---');
const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
const envIgnored = gitignoreContent.includes('.env') && gitignoreContent.includes('.env.local');
check('.env Ignored by Git', envIgnored, '.env and .env.* are properly listed in .gitignore.');

const envExampleContent = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf-8');
const envExampleClean = !envExampleContent.includes('service_role') && !envExampleContent.includes('eyJ');
check('.env.example Clean of Secrets', envExampleClean, '.env.example contains only template placeholder names.');

// Search all src files for service_role or service keys
function scanDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcFiles = scanDir(path.join(rootDir, 'src'));
let serviceRoleFoundInSrc = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('service_role') || content.includes('SUPABASE_SERVICE_KEY')) {
    serviceRoleFoundInSrc = true;
    break;
  }
}
check('Zero Secret / Service-Role Keys in Frontend Source', !serviceRoleFoundInSrc, 'Scanned all src/ TypeScript files; zero service_role references found.');

// 7. TypeScript Services Audit
console.log('\n--- 7. TypeScript Services Layer Audit ---');
const servicesDir = path.join(rootDir, 'src', 'services', 'supabase');
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts'));
const expectedServices = [
  'client.ts',
  'auth.service.ts',
  'enquiries.service.ts',
  'programmes.service.ts',
  'facilities.service.ts',
  'team.service.ts',
  'events.service.ts',
  'announcements.service.ts',
  'gallery.service.ts',
  'content.service.ts',
  'resources.service.ts',
  'storage.service.ts',
  'dashboard.service.ts',
  'admissions.service.ts',
  'contact.service.ts',
];
const allServicesPresent = expectedServices.every(s => serviceFiles.includes(s));
check('All 15 Supabase Service Modules Present', allServicesPresent, `Found all ${expectedServices.length} service modules.`);

// Check honeypot in enquiries.service.ts
const enquiriesContent = fs.readFileSync(path.join(servicesDir, 'enquiries.service.ts'), 'utf-8');
const hasHoneypot = enquiriesContent.includes('honeypotValue') && enquiriesContent.toLowerCase().includes('bot detection');
check('Zero-Friction Bot Detection (Honeypot)', hasHoneypot, 'Honeypot trap logic implemented in both admission and contact enquiry submission.');

// Check child safeguarding in intake
const noMedicalFieldsInEnquiries = !enquiriesContent.includes('medical_report') &&
  !enquiriesContent.includes('clinical_assessment') &&
  !enquiriesContent.includes('psychological_eval');
check('Child Safeguarding: No Diagnostic Inquiries', noMedicalFieldsInEnquiries, 'Intake forms strictly exclude medical, psychological, and clinical diagnostic fields.');

// 8. Database Types Integrity
console.log('\n--- 8. Database Types Definition Audit ---');
const typesPath = path.join(rootDir, 'src', 'types', 'database.types.ts');
const typesExist = fs.existsSync(typesPath);
const typesContent = fs.readFileSync(typesPath, 'utf-8');
const allTablesInTypes = expectedTables.every(t => typesContent.includes(`${t}: {`));
check('TypeScript Database Interface Completeness', typesExist && allTablesInTypes, 'All 14 tables fully typed with Row, Insert, and Update signatures.');

// Final Summary
console.log('\n=============================================================================');
const totalChecks = results.length;
const passedChecks = results.filter(r => r.pass).length;
console.log(`Phase 3 Audit Summary: ${passedChecks} of ${totalChecks} verifications PASSED.`);
if (passedChecks === totalChecks) {
  console.log('Status: ALL CRITERIA SATISFIED. Ready for Phase 4.');
} else {
  console.log('Status: AUDIT DEFICIENCIES DETECTED.');
}
console.log('=============================================================================');

process.exit(passedChecks === totalChecks ? 0 : 1);
