

# UI/UX Restructuring: Coursera-Inspired Design System

## Coursera Design Analysis

After examining Coursera's homepage, browse/catalog page, course detail page, and certificate program page, here are the key design patterns worth adopting:

### What Coursera Does Well

1. **Top navigation bar** -- Clean horizontal top bar with logo, search, and CTA buttons. No sidebar on public/browse pages. Sidebar only appears inside the learner dashboard.

2. **Course cards** -- Thumbnail image on top, provider logo + name below, course title in bold, metadata (type, rating) in small muted text. Cards are simple, scannable, and uniform.

3. **Course detail page** -- A "hero banner" with breadcrumbs, provider branding, large title, instructor row, and a prominent CTA button ("Enroll for free"). Below that, a horizontal stats bar (modules count, rating, level, schedule, approval %). Then tabbed content (About, Outcomes, Modules, Reviews).

4. **Browse/catalog page** -- Category chips at top with icons, then filter tabs (All, Business, Data Science...), then a grid of course cards. Clean information hierarchy.

5. **Stats bar** -- A horizontally divided row of key metrics displayed in a lightly shaded container. Each metric has a bold number/label and a smaller description below.

6. **Visual hierarchy** -- Coursera uses very little color. Primary blue is reserved for CTAs and links only. Everything else is neutral grays and white. This makes the important actions pop.

7. **Typography** -- Large, confident headings with significant whitespace. Body text is well-spaced and readable.

8. **Breadcrumbs** -- Present on detail pages for clear wayfinding.

---

## What to Change in CFLEC (Without Changing Layout/Routing/Colors)

Since the constraint is "no layout, routing, or color changes," this plan focuses on adopting Coursera's visual communication patterns within the existing structure.

### 1. Modules Page (`src/pages/Modules.tsx`) -- Coursera Catalog Style

**Current**: Tab triggers with colored dots + badge counts, then a grid of cards with colored top bars.

**Proposed changes**:
- Add a stats summary row above the tabs (like Coursera's stats bar): total modules, completed, current streak -- displayed in a horizontal container with dividers
- Module cards: Add a subtle thumbnail/icon area at the top of each card (a colored gradient header with the module number prominently displayed, similar to Coursera course thumbnails)
- Add a progress indicator inside each card (thin progress bar at bottom showing video + quiz completion)
- Add breadcrumbs at the top: Dashboard > Modules > [Certificate Level]

### 2. ModulePlayer Page (`src/pages/ModulePlayer.tsx`) -- Coursera Course Detail Style

**Current**: Back button + badge + title, then progress card, then 2-column layout (video + quiz on left, info sidebar on right).

**Proposed changes**:
- Add a Coursera-style hero section at the top: light blue/gray background band containing the certificate level badge, module title (larger), description, and a horizontal stats bar (duration, certificate level, has simulation, completion status)
- Add breadcrumbs: Dashboard > Modules > [Module Title]
- The tabbed content idea from Coursera: instead of showing video and quiz simultaneously, add subtle tab navigation (Lesson, Quiz, Resources) -- but this is a layout change so we'll skip it
- Improve the "Module Info" sidebar card to look more like Coursera's side panel with clearer visual separation between info items

### 3. Dashboard Page (`src/pages/Dashboard.tsx`) -- Coursera My Learning Style

**Current**: Welcome heading, 4 stat cards, then 2-column layout with current module + upcoming modules on left, sidebar with simulator/leaderboard/certificates on right.

**Proposed changes**:
- Replace the `glass-card`, `glass-card-primary`, `glass-card-gold` class references (these were removed in the CSS but still referenced in Dashboard/Simulator) with clean standard card styling
- Add a "Continue Learning" section styled like Coursera's course rows: horizontal card with thumbnail, title, progress bar, and a "Resume" button
- Make the stat cards more Coursera-like: less decorative, more informational with clear number + label pairs

### 4. Simulator Page (`src/pages/Simulator.tsx`) -- Clean Up Glass References

**Current**: Uses `glass-card`, `glass-card-gold`, `glass-card-primary` classes that were removed from CSS.

**Proposed changes**:
- Remove all `glass-card*` class references (they no longer exist in CSS)
- Apply standard card styling consistently

### 5. Landing Page (`src/index.tsx`) -- Minor Refinements

**Current**: Video hero with serif headings, feature cards, certificate grid, portal selection.

**Proposed changes**:
- The `font-serif` class used on headings doesn't have a serif font imported -- either import one or remove it for consistency with Inter
- Add a horizontal "trust bar" similar to Coursera's "Learn from 350+ leading universities" -- show partner logos or credential badges in a horizontal scroll

### 6. Auth Page (`src/pages/Auth.tsx`) -- Already Clean

Minimal changes needed. The current login/signup flow is already well-structured.

---

## Technical Changes

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Remove `glass-card*` classes, refine stat cards, improve "Continue Learning" card |
| `src/pages/Modules.tsx` | Add stats summary bar above tabs, improve module card design with gradient header + progress bar, add breadcrumbs |
| `src/pages/ModulePlayer.tsx` | Add hero section with stats bar, add breadcrumbs, improve sidebar styling |
| `src/pages/Simulator.tsx` | Remove `glass-card*` references, clean up card styling |
| `src/pages/Certificates.tsx` | Minor: remove any glass references, ensure consistent card styling |
| `src/pages/Index.tsx` | Remove `font-serif` references (no serif font is loaded), replace with standard heading weight |
| `src/pages/kids/KidsLanding.tsx` | Remove backdrop-blur (conflicts with "no glassmorphism"), minor consistency fixes |
| `src/index.css` | Add Inter font import from Google Fonts, add breadcrumb utility styles, add stats-bar utility |

### Key Design Patterns to Implement

**A. Breadcrumbs Component**
Create a simple breadcrumb component used on Modules, ModulePlayer, Certificates pages. Matches Coursera's breadcrumb row with chevron separators.

**B. Stats Bar**
A horizontal row of 3-5 metrics in a lightly shaded container with vertical dividers. Used on:
- Modules page (total modules, completed, pass rate)
- ModulePlayer page (duration, level, quiz status)
- Dashboard (replaces current stat cards with a more compact version -- or keeps cards but adds a summary bar)

**C. Course Card Refresh**
Module cards get a colored gradient header area (using the certificate level color at low opacity) with the module number displayed prominently, then the title, description, and a bottom section with duration + action button.

**D. Clean Up Dead CSS Classes**
Remove all references to `glass-card`, `glass-card-primary`, `glass-card-gold` across all pages since these utility classes were removed from `index.css`.

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/breadcrumb-nav.tsx` | Reusable breadcrumb navigation component |
| `src/components/ui/stats-bar.tsx` | Horizontal stats row component (like Coursera's module/rating/level bar) |

### Implementation Order

1. Create shared components (breadcrumb-nav, stats-bar)
2. Add Inter font import to index.css and remove font-serif references
3. Clean up all glass-card references across pages
4. Update Modules page with stats bar + improved cards
5. Update ModulePlayer page with hero section + breadcrumbs
6. Update Dashboard with cleaner card styling
7. Update Simulator and remaining pages for consistency

