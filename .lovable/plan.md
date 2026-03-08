

# Step 3 (Revised): Clean Up Module Detail Page

## What changed from the previous implementation
The updated Step 3 document explicitly states: **"No curriculum content sections on this page."** The curriculum data (learning_objective, key_ideas, teaching_guide, practical_activity, assessment_check, progression_link) is for AI tutor and admin use only — not displayed to learners.

## Part A — SQL Migration
Already done. The existing migration (`20260308215118_...sql`) correctly updates all 41 modules + Module 99 with the exact curriculum text. No changes needed.

## Part B — ModulePlayer.tsx changes

**Remove these sections (lines ~330-454):**
- The tabbed curriculum content panel (Overview / Activity & Assessment / What's Next tabs)
- The Teaching Guide collapsible accordion
- Related imports: `Target`, `Lightbulb`, `ClipboardCheck`, `CircleCheckBig`, `ArrowRight`, `GraduationCap`, `Accordion` components

**Remove related variables:**
- `hasProgressionLink`
- `keyIdeasList`

**Keep exactly as-is:**
- Header with stage badge, compulsory badge, meta line, progress bar
- Video player area and its buttons
- Reading Materials accordion (if content exists)
- Quiz section
- Sidebar ("About This Module" + "Your Progress" cards)
- Data fetching (stage/band still needed for header & sidebar)

## Files changed

| File | Change |
|---|---|
| `src/pages/ModulePlayer.tsx` | Remove tabbed curriculum panel + teaching guide accordion + unused imports |

