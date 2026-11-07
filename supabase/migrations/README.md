# Supabase Migrations — OM OPEN MINDS

This directory stores database migrations managed via the Supabase CLI.

## Workflow

1. Install Supabase CLI: `npm install -D supabase` (or via `npx supabase`)
2. Link your project: `npx supabase link --project-ref <your-project-ref>`
3. Apply migrations: `npx supabase db push`
4. Pull schema changes: `npx supabase db pull`

## Baseline Schema Blueprint

The file `20260101000000_baseline_schema.sql` documents the initial schema structure, including tables, Row Level Security (RLS) policies, and foreign keys. In accordance with Phase 1 constraints, tables should be applied once the database instance is provisioned and client content schemas are finalized.

