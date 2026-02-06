

# Premium Hero Section with Video Background

## Overview
Transform the landing page hero section into a full-viewport immersive experience with the uploaded money video as a background, paired with sophisticated typography that conveys professionalism and trust.

---

## Changes Summary

### 1. Video Background Hero (100vh)

**Current State:**
- Hero section uses a gradient background with padding-based height
- Text content is centered with standard spacing

**New Implementation:**
- Full viewport height (100vh) hero section
- Video element as background with:
  - `autoPlay`, `muted`, `loop`, `playsInline` attributes
  - `object-cover` to fill the entire section
  - Dark overlay (gradient or semi-transparent black) for text readability
- Content positioned absolutely over the video
- Video file copied from `user-uploads://money.mp4` to `public/videos/money.mp4`

**Structure:**
```text
+------------------------------------------+
|  [Fixed Header - transparent on hero]    |
+------------------------------------------+
|                                          |
|         VIDEO BACKGROUND (100vh)         |
|         with dark overlay                |
|                                          |
|    +----------------------------+        |
|    |  Badge: Trusted by 10,000+ |        |
|    |                            |        |
|    |  MASTER YOUR               |        |
|    |  FINANCIAL FUTURE          |        |
|    |                            |        |
|    |  [Subtitle text]           |        |
|    |                            |        |
|    |  [CTA Buttons]             |        |
|    +----------------------------+        |
|                                          |
|         [Scroll indicator arrow]         |
+------------------------------------------+
```

### 2. Mature Typography

**Font Selection: Inter or Instrument Serif**

For a sophisticated, non-AI look, I recommend using **Inter** for body text combined with a serif display font for headings. Options:

| Font | Style | Use Case |
|------|-------|----------|
| **Inter** | Sans-serif | Body text, UI elements - clean, professional |
| **Playfair Display** | Serif | Headlines - elegant, established feel |
| **Source Serif Pro** | Serif | Alternative headlines - modern classic |

**Implementation:**
- Add Google Fonts link to `index.html` for Playfair Display + Inter
- Configure Tailwind with font families
- Apply serif font to hero headlines
- Keep Inter for body and UI text

**Typography Hierarchy:**
```text
H1 (Hero):     Playfair Display, 4.5rem-6rem, font-semibold
H2 (Sections): Playfair Display, 2.5rem-3rem, font-semibold  
Body:          Inter, 1rem-1.25rem, regular
Buttons:       Inter, font-medium
```

### 3. Header Transparency

- Make header transparent when over the hero video
- White text/logo on the hero
- Transition to solid background on scroll (optional enhancement)

---

## Files to Modify

### 1. Copy Video Asset
- Copy `user-uploads://money.mp4` to `public/videos/money.mp4`
- Use public folder since video is referenced directly in HTML/JSX

### 2. `index.html`
Add Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
```

### 3. `tailwind.config.ts`
Add font family configuration:
```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Playfair Display', 'Georgia', 'serif'],
}
```

### 4. `src/index.css`
Update base styles:
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

### 5. `src/pages/Index.tsx`
Complete hero section rewrite:
- Video element with background styling
- Dark gradient overlay
- 100vh container with flexbox centering
- Updated typography classes using serif font for headlines
- Scroll indicator at bottom
- Transparent header integration

---

## Visual Design Details

### Video Overlay
```css
/* Semi-transparent gradient overlay */
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.6) 0%,
  rgba(0, 0, 0, 0.4) 50%,
  rgba(0, 0, 0, 0.7) 100%
);
```

### Hero Content Styling
- White text for maximum contrast against dark overlay
- Larger, bolder headline with serif font
- Subtle text shadow for depth
- Glass-morphism effect on buttons (optional)

### Scroll Indicator
- Animated chevron or arrow at bottom of hero
- Subtle bounce animation to encourage scrolling
- Semi-transparent white

---

## Technical Considerations

### Video Performance
- Video will be served from public folder (static asset)
- `preload="auto"` for faster loading
- Consider adding a poster image as fallback while video loads
- Mobile: Video may not autoplay on all devices - fallback to poster image

### Accessibility
- Video is decorative, so no captions needed
- Sufficient contrast ratio for text over overlay
- Reduced motion preference: Can disable video for users who prefer reduced motion

### Mobile Responsiveness
- Video covers full viewport on all devices
- Text scales appropriately
- Buttons stack vertically on mobile
- Consider hiding video on very slow connections (progressive enhancement)

---

## Implementation Order

1. Copy video file to `public/videos/money.mp4`
2. Add Google Fonts to `index.html`
3. Update `tailwind.config.ts` with font families
4. Update `src/index.css` with base font styling
5. Rewrite hero section in `src/pages/Index.tsx`
6. Update header styling for transparency on hero

