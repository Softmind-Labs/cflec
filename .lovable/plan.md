

# Step 4: Certificates Page — Journey/Pathway Redesign

## Summary
Full rewrite of `src/pages/Certificates.tsx` — replace the 4-card Green/White/Gold/Blue grid with a vertical journey timeline showing 5 stages as connected milestones with progressive unlocking.

## File Changed
| File | Change |
|---|---|
| `src/pages/Certificates.tsx` | Complete rewrite |

## Data Fetching (replaces current)
- Fetch `stages` ordered by `stage_number`, filtered to stages 1–5 only (exclude Module 99's stage)
- Fetch `modules` with `stage_id` and count per stage
- Fetch `user_progress` for current user (video_completed + quiz_passed = completed)
- Calculate per stage: `completedCount` / `totalModules`
- Lock logic: Stage 1 always unlocked. Stage N locked if Stage N-1 is not fully complete

## Layout Structure

**Header**: "Your Learning Journey" + subtitle + blue underline accent

**Summary cards row** (5 cards, horizontal, scrollable on mobile):
- Each card: colored dot (stage.color_primary) + "Stage {n}" + completed/total + thin progress bar
- Locked cards: faded with lock icon

**Vertical Journey Timeline** (centerpiece):
- Vertical track line runs top to bottom
- Line colored with stage.color_primary for completed stages, dashed gray for locked
- Each stage = milestone node on the line

**Milestone card per stage:**
- **Completed**: Colored circle with checkmark, certificate_name bold, stage title subtitle, full progress bar, green "Completed ✓" badge + Download button
- **In Progress**: Colored circle with stage number, certificate_name, progress bar partially filled, blue "In Progress" badge + "X/Y modules" text
- **Not Started (unlocked)**: Colored circle, neutral "Not Started" badge
- **Locked**: Gray circle with lock overlay, muted text, no progress bar, gray "Locked" badge + "Complete Stage N-1 to unlock" text

**Active node**: subtle pulse/glow CSS animation

**Motivational footer**: Dynamic text based on completion count (0, partial, all 5)

## Responsive
- Mobile: timeline track along left edge, cards stack full-width
- Summary cards: horizontal scroll on small screens (`overflow-x-auto flex`)

## What's Removed
- All `CERTIFICATE_INFO`, `CERT_COLORS`, `certAccentColors`, `CertificateLevel` imports
- Green/White/Gold/Blue card grid
- "Not available for high_schooler accounts" logic

## Icons Used
`Award`, `Lock`, `CheckCircle2`, `Download`, `Trophy` from lucide-react

## Stage Colors (from DB `stages.color_primary`, with fallback)
```
1 → #22c55e, 2 → #14b8a6, 3 → #1d4ed8, 4 → #1e3a5f, 5 → #000000
```

