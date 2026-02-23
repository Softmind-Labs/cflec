

# Premium UI/UX Design Pass — Bloomberg Meets Masterclass

## Scope
Styling and visual presentation only. No changes to layouts, routing, component logic, or images.

## Files to Modify

### 1. `index.html` — Add Fraunces Font
- Add Fraunces to the Google Fonts `<link>` alongside Inter
- Weights: 500, 600, 700

### 2. `tailwind.config.ts` — Register Fraunces
- Add `display: ['Fraunces', 'Georgia', 'serif']` to `fontFamily`
- Keep existing `sans` and `serif` entries

### 3. `src/index.css` — Global Design Token Overhaul

**Light mode `:root`:**
- `--background`: change to warm off-white `#f8f8f8` (≈ `0 0% 97.3%`)
- `--foreground`: darken to `#0a0a0a` (≈ `0 0% 4%`)
- `--card`: keep `#ffffff`
- `--card-foreground`: `#0a0a0a`
- `--muted`: `#f4f4f5` (≈ `240 5% 96%`)
- `--muted-foreground`: `#71717a` (≈ `240 4% 46%`)
- `--border`: soften to `rgba(0,0,0,0.06)` equivalent (≈ `0 0% 94%`)
- `--input`: `#e4e4e7` equivalent for 1.5px solid border

**Base typography rules:**
- `body`: `font-size: 0.9375rem; line-height: 1.7; color: #3f3f46;`
- `h1`: `font-family: Fraunces; font-size: 2.25rem; font-weight: 600; line-height: 1.2; letter-spacing: -0.03em; color: #0a0a0a;`
- `h2`: `font-family: Inter; font-size: 1.375rem; font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; color: #111111;`
- `h3`: `font-family: Inter; font-size: 1.0625rem; font-weight: 600; line-height: 1.35;`
- Remove existing generic h1-h6 rules (letter-spacing: 0.3px conflicts with new -0.03em)

**Add utility classes:**
- `.font-display`: `font-family: Fraunces, Georgia, serif;`
- `.tabular-nums`: `font-variant-numeric: tabular-nums; font-feature-settings: "tnum";`
- `.text-gain`: `color: #16a34a;`
- `.text-loss`: `color: #dc2626;`
- `.text-flat`: `color: #71717a;`

**Transition rules:**
- Change `transition: all 0.25s ease` to `transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)` for interactive elements

### 4. `src/components/ui/card.tsx` — Premium Card Styling
- Border: `border border-[rgba(0,0,0,0.06)]` instead of just `border`
- Shadow: `shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.05)]`
- Hover shadow: `hover:shadow-[0_4px_12px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)]`
- Hover border: `hover:border-[rgba(0,0,0,0.1)]`
- Transition: `transition-all duration-200` with `cubic-bezier(0.4, 0, 0.2, 1)`
- Keep `rounded-[14px]` and `hover:-translate-y-0.5`
- Padding: `CardHeader` stays `p-7`, `CardContent` stays `px-7 pb-7`

### 5. `src/components/ui/button.tsx` — Refined Button Styling
- Default variant: add `shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]` hover: `hover:brightness-[1.06] hover:shadow-[0_3px_8px_rgba(0,0,0,0.15)] hover:-translate-y-px`
- Active: keep `active:scale-[0.98]` add `active:brightness-[0.97] active:translate-y-0`
- Secondary variant: `border-[1.5px] border-[#e4e4e7] bg-transparent text-[#3f3f46] hover:bg-[#f4f4f5] hover:border-[#d4d4d8]`
- Ghost variant: `hover:bg-[rgba(0,0,0,0.04)] hover:text-[#3f3f46]`
- Size default: `h-10 px-5` (40px), size sm: `h-9 px-4`, size lg: `h-11 px-8`
- Font: `font-medium text-[0.875rem] tracking-[0.01em]`
- Disabled: `disabled:opacity-[0.38]`

### 6. `src/components/ui/input.tsx` — Refined Input Styling
- Height: `h-10` (40px standard)
- Border: `border-[1.5px] border-[#e4e4e7]`
- Background: `bg-[#fafafa]`
- Focus: `focus-visible:border-primary focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.1)]`
- Font: `text-[0.9375rem] text-[#0f0f0f]`
- Placeholder: `placeholder:text-[#a1a1aa]`

### 7. `src/components/ui/progress.tsx` — Thin, Premium Progress Bar
- Root: `h-1 rounded-full bg-[#e4e4e7]` (4px → 4px kept, but default override to 4px)
- Indicator: `transition-all duration-[400ms] ease-out` (smooth fill animation)

### 8. `src/components/ui/badge.tsx` — No changes needed (already clean)

### 9. `src/components/ui/tabs.tsx` — Refined Tab Styling
- TabsList: keep current structure
- TabsTrigger active state: add content fade transition hint via `data-[state=active]:font-medium`

### 10. `src/components/layout/AppSidebar.tsx` — Premium Sidebar
- Sidebar bg: `#ffffff` (update CSS var `--sidebar-background: 0 0% 100%`)
- Remove box-shadow references if any
- Logo area: ensure border-bottom uses `#f4f4f5`
- Nav items: ensure `text-[0.875rem] font-[450]` (already close), color `#52525b`, gap `10px` between icon and text
- Active state: brand primary at 8% opacity bg, primary color text, `font-weight: 550` (use `font-medium` as closest)
- Hover: `bg-[#f4f4f5] text-[#0f0f0f]`
- User section: ensure border-top `#f4f4f5`

