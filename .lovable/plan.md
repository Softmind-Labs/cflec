

# Step 4c: Landing Page Redesign — Premium, Clean, Modern

## File Changed
| File | Change |
|---|---|
| `src/pages/Index.tsx` | Refine hero, polish feature cards, fully redesign certificate section, fix copy |

## Changes by Section

### 1. Hero — Tighten
- **Shorten subtitle** to: "Ghana's certified financial literacy platform. Learn, earn certificates, and practice with our trading simulator — completely free."
- **Add bottom fade**: extend the dark gradient overlay so the hero blends smoothly into the next section (no hard edge)
- Everything else stays: headline, gold accent, video bg, nav, CTAs, pill badge

### 2. Feature Cards — Polish
- **Rename cards**: "Structured Learning" → "41 Modules", "Earn Certificates" → "5 Certificates"
- **Update subtitles**: "Progress through 27 expertly crafted modules" → "Structured video lessons from money basics to professional investing"; certificates subtitle → "Achieve Green, White, Gold, Blue, and Black certifications as you level up"
- **Add hover lift**: `hover:-translate-y-1 hover:shadow-xl transition-all duration-200` on each card wrapper

### 3. Certificate Section — Full Redesign
**Delete** the current 4-card grid with identical checklists. Replace with:

- Section bg: `bg-[#FAFAFA]`
- Heading: "Earn Recognized Certificates" + subtitle "Five levels of mastery — from money basics to professional investing"
- **Horizontal progression** (desktop): 5 compact vertical units in a row, connected by muted gray chevron-right icons (16px, `#d1d5db`)
- Each unit (top→bottom): 48px colored circle with white Award icon → bold "{Color} Certificate" → formal title in gray → module count pill → audience tag
- Black certificate gets a subtle gold ring (`ring-2 ring-[#d4a017]`) for premium feel
- **Mobile** (<768px): vertical stack, each unit = horizontal row (badge left, text right), chevrons point down
- **CTA** below: centered "Start Your Journey →" button, solid blue `#3b82f6`

Certificate data (hardcoded on landing page — no DB fetch):
| Color | Formal Title | Modules | Audience | Accent |
|---|---|---|---|---|
| Green | Foundation in Money Awareness | 10 | Ages 6–11 | #22c55e |
| White | Personal Financial Skills | 10 | Ages 12–15 | #9CA3AF |
| Gold | Wealth Building & Markets | 10 | Ages 16–18 | #d4a017 |
| Blue | Financial Systems & Investing | 5 | University+ | #1e3a5f |
| Black | Markets, Crypto & Wealth Strategy | 5 | Professionals | #000000 |

### 4. Adults & Kids Section — Fix Copy
- "27 modules" → "41 modules"
- "4 certificate levels" → "5 certificate levels"
- Everything else unchanged

### 5. Footer — No changes needed (no stale references)

## What's Removed
- The 4 identical Card components with Award icon + checklist (Video Lessons / Quizzes / Practical Simulations)
- `certificates` array and its `.map()` rendering
- Imports: `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` (no longer used)

## Design Notes
- No new fonts, no scroll animations, no parallax
- Hover effects: subtle translateY + shadow only on feature cards and CTA buttons
- Certificate section is the only place bright colors appear outside hero

