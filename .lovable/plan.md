

# Landing Page Redesign — World-Class Editorial Finance

## Scope
Visual-only redesign of `src/pages/Index.tsx` and supporting config. All existing images, logos, copy, links, and routes remain unchanged. No other pages affected.

## Files to Modify

### 1. `index.html` — Add Google Fonts
Add DM Serif Display + DM Sans font imports alongside existing Fraunces/Inter (which remain for internal pages):
```
DM Serif Display: 400 (hero display)
DM Sans: 400, 500, 600, 700 (landing body/UI)
```

### 2. `src/pages/Index.tsx` — Full Visual Redesign

**Top accent bar:**
- 2px fixed bar at very top of page, `background: linear-gradient(90deg, #E8A020, #2563EB)` — gold-to-blue, subtle editorial accent like Linear

**Navigation (header):**
- Transparent over hero, transitions to `bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5` on scroll (add scroll listener via useEffect + useState)
- Logo left, "Login" ghost button (DM Sans 500) + "Get Started" pill button right: `bg-[#0A0A0F] text-white rounded-full px-5 h-9 text-sm font-medium hover:bg-[#1a1a24]`

**Hero section:**
- Keep video background and full-viewport height
- Overlay: deeper gradient — `rgba(10,10,15,0.7)` top, `rgba(10,10,15,0.5)` mid, `rgba(10,10,15,0.85)` bottom
- "Trusted by 10,000+" pill: `bg-white/[0.06] border border-white/[0.1] backdrop-blur-md rounded-full px-4 py-1.5 text-[13px] text-white/70 font-[DM Sans]` — no shadow, glassmorphism
- Headline: DM Serif Display 400. "Master Your" in `text-white` at `clamp(3rem, 6vw, 5.5rem)`, tight leading (0.95). "Financial Future" in `text-[#E8A020]` same size. Letter-spacing: `-0.03em`
- Subtext: DM Sans 400, `max-w-[520px] text-white/60 text-[1.0625rem] leading-relaxed` — lighter, more editorial
- CTA: "Start Learning Free" — `bg-white text-[#0A0A0F] rounded-full h-12 px-8 font-semibold text-[0.9375rem] hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] transition-all duration-300`. "Kids Portal" — `bg-[hsl(var(--kids-primary))] text-white rounded-full h-12 px-8 font-semibold hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(168,85,247,0.3)]`
- Scroll indicator: smaller (h-6 w-6), `text-white/30`, animate-bounce

**Features section ("Everything You Need to Succeed"):**
- Background: `bg-[#F8F7F4]`
- Add section label above heading: `"PLATFORM FEATURES"` — DM Sans 600, `text-[11px] tracking-[0.2em] uppercase text-[#6B7280] mb-4`
- Heading: DM Serif Display 400, `text-[#0A0A0F] text-[2.5rem]`
- **Bento grid layout** — replace 4-col equal grid with asymmetric:
  - Row 1: 2 cards. Left card spans `col-span-7` (large, ~420px tall). Right card `col-span-5` (same height).
  - Row 2: 2 cards. Left `col-span-5`, Right `col-span-7`.
  - Use `grid-cols-12` for the 12-col system
  - Each card: `rounded-2xl overflow-hidden group cursor-pointer` with existing image as bg
  - Overlay: `bg-gradient-to-t from-[#0A0A0F]/90 via-[#0A0A0F]/30 to-transparent`
  - Content at bottom-left:
    - Category label: DM Sans 600, `text-[11px] tracking-[0.15em] uppercase text-white/50 mb-2`
    - Title: DM Sans 700, `text-[1.375rem] text-white mb-1`
    - Description: DM Sans 400, `text-[0.875rem] text-white/60 mb-4`
    - CTA button: `border border-white/30 text-white bg-transparent rounded-full px-5 h-9 text-[13px] hover:bg-white hover:text-[#0A0A0F] transition-all duration-300`
  - Hover: image `scale-[1.05]` (already exists), overlay darkens to `from-[#0A0A0F]/95`
  - Heights: Row 1 = `h-[420px] md:h-[480px]`, Row 2 = `h-[360px] md:h-[400px]`

