

# Comprehensive Final Fix — CFLEC Platform

## Scope

This plan covers 7 areas: certificate color constant, CourseDetail page rebuild, Simulator hub visual fix, ModulePlayer redesign, footer year fix, and font/badge consistency audit. Simulator modals (Part 7) are deferred — Trade.tsx already has a working trade dialog pattern; the other simulator pages need the same pattern replicated.

---

## Files to Create

### 1. `src/lib/cert-colors.ts` — Shared Certificate Color Constant

Single source of truth for certificate colors used across all pages:

```ts
export const CERT_COLORS = {
  green:  { accent: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  white:  { accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  gold:   { accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  blue:   { accent: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
} as const;
```

Import this in `Dashboard.tsx`, `Modules.tsx`, `Certificates.tsx`, `ModulePlayer.tsx` — replacing any local `certAccentColors` maps.

---

## Files to Modify

### 2. `src/pages/Certificates.tsx`

- Replace local `certAccentColors` with import from `src/lib/cert-colors.ts`
- Use `CERT_COLORS[level].accent` everywhere `accent` variable is used (already correct mapping, just centralize)

### 3. `src/pages/Modules.tsx`

- Replace local `certAccentColors` with import from `src/lib/cert-colors.ts`
- Use `CERT_COLORS[level].accent` for tab dots, section dots, module card tinted headers
- Module card header `style={{ backgroundColor: \`${accent}1f\` }}` stays — just uses centralized accent

### 4. `src/pages/Dashboard.tsx`

- Import `CERT_COLORS` from `src/lib/cert-colors.ts`
- Line 158: Certificate badge — use `CERT_COLORS[certProgress.current]` for bg/color/border instead of hardcoded green
- Line 394: Certificate sidebar section — replace `certificate-${level}` class with inline style using `CERT_COLORS[level]`

### 5. `src/pages/ModulePlayer.tsx` — Redesign

**Hero section (lines 158-198):**
- Remove `StatsBar` component usage
- Remove `<div className="bg-muted/50 border-b">` wrapper — replace with cleaner white bg section
- Add breadcrumb (already has BreadcrumbNav — keep)
- Certificate badge: use `CERT_COLORS[module.certificate_level]` for styling:
  - `bg: CERT_COLORS[level].bg`, `color: CERT_COLORS[level].accent`, `border: 1px solid CERT_COLORS[level].border`
  - `rounded-md` (6px), `px-2.5 py-0.5`, `text-xs font-semibold uppercase tracking-wider`
- Module title: keep `font-display` (already has it)
- Add inline meta row below description: Clock + duration · Award + cert name · Layers + progress — all `text-sm text-muted-foreground` in a flex row with dot separators
- Add slim progress bar (4px) below meta row using `CERT_COLORS[level].accent` as fill color

**Remove redundant progress card (lines 201-217):**
- Delete the "Module Progress" card entirely — replaced by inline progress bar above

**Sidebar module info card (lines 382-401):**
- Replace `Badge className={certificate-${module.certificate_level}}` with styled span using `CERT_COLORS`
- Simulation value: if has_simulation show Zap icon + "Included", else show "None" in muted color

**Quiz toast (line 110):**
- Replace `🎉` emoji with just text "Quiz Passed!"

### 6. `src/pages/CourseDetail.tsx` — Full Rebuild

Import courses data from Courses.tsx (extract courses array to a shared location or inline-duplicate it — simpler to duplicate since it's static data).

**Structure:**
- Full-bleed dark hero (`#0f0f0f`) with:
  - Breadcrumb: Home > Courses > [title] in white/40
  - Two columns (60/40):
    - Left: category badge (course accent at 20%), title (Fraunces 700 clamp), subtitle, meta row (clock+duration, bookopen+lessons), CTA button "Start Learning →"
    - Right: icon card (glass-like dark card with 64px Lucide icon in accent color, "Coming soon" badge)
- Content area (max-w-1280, 2 columns):
  - Left: "What You'll Learn" section (2-col grid of CheckCircle2 + topic text), "Course Lessons" section (numbered lesson rows with first = "Preview" badge, rest = Lock icon)
  - Right: Sticky enroll sidebar card (icon circle, "Free Course" Fraunces heading, details list, CTA button, "Free · No payment required" note)

Courses data (topics and lessons) will be generated per-course. Each course gets 4-6 "What You'll Learn" items and lesson titles matching their slug.

### 7. `src/pages/Simulator.tsx` — Visual Refinement

Replace the current tinted-background cards with clean white cards + left border accent:

- Remove `<div className="absolute inset-0 ${category.bgColor} opacity-50" />` overlay
- Remove `border-2 ${category.borderColor}` from card
- Add `border-l-4` with specific accent colors:
  - Banking: `#3b82f6`, Investment: `#16a34a`, Trading: `#d97706`, Capital Markets: `#6366f1`
- Icon containers: 52x52px, rounded-[14px], accent/10 bg, 24px icon in accent color
- Replace "4 Markets" Badge with plain muted text: `text-sm text-muted-foreground`
- Replace colored dot bullets with CheckCircle2 icons (14px, accent at 60%)
- Button: not full-width, `w-auto` + accent bg + white text + ArrowRight icon
- Card layout: `min-h-[280px] flex flex-col`, button pushed to bottom with `mt-auto`
- Remove leaderboard card `border-2 border-[hsl(var(--cflp-gold)/0.3)]`
- Remove info banner `border-2 border-primary/20`

### 8. `src/components/layout/Footer.tsx`

- Change `© 2024` to `© 2025`

### 9. `src/index.css` — Certificate CSS Classes

Update `.certificate-green/white/gold/blue` classes to use the correct hex colors matching `CERT_COLORS`:
- `.certificate-green`: bg `#16a34a`
- `.certificate-white`: bg `#3b82f6` (not actual white)
- `.certificate-gold`: bg `#d97706`
- `.certificate-blue`: bg `#6366f1`

---

## Simulator Modals (Part 7) — Separate Implementation

The Trade.tsx page already has a working trade dialog pattern. For Banking, Investment, Trading, and Capital Markets simulator pages, each "Trade"/"Buy"/"Sell"/"Invest" button needs a modal using the existing `Dialog` component. This is a significant functional addition (~200+ lines per page) and should be implemented as a follow-up task to keep this change focused on visual fixes.

---

## What Does NOT Change

- No routing changes
- No auth logic changes
- No data fetching changes
- No image changes
- No new dependencies
- AppSidebar.tsx stays unused

## Implementation Order

1. Create `src/lib/cert-colors.ts`
2. Update `src/index.css` certificate classes
3. Update `src/pages/Certificates.tsx` — import centralized colors
4. Update `src/pages/Modules.tsx` — import centralized colors
5. Update `src/pages/Dashboard.tsx` — import centralized colors, fix badge
6. Rebuild `src/pages/ModulePlayer.tsx` — hero, meta, progress bar, remove redundant card
7. Rebuild `src/pages/CourseDetail.tsx` — full course detail page
8. Refine `src/pages/Simulator.tsx` — clean cards, left borders, buttons
9. Fix `src/components/layout/Footer.tsx` — year

## Files Count: 1 new, 8 modified

