

# Notification Dropdown + Keyword Search

## Two Issues

### 1. Bell icon does nothing
The Bell icon in TopNav (line 114-116) has no onClick handler and no notification system. Notifications from actions like "Course content coming soon!" go to toast popups at the bottom of the screen, not to the bell.

**Plan**: Create a `NotificationDropdown` component using the existing `Popover` primitive (consistent with the avatar dropdown style). It will:
- Maintain an in-memory notification store (React context) that captures app events
- Show an unread count badge (red dot) on the Bell icon when notifications exist
- Display a sleek dropdown with a scrollable list of notifications, each with icon, message, and relative timestamp
- Include a "Mark all read" action and empty state
- Hook into existing toast calls so that when `toast.info(...)` fires, it also pushes to the notification store

The dropdown will match the existing UI: white background, subtle border, 280px wide, same shadow and radius as the avatar DropdownMenu.

### 2. Search only finds pages, not content
The SearchDialog only has 6 hardcoded page entries. Typing "forex" or "budgeting" finds nothing.

**Plan**: Expand the searchable index to include:
- **Pages** (6 items -- existing)
- **Courses** (8 items -- title, subtitle, category as keywords)
- **Simulator sections** (Banking, Trading, Investment, Capital Markets)
- Each item navigates to its respective route when selected

The `cmdk` library already handles fuzzy matching on the `value` prop, so adding `keywords` data to each `CommandItem` gives keyword-based search for free.

## Files Changed

| File | Change |
|---|---|
| `src/components/layout/NotificationContext.tsx` | **New** -- React context providing `notifications[]`, `addNotification()`, `markAllRead()`, `unreadCount` |
| `src/components/layout/NotificationDropdown.tsx` | **New** -- Popover-based dropdown rendering notification list with icons, timestamps, empty state, and "Mark all read" |
| `src/components/layout/TopNav.tsx` | Import and render `NotificationDropdown` in place of the bare Bell button; wrap with `NotificationProvider` |
| `src/components/layout/SearchDialog.tsx` | Add courses (8 items) and simulator sections (4 items) to the searchable index with keyword metadata |
| `src/App.tsx` | Wrap the app tree with `NotificationProvider` so notifications are accessible app-wide |
| `src/pages/CourseDetail.tsx` | When firing `toast.info('Course content coming soon!')`, also call `addNotification()` to push to the bell |

## Notification Dropdown Design

- Uses `Popover` + `PopoverContent` (existing component) for positioning
- 300px wide, max-height 380px with scroll
- Header row: "Notifications" title + "Mark all read" text button
- Each item: 12px padding, icon circle (32px, tinted), message text (13px), relative time (12px, muted)
- Empty state: Bell icon + "No notifications yet" centered text
- Unread badge: 8px red dot, absolute positioned top-right of Bell icon
- Matches the premium, non-glassmorphic card style from the design system

## Search Index Expansion

The `CommandItem` component from cmdk supports a `value` prop that is used for matching. By setting value to a string containing the label + keywords, cmdk's built-in fuzzy search handles keyword matching automatically.

Groups in the dialog:
- **Pages** -- Dashboard, Modules, Courses, Simulator, Certificates, Profile
- **Courses** -- Investment Basics, Banking & Accounts, Forex Explained, etc. (navigate to `/courses/{slug}`)
- **Simulator** -- Banking Simulator, Trading Simulator, Investment Simulator, Capital Markets (navigate to `/simulator/{section}`)

