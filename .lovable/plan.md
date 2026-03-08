

# Landing Page: Complete Rewrite — One Story, One Flow

## Summary
Full rewrite of `src/pages/Index.tsx` replacing the disconnected section layout with a narrative-driven 5-section page: Hook → System → Journey → Everyone → Close.

## File Changed
| File | Change |
|---|---|
| `src/pages/Index.tsx` | Complete rewrite of page body |

## Section-by-Section

### 1. Hero — Keep + Tighten
- **Keep**: video bg, headline with gold accent, pill badge, Login/Get Started nav, CTAs
- **Remove**: bouncing `ChevronDown` arrow at bottom
- Subtitle already correct from Step 4c

### 2. "How It Works" — Replaces Feature Cards
**Delete** the 4 image feature cards and `features` array. Replace with 3-step horizontal flow:

- Heading: "How It Works" / "Three steps to financial mastery"
- Background: `bg-[#F9FAFB]`
- 3 clean text-forward cards (no images, no borders, no shadows):
  - **01 "Watch & Learn"** — PlayCircle icon, "41 video modules covering money basics to professional investing..."
  - **02 "Practice Trading"** — BarChart3 icon, "$500 in virtual money, real market conditions..."
  - **03 "Earn Certificates"** — Award icon, "5 recognized certificates from Green to Black..."
- Each has a large watermark number ("01"/"02"/"03") in `text-8xl font-bold text-gray-100` behind content
- Desktop: 3 columns with thin arrow connectors between steps
- Mobile: vertical stack

### 3. "Your Path to Mastery" — Replaces Certificate Chevron Row
- Heading: "Your Path to Mastery" / "Five certificates. One journey..."
- Background: white
- **Horizontal track**: 2px gradient line through certificate colors (`#22c55e → #9CA3AF → #EAB308 → #1e3a5f → #000000`)
- 5 milestone circles (w-16 h-16, 64px) sitting on the track, each with Award icon
- Below each: certificate name, formal title, module count, audience
- **Black Certificate**: slightly larger (w-18 h-18), gold ring `ring-2 ring-[#EAB308]`, "Elite Level" label
- **Gold color**: `#EAB308` (brighter than current `#d4a017`) for landing page only
- Mobile: vertical track along left edge, horizontal rows
- CTA: "Start Your Journey →" blue button

### 4. "Built for Every Learner" — Replaces Portal Selection
- Heading: "Built for Every Learner" / "From age 6 to professional..."
- Background: `bg-[#F9FAFB]`
- **Two equal columns** (desktop side-by-side, mobile stacked):
  - Left: Adults image + "TEENS & ADULTS" label + "Master Financial Literacy" + body + blue CTA
  - Right: Kids image + "KIDS ZONE" label + "Fun Financial Adventures" + body + purple CTA
- Images take ~60% height, text below with gradient overlay option

### 5. Final CTA — New Section
- Background: dark `bg-[#1a1a1a]`
- Centered: "Ready to start?" heading (white), subtitle, white button "Get Started Free →"
- Below button: "No credit card required · Free forever" in small muted text

### Footer — Keep As-Is

## What's Removed
- `features` array and 4 image card grid
- `certificateTiers` array (replaced with new data using `#EAB308` for Gold)
- Feature card images imports (`onlineLearningImg`, `certificatesImg`, `tradingSimulatorImg`, `aiAssistedImg`)
- Bouncing `ChevronDown` in hero
- `APP_FULL_NAME` import (unused)

## What's Added
- `BarChart3` icon import from lucide-react
- Large watermark step numbers for "How It Works"
- Gradient track line for certificate progression
- Dark final CTA section

