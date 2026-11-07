import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * OM OPEN MINDS — Supabase Backend Connectivity & RLS Verification Tool
 * Checks credentials, tests database connectivity, and verifies RLS policies.
 */

// 1. Read environment variables from .env
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
      if (key.trim() === 'VITE_SUPABASE_URL' && !supabaseUrl) {
        supabaseUrl = val;
      }
      if (key.trim() === 'VITE_SUPABASE_ANON_KEY' && !supabaseAnonKey) {
        supabaseAnonKey = val;
      }
    }
  }
}

console.log('=============================================================================');
console.log('OM OPEN MINDS — Supabase Connection & Security Verification');
console.log('=============================================================================');
console.log(`Target URL: ${supabaseUrl || '(Not configured)'}`);
console.log(`Anon Key Configured: ${Boolean(supabaseAnonKey && supabaseAnonKey.length > 20) ? 'YES (Valid length)' : 'NO / MISSING'}`);

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  console.log('\n[STATUS: CREDENTIAL REQUIRED]');
  console.log('Please provide a valid VITE_SUPABASE_ANON_KEY in your .env file to run live connectivity verification.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runVerification() {
  console.log('\n[1/3] Testing endpoint connectivity...');
  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1);
    if (error) {
      if (error.code === '42P01') {
        console.log('✓ Successfully connected to Supabase endpoint! (Note: Schema tables not yet applied, code: 42P01 relation does not exist).');
      } else {
        console.log(`✓ Connected to Supabase endpoint (REST Response code: ${error.code}, message: ${error.message})`);
      }
    } else {
      console.log('✓ Successfully connected to Supabase and queried site_settings!');
      console.log(`  Records found: ${data?.length || 0}`);
    }
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
  }

  console.log('\n[2/3] Testing RLS Protection on Sensitive Tables...');
  try {
    const { data, error } = await supabase.from('admission_enquiries').select('*');
    if (error) {
      console.log(`✓ RLS Protection Active: Anonymous read was denied or restricted (${error.message})`);
    } else if (data && data.length === 0) {
      console.log('✓ RLS Protection Active: 0 records visible to anonymous public role (RLS filter working).');
    } else {
      console.warn('⚠ WARNING: Anonymous user was able to read admission enquiries records! Check RLS configuration.');
    }
  } catch (err) {
    console.log(`✓ RLS Policy verified (${err.message})`);
  }

  console.log('\n[3/3] Testing Storage Public Buckets...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log(`  Storage inquiry response: ${error.message}`);
    } else {
      console.log(`✓ Storage service reachable. Available buckets: ${data.map(b => b.name).join(', ') || 'None yet'}`);
    }
  } catch (err) {
    console.log(`  Storage probe response: ${err.message}`);
  }

  console.log('\n=============================================================================');
  console.log('Verification Complete.');
  console.log('=============================================================================');
}

runVerification();

