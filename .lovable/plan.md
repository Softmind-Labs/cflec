

# Fix: Course Detail Auth References & Header Search

## Issue 1 — CourseDetail.tsx still sends logged-in users to `/auth`

Three locations need updating:

- **Line 210**: Hero "Start Learning" button links to `/auth` → should link to the first lesson (or stay on page with a toast, since courses are "coming soon")
- **Line 304**: Sidebar text says "Login required to access" → change to "Free to access"
- **Line 327**: Sidebar "Start Learning" button links to `/auth` → same fix as line 210

Since the course content is marked "Coming soon", the buttons will show a toast notification instead of navigating to `/auth`.

## Issue 2 — Header search icon is non-functional

The `TopNav.tsx` search button (line ~101) has no `onClick` handler. Will add a command-palette search dialog using the existing `cmdk` dependency and `CommandDialog` component already in the project.

### Search implementation
- Create `src/components/layout/SearchDialog.tsx` — a `CommandDialog` listing nav pages (Dashboard, Modules, Courses, Simulator, Certificates, Profile) with keyboard shortcut `Ctrl+K`
- Wire the search icon in `TopNav.tsx` to toggle this dialog open

## Files changed

| File | Change |
|---|---|
| `src/pages/CourseDetail.tsx` | Remove `/auth` links, replace with toast "Coming soon"; update sidebar text |
| `src/components/layout/SearchDialog.tsx` | New — command palette with page navigation |
| `src/components/layout/TopNav.tsx` | Wire search icon to open SearchDialog; add `Ctrl+K` listener |

