

# Step 1: Database Restructure & Data Seeding

## Current State
- **modules** table: 27 modules with wrong titles, uses `certificate_level` enum (green/white/gold/blue), UUID primary keys
- **No** `stages`, `bands`, or `certification_requirements` tables exist
- **profiles** table: missing `primary_stage_id` and `age` columns
- `user_progress`, `module_content`, `quizzes` all reference `modules.id` via foreign keys

## What This Migration Does
One large SQL migration file that:

### 1. Creates new tables
- **`stages`** (5 rows): stage_number, title, certificate_name, age ranges, colors, learning outcomes (JSONB)
- **`bands`** (9 rows): sub-groups within stages 1-3 (Band A/B/C, JHS 1/2/3, SHS 1/2/3)
- **`certification_requirements`**: per-stage requirements for earning certificates

### 2. Alters existing tables
- **`modules`**: Add columns `stage_id`, `band_id`, `learning_objective`, `key_ideas`, `teaching_guide`, `practical_activity`, `assessment_check`, `progression_link`, `is_compulsory`, `sort_order`. Drop old data, reseed with 41 correct modules + Module 99.
- **`profiles`**: Add `primary_stage_id` (integer) and `age` (integer) columns

### 3. Clears dependent data (pre-production reset)
- Delete `user_progress`, `module_content`, `quizzes` rows (they reference old module IDs)
- Delete old modules
- Seed 41 new modules + Module 99 with correct CFLP curriculum data

### 4. Enables RLS on new tables
- Read access for authenticated users on `stages`, `bands`, `certification_requirements`

## Files Changed

| File | Change |
|---|---|
| `supabase/migrations/[timestamp]_database_restructure.sql` | Single migration: create tables, alter modules/profiles, clear old data, seed stages/bands/modules/certification_requirements, enable RLS |

## Important Notes
- **No frontend/UI changes** in this step (per the document's instruction)
- This is a **destructive migration** — it deletes existing module data, user_progress, module_content, and quizzes. Acceptable for pre-production.
- The `certificate_level` enum (green/white/gold/blue) stays in the DB for now — we won't break existing code. It will be updated in a later step.
- `stages` and `bands` use `SERIAL` integer PKs. `modules` keeps its UUID pk but gains `stage_id` and `band_id` foreign keys.

