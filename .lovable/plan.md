
# Redesign "Choose Your Learning Path" Section - Bolt Style

## Overview
Transform the current card-based "Choose Your Learning Path" section into a modern, alternating image/text layout inspired by the Bolt website design, using the provided adults.jpg and kids.jpg images.

---

## Design Reference Analysis

Based on the Bolt screenshots provided:

### Layout Pattern
```text
SECTION 1 - Adults & Teens:
+------------------+------------------+
|                  |                  |
|    [IMAGE]       |  Eyebrow text    |
|    adults.jpg    |  Large Headline  |
|                  |  Description     |
|                  |  [CTA Button]    |
|                  |                  |
+------------------+------------------+

SECTION 2 - Kids Zone (alternating):
+------------------+------------------+
|                  |                  |
|  Eyebrow text    |    [IMAGE]       |
|  Large Headline  |    kids.jpg      |
|  Description     |                  |
|  [CTA Button]    |                  |
|                  |                  |
+------------------+------------------+
```

### Key Design Elements
- Large, high-quality images taking up ~50% of width
- Clean whitespace with minimal background styling
- Small eyebrow/label text above main headline
- Bold serif headline (matching Playfair Display)
- Descriptive paragraph text
- Green CTA button (brand color)
- Alternating left/right image placement

---

## Files to Modify

### 1. Copy Image Assets
Copy the uploaded images to `src/assets/portals/`:
- `src/assets/portals/adults.jpg` - for Adults & Teens section
- `src/assets/portals/kids.jpg` - for Kids Zone section

### 2. Update `src/pages/Index.tsx`

**Remove:**
- Current card-based grid layout (lines 229-303)
- The gradient background on the section

**Replace with:**
- Section header with centered title and subtitle
- Two full-width alternating rows
- Each row: 50% image, 50% text content
- Image with subtle rounded corners
- Text area with: eyebrow label, large serif headline, description, bullet points (optional), CTA button

---

## New Section Structure

### Section Container
```tsx
<section className="py-20 bg-background">
  <div className="container">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">
        Choose Your Learning Path
      </h2>
      <p className="mt-4 text-muted-foreground">
        Age-appropriate content designed for every learner
      </p>
    </div>
    
    {/* Adults & Teens Row - Image Left, Text Right */}
    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
      <div className="relative">
        <img src={adultsImg} className="rounded-lg w-full h-auto" />
      </div>
      <div className="space-y-6">
        <p className="text-sm font-medium text-primary">Adults & Teens</p>
        <h3 className="font-serif text-3xl md:text-4xl font-semibold">
          Master Financial Literacy
        </h3>
        <p className="text-muted-foreground text-lg">
          High Schoolers (13-17) and Adults (18+) can access our 
          full curriculum with 27 modules, stock trading simulator, 
          and earn all 4 certificate levels.
        </p>
        <Button className="bg-cflp-green hover:bg-cflp-green/90" size="lg">
          Enter Adult Portal
        </Button>
      </div>
    </div>
    
    {/* Kids Zone Row - Text Left, Image Right */}
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 md:order-1">
        <p className="text-sm font-medium text-kids-primary">Kids Zone</p>
        <h3 className="font-serif text-3xl md:text-4xl font-semibold">
          Fun Financial Adventures
        </h3>
        <p className="text-muted-foreground text-lg">
          Young learners (6-12) enjoy interactive lessons, games, 
          rewards, and work toward their Green certificate in a 
          colorful, engaging environment.
        </p>
        <Button className="bg-kids-primary hover:bg-kids-primary/90 text-kids-primary-foreground" size="lg">
          Enter Kids Zone
        </Button>
      </div>
      <div className="relative md:order-2">
        <img src={kidsImg} className="rounded-lg w-full h-auto" />
      </div>
    </div>
  </div>
</section>
```

---

## Styling Details

### Image Styling
- Rounded corners: `rounded-lg` or `rounded-xl`
- Full width within grid cell: `w-full`
- Object fit: `object-cover` if using fixed height
- Optional: subtle shadow for depth

### Text Content Styling
- Eyebrow: `text-sm font-medium text-primary` (or `text-kids-primary` for Kids)
- Headline: `font-serif text-3xl md:text-4xl font-semibold`
- Description: `text-muted-foreground text-lg`
- Button: Green brand color, larger size (`size="lg"`)

### Spacing
- Section padding: `py-20`
- Grid gap: `gap-12`
- Between rows: `mb-24`
- Text content spacing: `space-y-6`

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Single column, image stacks above text |
| Desktop (768px+) | Two columns with alternating image positions |

On mobile, both rows will show image first, then text below (natural stacking order for first row; use `md:order-` classes to control the second row).

---

## Content Mapping

### Adults & Teens
- Eyebrow: "Adults & Teens"
- Headline: "Master Financial Literacy"
- Description: "High Schoolers (13-17) and Adults (18+) can access our full curriculum with 27 modules, stock trading simulator, and earn all 4 certificate levels."
- CTA: "Enter Adult Portal" - links to `/auth`

### Kids Zone
- Eyebrow: "Kids Zone"
- Headline: "Fun Financial Adventures"
- Description: "Young learners (6-12) enjoy interactive lessons, games, rewards, and work toward their Green certificate in a colorful, engaging environment."
- CTA: "Enter Kids Zone" - links to `/kids`

---

## Implementation Steps

1. Copy `adults.jpg` to `src/assets/portals/adults.jpg`
2. Copy `kids.jpg` to `src/assets/portals/kids.jpg`
3. Add imports for the new images in Index.tsx
4. Replace the Portal Selection section (lines 229-303) with the new alternating layout
5. Keep the section header but remove the gradient background
6. Implement responsive ordering for mobile
