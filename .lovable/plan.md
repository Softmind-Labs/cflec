

# Step 2: Modules Page Restructure

## Summary
Replace the old certificate-level tabs (Green/White/Gold/Blue) with stage-based tabs fetched from the database. Group modules by bands within stages 1-3, show flat lists for stages 4-5, and add a Module 99 tab.

## Files to Change

### 1. `src/types/index.ts`
- Add `Stage` interface: `id`, `stage_number`, `title`, `certificate_name`, `total_modules`, `color_primary`, `color_secondary`, etc.
- Add `Band` interface: `id`, `name`, `label`, `stage_id`, `module_start`, `module_end`, `sort_order`
- Update `Module` interface: add `stage_id`, `band_id`, `learning_objective`, `key_ideas`, `is_compulsory`, `sort_order`, `estimated_minutes` (alias for `duration_minutes`), `practical_activity`, `assessment_check`, `progression_link`, `teaching_guide`
- Keep old types for now (other pages still use them)

### 2. `src/pages/Modules.tsx` — Full rewrite of data fetching and rendering

**Data fetching** (replace current `useEffect`):
- Fetch `stages` ordered by `stage_number`
- Fetch `bands` ordered by `sort_order`
- Fetch `modules` with `stage_id`, `band_id`, ordered by `sort_order`
- Fetch `user_progress` for current user

**State**:
- `activeTab`: string — `"stage-1"` through `"stage-5"` or `"module-99"` (default `"stage-1"`)
- Remove `CertificateLevel` dependency

**Tabs**: 6 tabs derived from `stages` rows + a hardcoded "Module 99" tab
- Each tab shows color dot from `stages.color_primary`, label like "Stage 1: Primary", and `completed/total` badge
- Module 99 tab uses red accent (#CE1126)

**Tab content for stages 1-3** (have bands):
- Sub-header: certificate name + progress count
- Group modules by `band_id`, render band sections with `band.label` as section header
- Module cards grid within each band

**Tab content for stages 4-5** (no bands):
- Sub-header: certificate name + progress count
- Flat grid of module cards

**Tab content for Module 99**:
- Sub-header with "Required at every level" note
- Single module card with "Compulsory — All Levels" badge

**Module card updates**:
- Description: use `module.learning_objective` instead of `module.description`
- Time: use `module.duration_minutes` (field already exists, now populated as `estimated_minutes` in seed)
- Remove "Simulation" badge (per spec)
- Lock logic: Module 1 within each stage is always unlocked; subsequent modules unlock when previous in same stage is completed

**Stats bar**: Already dynamic (`modules.length`), will auto-show 41. No code change needed.

**Remove**: All imports/references to `CERTIFICATE_INFO`, `CERT_COLORS`, `certAccentColors`, `CertificateLevel` from this file.

### 3. Stage accent colors
Define inline in `Modules.tsx` as a simple map from `stage_number` to color:
```
1 → #22c55e, 2 → #14b8a6, 3 → #1d4ed8, 4 → #1e3a5f, 5 → #000000, 99 → #CE1126
```

## No changes to
- Dashboard, Certificates, Landing, CourseDetail, or any other pages
- Database (Step 1 already complete)

