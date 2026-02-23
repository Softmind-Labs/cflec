

# Surgical UI/UX Fix — Dashboard, Certificates, Courses, Modules

## Scope
Styling and presentation only across 4 pages + 1 shared component. No functionality, routing, data, or image changes.

## Files to Modify

### 1. `src/components/ui/card.tsx` — Remove hover lift globally

Remove `hover:-translate-y-0.5` from the Card base class. Keep shadow and border hover changes only.

### 2. `src/pages/Dashboard.tsx` — Full stat card redesign + emoji removal

**Welcome section (lines 106-113):**
- Remove `👋` emoji from heading
- Change h1 to `font-display font-bold text-[2rem] text-[#0a0a0a]`
- Add decorative rule div below subtitle: `w-12 h-[3px] bg-primary rounded-full mt-3`

**Stat cards (lines 116-170) — complete restructure of all 4 cards:**

Each card gets this new internal structure:
- Top row: icon in 40px rounded-[12px] tinted circle (left), optional badge (right)
- Large number: Fraunces 700 2rem tabular-nums
- Label: Inter 500 0.8125rem uppercase tracking-[0.06em] #71717a
- Remove `border-l-[3px] border-l-primary/30` from cards 1, 3, 4

Card-by-card changes:
- **Card 1 (Modules):** BookOpen icon in primary/10 circle. Number `0/27`. Label "MODULES COMPLETED". Add 3px progress bar below.
- **Card 2 (Certificate):** Award icon in green (#16a34a) /10 circle. Replace current layout with a pill badge "GREEN" (bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]) + "0/10 modules" below. Label "CURRENT CERTIFICATE".
- **Card 3 (Quiz):** Target icon (import from lucide) in amber (#d97706) /10 circle. Number "0%". Sub "0 quizzes passed". Label "QUIZ PASS RATE".
- **Card 4 (Streak):** Flame icon (import from lucide) in orange (#f97316) /10 circle. Remove `🔥` emoji. Number "3". Sub "days · Keep it going!". Label "LEARNING STREAK".

**Continue Learning card (lines 175-203):**
- Change from `border-2 border-primary/20` white card to solid primary bg card
- `bg-primary rounded-[20px] p-8 text-white border-none shadow-[0_8px_32px_rgba(0,0,0,0.15)]`
- "Continue Learning" badge: `bg-white/15 text-white rounded-full px-3.5 py-1 text-xs font-medium`
- Module number: `text-white/60 text-sm`
- Title: `font-display font-semibold text-[1.5rem] text-white mt-4`
- Description: `text-white/70 text-[0.9375rem] mt-2 max-w-[480px]`
- Meta: `text-white/60` with clock icon
- Certificate badge: `bg-white/15 text-white` (soft, not loud)
- Button: `bg-white text-primary rounded-[10px] h-[42px] px-6 font-semibold` with ArrowRight icon. Hover: `bg-white/92`

**Trading Simulator card (line 273):**
- Remove `border-2 border-primary/20`, use default card border
- Clean white card with TrendingUp icon 20px primary
- Button: `variant="outline" w-full rounded-[10px]`

**Top Traders card (line 293):**
- Remove `border-2 border-[hsl(var(--cflp-gold)/0.3)]`
- Trophy icon stays with `text-[#d97706]`
- Rank circles: rank 1 gets `bg-[#fef9c3] text-[#ca8a04]`, others `bg-[#f4f4f5] text-[#52525b]`
- Circle size: 24px, Inter 700 0.75rem
- Amounts: `text-[#16a34a] tabular-nums`

### 3. `src/pages/Certificates.tsx` — Color identity + refined cards

**Page header (lines 81-87):**
- Remove icon from h1 (Award icon before "Your Certificates")
- Keep Fraunces font-display
- Add decorative rule: `w-12 h-[3px] bg-primary rounded-full mt-3`

**Certificate accent color map** — add a constant:
```
const certAccentColors = {
  green: '#16a34a', white: '#3b82f6', gold: '#d97706', blue: '#6366f1'
};
```

**Summary stat cards (lines 91-120):**
- Each card: use matching accent color for progress bar fill
- Active/current certificate card: add `border-[1.5px]` in accent color at 40% + `bg-[accentColor]/4`
- Numbers: `font-display font-bold text-[1.25rem] tabular-nums`

**Detail cards (lines 124-201):**
- Replace top `h-2 certificate-${level}` bar with left border: `border-l-4` in accent color
- Replace 16x16 round icon circle with 44px rounded-[12px] icon container in accent/12 bg
- Status badge (top right): "Locked" (bg-[#f4f4f5] text-[#a1a1aa] with Lock icon 12px), "In Progress" (accent/8 bg, accent text), "Earned" (bg-[#f0fdf4] text-[#16a34a] with CheckCircle2 12px)
- Certificate name: `font-display font-semibold text-[1.25rem]` in accent color
- Progress bar: 6px height, accent color fill, `bg-[#f4f4f5]` track
- Locked cards: `opacity-[0.65]`, gray out icon circle

### 4. `src/pages/Courses.tsx` — Hero cleanup + card refinements

**Hero section (lines 68-82):**
- Remove entire stats row (the 4-stat block with "8 Courses", "Free Access", etc.)
- Replace with single subtle line: `"8 short courses · Free with login · Ghana focused"` in `text-white/45 text-[0.875rem] mt-4`
- Reduce hero padding: `py-12 md:py-16` (from py-16 md:py-20)

**Course cards (lines 113-186):**
- Remove `hover:-translate-y-1` from card div — use only `hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.12)]`
- Remove `"Free · Login required"` text (line 182-184) entirely
- Category pill: change from `rounded-full` to `rounded-md` (6px), padding `px-2 py-0.5`
- Icon: reduce from `h-12 w-12` to `h-10 w-10`
- Color band: reduce from `h-[120px]` to `h-[110px]`
- Button: change from outline style with onMouseEnter/Leave to a tinted bg button:
  - Remove `variant="outline"`, onMouseEnter, onMouseLeave
  - Style: `bg-[${color}]/8 text-[${color}] border-none hover:bg-[${color}] hover:text-white`
  - Keep full width, rounded-lg, font-semibold

### 5. `src/pages/Modules.tsx` — Header cleanup + stats bar + module card refinement

**Page header (lines 123-131):**
- Remove BookOpen icon from h1 (line 124-126)
- Add decorative rule: `w-12 h-[3px] bg-primary rounded-full mt-3`

**Stats bar (lines 134-142):**
- Remove `🔥` emoji from streak value — replace with just `"3 days"`
- The StatsBar component already renders cleanly; just fix the emoji in the data

**Certificate tabs (lines 146-163):**
- Add colored dots per tab matching certificate level (already has `certificate-${level}` span)
- These look OK structurally — keep as-is

**Module cards (lines 180-238) — gradient header reduction:**
- Replace gradient header `h-24 bg-gradient-to-br ${levelColorMap[level]}` with flat tinted bg:
  - `h-20` (reduced height)
  - `bg-[certColor]/12` (flat, no gradient — using inline style)
- Module number: reduce from `text-3xl` to `text-lg`, color: `certColor/60`
- Simulation badge: change to `bg-primary/8 text-primary rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold` with Zap icon 10px before text
- Card hover: remove `hover:shadow-lg` (which includes lift via card base), just use default card hover (shadow + border only, no lift — already fixed in card.tsx)

---

## Implementation Order
1. `card.tsx` — remove hover lift (affects everything)
2. `Dashboard.tsx` — stat cards, emoji removal, continue learning card
3. `Certificates.tsx` — color identity, refined cards
4. `Courses.tsx` — hero cleanup, card fixes
5. `Modules.tsx` — header, stats, module card cleanup

## Files Count: 5 files modified, 0 new files

