

# Redesign "Everything You Need to Succeed" Section

## Overview
Replace the current icon-based feature cards with a modern, image-driven card layout inspired by the Bolt reference screenshot. Each card will feature a full-height background image with text overlay.

---

## Design Approach

### Current State
- 4 feature cards in a grid layout
- Each card has an icon, title, and description
- Uses standard Card component with light background

### New Design
- 4 tall cards with full background images
- Dark gradient overlay for text readability
- White text positioned at top-left
- Green CTA button for each feature
- Horizontally scrollable on mobile, grid on desktop

### Card Layout
```text
+------------------------+
|                        |
|  Title (serif)         |
|  Description text      |
|                        |
|  [CTA Button]          |
|                        |
|     BACKGROUND         |
|       IMAGE            |
|                        |
+------------------------+
```

---

## Feature Cards Content

| Feature | Image | Title | Description | CTA |
|---------|-------|-------|-------------|-----|
| Structured Learning | online-l.jpg | Structured Learning | Progress through 27 expertly crafted modules | Start Learning |
| Earn Certificates | cert.jpg | Earn Certificates | Achieve Green, White, Gold, and Blue certifications | View Certificates |
| Stock Simulator | trading_simulator.jpg | Stock Simulator | Practice trading with $500 in virtual money | Try Simulator |
| AI-Powered Support | ai-assisted.jpg | AI-Powered Support | Get personalized guidance and instant answers | Learn More |

---

## Files to Modify

### 1. Copy Image Assets
Copy the 4 uploaded images to `src/assets/features/`:
- `src/assets/features/online-learning.jpg`
- `src/assets/features/certificates.jpg`
- `src/assets/features/trading-simulator.jpg`
- `src/assets/features/ai-assisted.jpg`

### 2. Update `src/pages/Index.tsx`
- Remove the current Card-based features grid
- Create new tall image cards with:
  - `aspect-[3/4]` or fixed height for card proportions
  - Background image using `style={{ backgroundImage: url(...) }}`
  - Dark gradient overlay (linear-gradient from bottom)
  - Positioned text content (title, description)
  - Green CTA button styled to match brand
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Add hover effect for subtle zoom/brightness change

---

## Styling Details

### Card Structure
```tsx
<div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
  {/* Background Image */}
  <img 
    src={featureImage} 
    alt="" 
    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
  
  {/* Content */}
  <div className="relative z-10 h-full flex flex-col justify-end p-6">
    <h3 className="font-serif text-2xl font-semibold text-white mb-2">
      Title
    </h3>
    <p className="text-white/80 mb-4">
      Description text here
    </p>
    <Button className="w-fit bg-cflp-green hover:bg-cflp-green/90">
      CTA Text
    </Button>
  </div>
</div>
```

### Hover Effects
- Image scales up slightly on hover (`group-hover:scale-105`)
- Smooth transition for polished feel
- Optional: Button slides up or becomes more prominent

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | Single column, cards stack vertically |
| Tablet (640-1023px) | 2 columns |
| Desktop (1024px+) | 4 columns in a row |

---

## Implementation Steps

1. Copy the 4 feature images to `src/assets/features/`
2. Import images in `Index.tsx`
3. Replace the features grid section with new image card components
4. Apply consistent styling with dark overlays and white text
5. Add hover animations for interactivity

