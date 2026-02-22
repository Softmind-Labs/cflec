

# Visual Polish: Premium UI Refinement

## Overview

A comprehensive visual quality pass across the shared UI primitives and global styles. No layouts, routes, or component structures change -- only the CSS/class values that control how things look and feel.

## What Changes

### 1. Global Styles (`src/index.css`)

- Update `--radius` from `0.5rem` to `0.875rem` (14px) so all components using `rounded-lg` inherit the new card radius
- Add global base styles for typography: minimum font size 14px, heading weights/line-heights, body line-height 1.6
- Add smooth global transition on all interactive elements
- Add `cursor-pointer` on all clickable elements
- Remove glassmorphism utility classes (`.glass-card*`) per the "no glassmorphism" directive
- Add table row hover highlight utility

### 2. Card Component (`src/components/ui/card.tsx`)

- `Card`: Change to `rounded-[14px]` border-radius, new box-shadow `0 2px 16px rgba(0,0,0,0.07)`, hover state with `translateY(-2px)` and deeper shadow, `transition-all duration-250 ease-out`, internal padding increase
- `CardHeader`: Increase padding to `p-7`
- `CardContent`: Increase padding to `px-7 pb-7`
- `CardFooter`: Match padding `px-7 pb-7`

### 3. Button Component (`src/components/ui/button.tsx`)

- Base: `rounded-lg` (8px), `transition-all duration-200 ease-out`, add `active:scale-[0.98]` for press feedback, `cursor-pointer`
- Default size: `h-11 min-h-[44px] px-5` (44px min height, 20px+ horizontal padding)
- `sm` size: `h-10 min-h-[40px] px-4`
- `lg` size: `h-12 px-8`
- Default variant: add `shadow-sm hover:shadow-md hover:bg-primary/85`
- Outline variant: use brand color border `border-primary/30 text-primary hover:bg-primary/5 hover:border-primary`
- Destructive: add `shadow-sm hover:shadow-md`

### 4. Input Component (`src/components/ui/input.tsx`)

- `rounded-lg` (8px), `h-11 min-h-[44px]`, padding `px-4 py-3`
- Border: `border-[1.5px] border-primary/30`
- Focus: `focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]`
- Ensure `text-sm` minimum (14px with base size adjustment)

### 5. Textarea Component (`src/components/ui/textarea.tsx`)

- Same border/focus treatment as Input: `rounded-lg`, `border-[1.5px] border-primary/30`, focus glow
- Increase padding to `px-4 py-3`

### 6. Select Trigger (`src/components/ui/select.tsx`)

- Match Input styling: `rounded-lg`, `h-11 min-h-[44px]`, `border-[1.5px] border-primary/30`, matching focus states

### 7. Table Component (`src/components/ui/table.tsx`)

- `TableRow`: Ensure hover highlight is visible: `hover:bg-muted/60`
- `TableCell`: Ensure minimum text size

### 8. Sidebar Navigation (`src/components/layout/AppSidebar.tsx`)

- Active nav item: add `border-l-[3px] border-primary bg-primary/10` styling
- Hover: `hover:bg-primary/5`
- Consistent padding `py-3 px-4`
- Smooth transition on nav items

### 9. Tailwind Config (`tailwind.config.ts`)

- Update `--radius` usage: `lg: "0.875rem"` (14px), `md: "0.5rem"` (8px)
- No other config changes needed since colors/fonts are already correct

## Technical Details

### Files Modified (7 files)

| File | Change Summary |
|------|---------------|
| `src/index.css` | Global typography, min font size, radius variable, remove glass utilities, add smooth transitions |
| `src/components/ui/card.tsx` | Radius 14px, new shadows, hover lift, increased padding |
| `src/components/ui/button.tsx` | Radius 8px, min-height 44px, padding 20px+, active press, shadow states |
| `src/components/ui/input.tsx` | Radius 8px, height 44px, brand border, focus glow |
| `src/components/ui/textarea.tsx` | Match input styling |
| `src/components/ui/select.tsx` | Match input styling on trigger |
| `src/components/ui/table.tsx` | Row hover highlight |

### Files NOT Modified

- No page files changed (Dashboard, Modules, Simulator, etc.)
- No layout files changed (MainLayout, Footer, Header)
- No routing changes
- No color/branding changes
- `tailwind.config.ts` -- only the `borderRadius.lg` value updates

### Approach

All changes happen at the primitive/component level so every screen in the app benefits automatically. The existing Tailwind color system and CSS variables remain untouched.

