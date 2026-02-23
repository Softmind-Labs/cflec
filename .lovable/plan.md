

# Complete Navigation & UI Overhaul — Top Nav, Full Width, Courses Page

## Design Reference Analysis

**Israel Bible Center** (screenshot analyzed): Dark-themed courses page with a clean top navigation bar (Logo left, nav links center, Login/Enroll right). Below nav: breadcrumb, heading with count, sort dropdown. Content area has left sidebar categories + right course cards grid. Cards use rich imagery with overlay text. The nav has no underline — just text links with dropdowns. Clean, editorial, content-first.

**Behance E-learning Dashboard** (screenshot analyzed): "Skillora" mockup — white background, pill-shaped top nav tabs (Dashboard, Bookmarks, Trending, etc.), generous whitespace, rounded cards with warm orange accents, analytics charts, schedule sidebar, course progress bars. Very generous spacing, rounded corners everywhere, soft shadows. The nav is horizontal tabs in a rounded container.

**Coursera** (screenshot analyzed): Two-tier nav — top thin bar (For Individuals/Business/Universities/Governments), main nav (Logo, Explore dropdown, Degrees, search bar, Log In, Join for Free). Content uses institution logos for social proof, trending course sections with compact list-style cards. Clean, functional, information-dense.

**Masterclass** (screenshot analyzed): Dark, cinematic. Top nav: Logo, Browse dropdown, search, Gifts, View Plans, Log In, Get MasterClass CTA. Hero with massive serif typography ("LEARN FROM THE BEST, BE YOUR BEST"), image grid of instructors. High contrast, premium feel, minimal navigation items.

## Design Decisions (Inspired by References)

1. **Nav style**: Hybrid of IBC + Masterclass — clean white bar with centered text links (not pills), active state uses bottom underline indicator (IBC style), right side has search + avatar dropdown (Masterclass pattern)
2. **Content layout**: Full-bleed hero sections like IBC/Masterclass, content sections constrained to 1280px like Coursera
3. **Courses page**: IBC-inspired with dark hero, category filters as pills (Behance-style rounded pills), card grid with color accents and Lucide icons (no emojis per instruction)
4. **Spacing**: Behance-level generous whitespace — 48px padding, 24px card gaps
5. **Cards**: Behance-inspired rounded corners, soft shadows, warm but professional

---

## Files to Create

### 1. `src/components/layout/TopNav.tsx`

Sticky top navigation bar:
- Height 68px, white bg, 1px bottom border `#f0f0f0`, sticky top-0, z-50
- **Left**: CFLEC logo (36px) + "CFLEC" in Fraunces 600 — links to `/dashboard` if authenticated, `/` if not
- **Center**: Dashboard, Modules, Courses, Simulator, Certificates — Inter 500 0.9rem `#52525b`, full-height flex items. Active route: brand primary color + 2px bottom border underline via `::after` pseudo-element (IBC style)
- **Right (logged in)**: Search icon (`Search` 20px), Bell icon (`Bell` 20px), Avatar circle (34px, initials, primary bg at 15%) with `DropdownMenu` containing Profile link and red Logout
- **Right (not logged in)**: "Log In" ghost button, "Get Started" primary button
- **Mobile (< md)**: Hide center links, show hamburger (`Menu`/`X`). Dropdown slides down with stacked 48px nav items, active gets left border + primary text. Closes on route change via `useEffect`
- Uses `useLocation()` for active matching via `pathname.startsWith()`, `useAuth()` for user state

### 2. `src/pages/Courses.tsx`

