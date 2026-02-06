

# Fix Color Scheme, Add Sidebar Navigation, and Improve Auth Page

## Overview
This plan addresses three key improvements:
1. Update the color scheme from green to blue/gold to match the CFLEC logo
2. Replace the top header navigation with a professional left sidebar for authenticated pages
3. Improve the Auth page to default to signup when coming from "Start Learning Free"

---

## 1. Color Scheme Update (Blue & Gold)

### Current Issue
The primary color is set to green (`142 76% 36%`), but the CFLEC logo features blue and gold colors.

### Changes to `src/index.css`

**Update the following CSS variables in both light and dark modes:**

| Variable | Current (Green) | New (Blue) |
|----------|-----------------|------------|
| `--primary` | `142 76% 36%` | `217 91% 60%` |
| `--primary-foreground` | `0 0% 100%` | `0 0% 100%` |
| `--ring` | `142 76% 36%` | `217 91% 60%` |
| `--sidebar-primary` | `142 76% 36%` | `217 91% 60%` |
| `--sidebar-ring` | `142 76% 36%` | `217 91% 60%` |

The gold accent (`--cflp-gold: 45 93% 47%`) is already defined and will be used for highlights and special elements.

### Button Color Updates

Update CTA buttons throughout the app:
- Change `bg-cflp-green` to `bg-cflp-blue` for primary actions
- Use `bg-cflp-gold` for accent/highlight buttons
- Keep `bg-cflp-green` only for the Green certificate level indicator

**Files affected:**
- `src/index.css` - CSS variables
- `src/pages/Index.tsx` - Feature card buttons, portal buttons
- `src/pages/Dashboard.tsx` - Certificate and progress indicators

---

## 2. Left Sidebar Navigation

### Current Architecture
- Top header navigation in `src/components/layout/Header.tsx`
- `MainLayout` wraps authenticated pages with Header + Footer

### New Architecture
- Create `AppSidebar.tsx` component with left sidebar navigation
- Update `MainLayout.tsx` to use `SidebarProvider` + `Sidebar` instead of top Header
- Keep Header for mobile hamburger menu trigger
- Add logo, navigation items, and user profile to sidebar

### New File: `src/components/layout/AppSidebar.tsx`

```text
+---------------------------+
|     CFLEC Logo            |
+---------------------------+
|                           |
|  📊 Dashboard             |
|  📚 Modules               |
|  📈 Simulator             |
|  🏆 Certificates          |
|                           |
+---------------------------+
|  [User Avatar]            |
|  User Name                |
|  [Profile] [Logout]       |
+---------------------------+
```

**Navigation Items:**
- Dashboard (`/dashboard`) - LayoutDashboard icon
- Modules (`/modules`) - BookOpen icon
- Simulator (`/simulator`) - TrendingUp icon
- Certificates (`/certificates`) - Award icon

### Updated `src/components/layout/MainLayout.tsx`

```tsx
<SidebarProvider>
  <div className="min-h-screen flex w-full">
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        {/* Page title or breadcrumbs */}
      </header>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </SidebarInset>
  </div>
</SidebarProvider>
```

### Sidebar Features
- Collapsible on desktop (icon-only mode)
- Sheet/drawer on mobile
- Active route highlighting using NavLink
- Logo at top
- User profile and logout at bottom

---

## 3. Auth Page Improvements

### Current Issue
The "Start Learning Free" button on the landing page links to `/auth`, which defaults to the Login tab.

### Solution
Pass a query parameter to indicate signup mode: `/auth?mode=signup`

### Changes

**1. Update `src/pages/Index.tsx`:**
```tsx
<Link to="/auth?mode=signup">
  <Button>Start Learning Free</Button>
</Link>
```

**2. Update `src/pages/Auth.tsx`:**
- Read the `mode` query parameter from URL
- Set initial tab based on the parameter
- Default to 'login' if no parameter

```tsx
const [searchParams] = useSearchParams();
const initialTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
```

---

## 4. Footer Logo Update

### Changes to `src/components/layout/Footer.tsx`
- Replace the `GraduationCap` icon with the actual CFLEC logo image
- Import `cflecLogo` from assets

---

## Implementation Order

1. **Color Scheme** - Update CSS variables in `index.css`
2. **Landing Page Colors** - Update button colors in `Index.tsx`
3. **Auth Page** - Add query param support for signup mode
4. **Create AppSidebar** - New sidebar component
5. **Update MainLayout** - Integrate sidebar
6. **Update Footer** - Add logo
7. **Dashboard Colors** - Update progress indicators

---

## Files to Create
- `src/components/layout/AppSidebar.tsx`

## Files to Modify
- `src/index.css`
- `src/pages/Index.tsx`
- `src/pages/Auth.tsx`
- `src/pages/Dashboard.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/Footer.tsx`

---

## Technical Details

### Color Values Reference

| Color | HSL Value | Usage |
|-------|-----------|-------|
| Blue (Primary) | `217 91% 60%` | Primary buttons, links, sidebar accents |
| Gold | `45 93% 47%` | Highlights, special CTAs, accent elements |
| Green | `142 76% 36%` | Green certificate level only |
| White | `0 0% 95%` | White certificate level |

### Sidebar Configuration
- Width expanded: 16rem (256px)
- Width collapsed: 3rem (48px)
- Collapsible mode: icon
- Mobile: Sheet/drawer from left

