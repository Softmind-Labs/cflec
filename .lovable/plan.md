

# Step 3: Populate Module Content & Redesign Detail Page

## Two Parts

### Part A — SQL Migration: Update all 41 modules with exact curriculum content

A single SQL migration with `UPDATE` statements for every module, setting all 6 curriculum fields (`learning_objective`, `key_ideas`, `teaching_guide`, `practical_activity`, `assessment_check`, `progression_link`) to the exact text from the uploaded document. Modules matched by `title` + `stage_id` combination (deterministic). This also fixes the 5 major title/content discrepancies identified earlier.

### Part B — Redesign `src/pages/ModulePlayer.tsx`

The current page uses old certificate-level styling (`CERTIFICATE_INFO`, `CERT_COLORS`) and has no curriculum content display. Changes:

**Data fetching** — Also fetch the module's `stage` (via `stage_id`) and `band` (via `band_id`) to get stage title, color, certificate name, and band label.

**Header changes:**
- Replace green certificate badge → stage badge colored by `stages.color_primary` (e.g. "Stage 1: Primary")
- If `is_compulsory`, show red "Compulsory — All Levels" badge
- Meta line: `{duration} min · Stage {n}: {title} · {band.label} · {completed}/{total} complete`

**Sidebar changes ("About This Module" card):**
- Duration row: keep as-is
- Replace "Certificate" row → "Stage" row with colored dot + stage title
- Add "Band" row (only if module has a band — stages 1-3)
- Replace "Simulation" row → "Certificate" row showing `stage.certificate_name`
- "Your Progress" card: keep exactly as-is

**New: Tabbed content panel below video player (left column, same width as video):**
- **Tab 1 "Overview"** (default): Learning Objective (target icon + paragraph) + Key Ideas (lightbulb icon + bulleted list, split on ";")
- **Tab 2 "Activity & Assessment"**: Practical Activity (clipboard icon + paragraph) + separator + Assessment Check (circle-check icon + paragraph)
- **Tab 3 "What's Next"** (only if `progression_link` is not null): progression_link text with chevron-right icon

**Below tabs (still left column):** Collapsible Teaching Guide accordion, collapsed by default, light gray background. Only rendered if `teaching_guide` is not null.

**Tab styling:** Active tab underline uses stage accent color. Inactive tabs gray. Clean minimal design.

**Remove:** All `CERTIFICATE_INFO`, `CERT_COLORS`, `CertificateLevel` imports/references. Remove "Simulation: None" sidebar row.

**Keep unchanged:** Video player area, quiz section, "Your Progress" card logic, overall 65/35 layout.

## Files Changed

| File | Change |
|---|---|
| `supabase/migrations/[timestamp]_populate_module_content.sql` | UPDATE all 41 modules with exact curriculum text for 6 fields |
| `src/pages/ModulePlayer.tsx` | Full redesign: stage-based header, tabbed curriculum content, updated sidebar |

## Stage accent colors (reused from Modules page)
```
1 → #22c55e, 2 → #14b8a6, 3 → #1d4ed8, 4 → #1e3a5f, 5 → #000000, 99 → #CE1126
```