**Certificates section:**
- Background: `bg-white`
- Section label: `"CERTIFICATION LEVELS"` tracked caps, `text-[#6B7280]`
- Heading: DM Serif Display
- Certificate color mapping for left borders:
  - Green: `#16a34a`, White: `#E5E7EB` (neutral gray since cert is "white"), Gold: `#E8A020`, Blue: `#2563EB`
- Each card: white bg, `border border-[#E5E7EB] rounded-2xl` with `border-l-4` in cert color
  - Subtle multi-layer shadow: `shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]`
  - Certificate name: DM Sans 700, `text-[1.125rem] text-[#0A0A0F]`
  - Description: DM Sans 400, `text-[#6B7280]`
  - Module range: pill badge `bg-[certColor]/10 text-[certColor] rounded-md px-2.5 py-0.5 text-xs font-medium`
  - Checkmarks: use `Check` icon (not CheckCircle) in the cert's accent color, 14px
  - Hover: `hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300`

**Learning Paths section:**
- Background: `bg-[#F8F7F4]`
- Section labels ("ADULTS & TEENS", "KIDS ZONE"): DM Sans 600, `text-[11px] tracking-[0.2em] uppercase` in accent color (`#2563EB` for adults, `hsl(var(--kids-primary))` for kids)
- Headings: DM Serif Display 400, `text-[#0A0A0F] text-[2rem] md:text-[2.5rem]`
- Body: DM Sans 400, `text-[#6B7280] text-[1.0625rem] leading-relaxed`
- Adult CTA: `bg-[#2563EB] text-white rounded-full h-12 px-8` with ArrowRight icon that translates right 4px on hover
- Kids CTA: `bg-[hsl(var(--kids-primary))] text-white rounded-full h-12 px-8` same hover pattern
- Images: `rounded-none md:rounded-l-2xl` on inner edge only (adults right image rounds left corners, kids left image rounds right corners) — edge-to-edge feel
- Spacing: `py-32` (generous 128px padding)

**Footer:**
- Background: `bg-[#0A0A0F]`
- Text: `text-white/40`, logo tinted, links `text-white/50 hover:text-white`
- Year: `© 2025`
- Thin border-top: `border-t border-white/[0.06]`

**Scroll animations:**
- Add a simple `useEffect` with IntersectionObserver to add a `.animate-in` class to each section
- Each section starts with `opacity-0 translate-y-5` and transitions to `opacity-100 translate-y-0` over `0.6s ease-out`
- Apply via a ref array or data attribute on each section

### 3. `tailwind.config.ts` — Add landing-specific animation keyframe

Add a `fade-up` keyframe and animation:
```
"fade-up": {
  "0%": { opacity: "0", transform: "translateY(20px)" },
  "100%": { opacity: "1", transform: "translateY(0)" }
}
```
Animation: `"fade-up": "fade-up 0.6s ease-out forwards"`

---

## Typography Strategy
- DM Serif Display + DM Sans are used **only on the landing page** (`Index.tsx`), applied via inline `style={{ fontFamily }}` or utility classes scoped to that page
- All internal pages (Dashboard, Modules, etc.) continue using Fraunces + Inter unchanged
- No changes to `tailwind.config.ts` font-family defaults — keeps internal pages stable

## Color Tokens Used (Landing Only)
- `#0A0A0F` — primary dark
- `#E8A020` — accent gold
- `#2563EB` — accent blue (CTAs)
- `#F8F7F4` — warm off-white surface
- `#6B7280` — muted text
- `#E5E7EB` — borders

## What Does NOT Change
- No routing changes
- No images, logos, or copy changed
- No other pages affected
- No font defaults changed for internal pages
- No new dependencies

## Files: 3 modified (`index.html`, `src/pages/Index.tsx`, `tailwind.config.ts`)