New Courses page with IBC-inspired layout:
- **Full-bleed dark hero** (`#0f0f0f`): Breadcrumb (Home > Courses), Fraunces heading "Short Courses", subtitle, 4 stats row (8 Courses, Free Access, Login Required, Ghana Focused)
- **Sticky filter bar** (top: 68px, z-40): Category pills — All, Investing, Banking, Trading, Crypto, Personal Finance. Active pill: brand primary bg + white text
- **4-column responsive grid** of 8 course cards:
  - Color band top (120px) with centered Lucide icon (not emoji) and category pill
  - Card body: title (Inter 700), subtitle (2-line clamp), meta row (duration + lessons), full-width outlined button, "Free · Login required" label
  - Icons: `TrendingUp`, `Landmark`, `BookOpen`, `ArrowLeftRight`, `Coins`, `PiggyBank`, `BarChart3`, `FileText`
  - Colors: unique per course (blues, greens, purples, ambers)
- Card click → `/courses/:slug`

### 3. `src/pages/CourseDetail.tsx`

Minimal "Coming Soon" placeholder:
- MainLayout wrapper
- Centered card with course name from slug, back button to `/courses`
- If not logged in: redirected by ProtectedRoute

---

## Files to Modify

### 4. `src/components/layout/MainLayout.tsx`

Remove sidebar entirely:
```
<div className="min-h-screen bg-[#f8f8f8]">
  <TopNav />
  <main className="w-full">{children}</main>
  <Footer />
</div>
```
- Remove `AppSidebar`, `SidebarProvider`, `SidebarTrigger`, `SidebarInset` imports
- `AppSidebar.tsx` file stays, just not rendered

### 5. `src/App.tsx`

- Import `Courses` and `CourseDetail`
- Add `/courses` as protected route
- Add `/courses/:slug` as protected route

### 6-17. Page Container Updates (~12 pages)

All inner pages replace `<div className="container py-8">` with:
```
<div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
```

Pages affected:
- `Dashboard.tsx` (lines 86, 104)
- `Modules.tsx` (lines 98, 114)
- `Simulator.tsx` (line 67)
- `Certificates.tsx` (lines 63, 79)
- `Profile.tsx` (line 91) — keep `max-w-4xl`
- `Leaderboard.tsx` (lines 79, 96)
- `SimulatorBanking.tsx` (line 50)
- `SimulatorInvestment.tsx` (lines 135, 149)
- `SimulatorTrading.tsx` (line 93)
- `SimulatorCapitalMarkets.tsx` (line 46)
- `Trade.tsx` (lines 221, 238)
- `ModulePlayer.tsx` (lines 127, 140, 159, 200)

### 18. `src/pages/kids/KidsLanding.tsx`

- Replace `bg-gradient-to-br from-kids-background via-background to-kids-secondary/10` with `bg-[#f8f8f8]`
- Keep card-level certificate gradient (functional, not decorative)

---

## What Does NOT Change

- `AppSidebar.tsx` — file kept, just not rendered
- `Index.tsx` — landing page has its own header/layout, not MainLayout
- `Auth.tsx` — has its own layout
- All images, routing logic, auth logic, data fetching
- Module gradient headers in `Modules.tsx` — card-level, not page-level
- Leaderboard rank gradients — data-contextual
- Feature card overlay gradients on `Index.tsx` — image overlays
- No `glass-card` references remain (already cleaned)

## Technical Notes

### TopNav Active Route Matching
```
/dashboard → Dashboard
/modules or /modules/* → Modules
/courses or /courses/* → Courses
/simulator or /simulator/* → Simulator
/certificates → Certificates
```

### Course Card Lucide Icons (replacing emojis per instruction)
| Course | Icon |
|--------|------|
| Investment Basics | `TrendingUp` |
| Banking & Accounts | `Landmark` |
| Financial Terms | `BookOpen` |
| Forex Explained | `ArrowLeftRight` |
| Crypto Basics | `Coins` |
| Budgeting & Saving | `PiggyBank` |
| Ghana Stock Market | `BarChart3` |
| T-Bills & Treasury | `FileText` |

### Implementation Order
1. Create `TopNav.tsx`
2. Update `MainLayout.tsx` (remove sidebar, add TopNav)
3. Create `Courses.tsx` + `CourseDetail.tsx`
4. Add routes in `App.tsx`
5. Update all page containers (~12 pages)
6. Clean up KidsLanding gradient

### Files Count: 3 new, ~15 modified

