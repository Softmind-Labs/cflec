

# Remove Colored Left Borders + Fix White Certificate Color

## Changes

### 1. `src/pages/Simulator.tsx` (line 115)
Remove the `borderLeftWidth` and `borderLeftColor` inline style from simulator cards. The cards will remain clean white with no colored border.

### 2. `src/pages/Certificates.tsx`
- **Detail cards (lines 181-185):** Remove `borderLeftWidth: '4px'` and `borderLeftColor` from the card inline style. Keep the `opacity` for locked cards.
- **Summary stat cards (lines 115-119):** Remove the `borderWidth`/`borderColor` from the active certificate card style — keep only the subtle background tint.

### 3. `src/lib/cert-colors.ts` (line 3)
Change `white` accent from `#3b82f6` to `#FFFFFF`. Update `bg` and `border` accordingly:
- `accent: '#FFFFFF'` — strictly white
- `bg: '#fafafa'` — very light neutral for backgrounds (since white-on-white is invisible)
- `border: '#e5e5e5'` — neutral gray border

### 4. `src/index.css`
Update `.certificate-white` background-color from `#3b82f6` to `#FFFFFF` and set color to `#000000` (so text is visible on white bg).

**4 files modified, 0 new files.**

