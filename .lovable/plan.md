

# Rename "Short Courses" → "Masterclass"

Simple text replacement across 4 files:

| File | Change |
|---|---|
| `src/pages/Courses.tsx` | Line 62: `Short Courses` → `Masterclass`. Line 68: `8 short courses · Free with login · Ghana focused` → `8 masterclasses · Free with login · Ghana focused`. Line 56 breadcrumb: `Home › Courses` → `Home › Masterclass` |
| `src/pages/CourseDetail.tsx` | Line 166: `Back to Courses` → `Back to Masterclass`. Line 171 breadcrumb: `Home › Courses › {title}` → `Home › Masterclass › {title}`. Line 145: `Browse Courses` → `Browse Masterclass` |
| `src/components/layout/SearchDialog.tsx` | Line 33 keywords: `short courses` → `masterclass`. Line 91 group heading: `Courses` → `Masterclass`. Line 75 placeholder: update to include `masterclass` |
| `src/components/layout/TopNav.tsx` | Line 22: nav label `Courses` → `Masterclass` |

No structural or routing changes — URLs stay as `/courses` for stability.

