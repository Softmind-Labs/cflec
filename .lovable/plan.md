

# Step 4b: Update Stage Naming — Color Certificate Names

## Summary
Update stage titles to color names (Green/White/Gold/Blue/Black), update accent colors to match, and propagate the new display format across 4 pages + the color constants file.

## Part A — Database Update
Use the **insert tool** (not migration) to run UPDATE statements on the `stages` table:
- Stage 1: title → "Green", certificate_name → "Foundation Certificate in Money Awareness"
- Stage 2: title → "White", certificate_name → "Certificate in Personal Financial Skills"
- Stage 3: title → "Gold", certificate_name → "Certificate in Wealth Building & Markets"
- Stage 4: title → "Blue", certificate_name → "Certificate in Financial Systems & Investing"
- Stage 5: title → "Black", certificate_name → "Advanced Certificate in Markets, Crypto & Wealth Strategy"

Also update `color_primary` for stages 2, 3 if they don't already match:
- Stage 2: `#9CA3AF` (silver, not teal)
- Stage 3: `#d4a017` (gold, not blue)

## Part B — Update accent color constants in 3 files

**New color map** (replaces current in all files):
```
1 → #22c55e, 2 → #9CA3AF, 3 → #d4a017, 4 → #1e3a5f, 5 → #000000, 99 → #CE1126
```

Files with `STAGE_COLORS` or `COLOR_FALLBACKS`:
1. `src/pages/Modules.tsx` (line 22-29) — update STAGE_COLORS
2. `src/pages/ModulePlayer.tsx` (line 24-31) — update STAGE_COLORS
3. `src/pages/Certificates.tsx` (line 29-34) — update COLOR_FALLBACKS

## Part C — Label format changes

### `src/pages/Modules.tsx`
- **Tab labels** (line 243): `"Stage {n}"` → `"{title} Certificate"` (e.g. "Green Certificate")
- **Tab content heading** (line 280): `"Stage {n}: {title}"` → `"{title} Certificate"`
- **Sub-heading** (line 282): keep showing `certificate_name`

### `src/pages/ModulePlayer.tsx`
- **Header badge** (line 207): `"Stage {n}: {title}"` → `"{title} Certificate"` (e.g. "Green Certificate")
- **Meta line** (line 237): `"Stage {n}: {title}"` → `"{title} Certificate"`
- **Sidebar "Stage" row** (line 459): `"Stage {n}: {title}"` → `"{title} Certificate"`
- **Sidebar "Certificate" row** (line 472): keep showing `certificate_name` (no change needed)

### `src/pages/Certificates.tsx`
- **Summary cards**: show short form `"{title} Certificate"` instead of `"Stage {n}"`
- **Milestone card heading**: show `"{title} Certificate: {certificate_name}"`
- **Milestone subtitle**: `"Stage {n}: {title}"` → `"Stage {n}"`

### `src/pages/Dashboard.tsx`
- **Card 2 "Current Certificate"** (lines 150-170): Currently uses `CERTIFICATE_INFO` and `CERT_COLORS` with old green/white/gold/blue system. Replace with stage-based lookup:
  - Fetch stages data, find the user's current stage based on progress
  - Show `"{title} Certificate"` with stage accent color
  - Remove imports of `CERTIFICATE_INFO` from `@/types` and `CERT_COLORS` from `@/lib/cert-colors`

## Files Changed

| File | Change |
|---|---|
| Database (`stages` table) | UPDATE title, certificate_name, color_primary for stages 1-5 |
| `src/pages/Modules.tsx` | Update STAGE_COLORS, change labels to "{title} Certificate" format |
| `src/pages/ModulePlayer.tsx` | Update STAGE_COLORS, change labels to "{title} Certificate" format |
| `src/pages/Certificates.tsx` | Update COLOR_FALLBACKS, change labels to color certificate format |
| `src/pages/Dashboard.tsx` | Replace CERTIFICATE_INFO/CERT_COLORS usage with stage-based current certificate display |