### 11. `src/pages/Index.tsx` — Landing Page
- Hero h1: add `font-display` class (Fraunces)
- Section h2s ("Everything You Need to Succeed", "Earn Recognized Certificates", "Choose Your Learning Path"): keep Inter (h2 role), ensure `text-[#111111]`
- Portal section h3s ("Master Financial Literacy", "Fun Financial Adventures"): add `font-display`
- No other changes — images and layout untouched

### 12. `src/pages/Dashboard.tsx` — Dashboard
- Welcome h1: add `font-display` class
- Stat card numbers (modules completed, quiz rate, streak): add `tabular-nums font-display` for the large numbers
- Remove background gradient `bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--cflp-gold)/0.05)]` — replace with plain `bg-background`
- Stat cards: add left accent border `border-l-[3px] border-primary/30`
- "Continue Learning" badge: keep as-is
- Module title in current module card: ensure Fraunces via `font-display`

### 13. `src/pages/Modules.tsx` — Modules Page
- Page h1 "Learning Modules": add `font-display`
- Module card number in gradient header: add `font-display` (already large, just needs font family)
- Module card title: keep Inter (h3 role)

### 14. `src/pages/ModulePlayer.tsx` — Module Player
- Module title h1: add `font-display`
- Quiz score display: add `tabular-nums`

### 15. `src/pages/Certificates.tsx` — Certificates
- Page h1: add `font-display`
- Certificate name in detail cards: add `font-display`
- Stat card numbers: add `tabular-nums`

### 16. `src/pages/Simulator.tsx` — Simulator Hub
- Page h1 "Market Simulator": add `font-display`
- Remove background gradient — plain `bg-background`
- Category card titles: keep Inter
- "$500.00" starting balance: add `tabular-nums`

### 17. `src/pages/simulator/SimulatorBanking.tsx` — Banking Simulator
- Page h1: add `font-display`
- T-Bill rate numbers (27.5%): add `tabular-nums font-display text-[2rem]` — these are display financial numbers
- FD Calculator results: add `tabular-nums`
- Results section bg: change `bg-muted/30` to `bg-[#f8f8f8] rounded-[10px]`
- Savings table: clean, no decoration (already good)

### 18. `src/pages/simulator/SimulatorInvestment.tsx` — Investment Simulator
- Page h1: add `font-display`
- Portfolio value numbers: add `tabular-nums`
- Stock prices: add `tabular-nums`
- Change %: ensure using pill badge style with subtle bg — currently plain text, wrap in small badge-like span with `bg-green-50 text-green-700` or `bg-red-50 text-red-700` for consistency with "change as badge" spec

### 19. `src/pages/simulator/SimulatorTrading.tsx` — Trading Simulator
- Page h1: add `font-display`
- Trading balance/P&L numbers: add `tabular-nums`
- Crypto prices: add `tabular-nums`
- Forex bid/ask: add `tabular-nums`

### 20. `src/pages/simulator/SimulatorCapitalMarkets.tsx` — Capital Markets
- Remove `glass-card-primary` and `glass-card` class references (lines 58, 65, 72) — replace with empty string
- Bond yields: add `tabular-nums`
- Page h1: add `font-display`

### 21. `src/pages/Leaderboard.tsx` — Leaderboard
- Remove `glass-card-primary` (line 144) and `glass-card` (line 206) — replace with empty string
- Remove background gradient — plain `bg-background`
- Page h1: add `font-display`
- Dollar amounts: add `tabular-nums`

### 22. `src/pages/Trade.tsx` — Trade Page
- Prices: add `tabular-nums`

### 23. `src/pages/Auth.tsx` — Auth Page
- Remove background gradient — use `bg-[#f8f8f8]`
- No font changes needed (no display headings here)

### 24. `src/pages/kids/KidsLanding.tsx` — Kids Landing
- Hero h1: add `font-display`
- Section h2s: keep Inter
- Certificate card title: add `font-display`

### 25. `src/pages/Profile.tsx` — Profile
- Page h1: add `font-display`

### 26. `src/components/ui/stats-bar.tsx` — Stats Bar
- Value text: add `tabular-nums` for numeric values
- Label text: `text-[0.8125rem] font-medium tracking-[0.01em] text-[#71717a]`

### 27. `src/components/simulator/DataBadge.tsx` — No changes needed (already clean)

### 28. `src/components/simulator/LiveBadge.tsx` — No changes needed

### 29. `src/components/layout/Footer.tsx` — No changes needed

### 30. `src/components/layout/MainLayout.tsx` — No changes needed (layout untouched)

---

## Summary of Changes by Category

**Fonts**: Import Fraunces, register in Tailwind, apply `font-display` to ~15 headings across pages

**CSS Variables**: Update `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--sidebar-background` for warm off-white canvas and refined text hierarchy

**Components**: Update card, button, input, progress primitives with refined shadows, borders, transitions

**Glass cleanup**: Remove 5 remaining `glass-card*` references in Leaderboard and CapitalMarkets

**Gradient cleanup**: Remove decorative page-level gradients from Dashboard, Simulator, Leaderboard, Auth

**Financial numbers**: Add `tabular-nums` class to ~30 number displays across simulator/dashboard pages

**Micro-interactions**: Refine transition timing to `cubic-bezier(0.4, 0, 0.2, 1)`, button active states

## Implementation Order
1. index.html + tailwind.config.ts (font setup)
2. src/index.css (design tokens + typography)
3. Primitive components: card, button, input, progress
4. Sidebar styling
5. All pages: font-display headings, tabular-nums, glass-card cleanup, gradient removal

## Files Count: ~20 files modified, 0 new files

