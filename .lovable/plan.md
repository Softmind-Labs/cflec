

# Top-of-Screen Notification Toast Near Bell Icon

## Problem
When a notification fires, the only visual feedback is a tiny red dot on the bell icon. Users don't notice it. The old bottom toasts were removed (CourseDetail) or kept (Trade, Profile, Module) but they're disconnected from the bell — users don't associate them with the notification dropdown.

## Solution
Add an animated notification banner that slides down from directly below the TopNav (top of viewport, right-aligned near the bell icon) whenever `addNotification` is called. It auto-dismisses after 4 seconds. Clicking it opens the notification dropdown. This creates a clear visual connection: "something just happened → it's in your bell."

**Design:**
- 320px wide, right-aligned (matching the bell's horizontal position)
- Slides down from top with a subtle spring animation
- Shows the notification icon (colored circle), message text, and "Just now" timestamp
- White card with the standard 1px border and shadow (matches existing card style)
- Auto-dismisses after 4s with a fade-out, or user can dismiss with X
- Max 1 visible at a time (new one replaces old)

## Files Changed

| File | Change |
|---|---|
| `src/components/layout/NotificationContext.tsx` | Add a `latestNotification` state + `clearLatest()` method so the toast component knows when a new notification arrives |
| `src/components/layout/NotificationToast.tsx` | **New** — Animated top-right toast that renders when `latestNotification` is set. Uses CSS keyframes for slide-down/fade-out. Auto-clears after 4s. |
| `src/components/layout/TopNav.tsx` | Render `<NotificationToast />` just below the nav bar so it appears anchored to the top-right |

## NotificationToast Behavior
1. `addNotification()` fires → sets `latestNotification` in context
2. `NotificationToast` renders with slide-down animation (positioned `fixed top-[72px] right-5`)
3. After 4 seconds, fade-out animation plays, then `clearLatest()` removes it
4. If user clicks the toast, it opens the bell popover (or just scrolls attention to bell)
5. X button for immediate dismiss

## No changes to existing toast calls
The bottom toasts from `useToast()` on Trade, Module, and Profile pages stay as immediate confirmation feedback. The new top-right notification toast is a separate visual that connects events to the bell icon. Both fire simultaneously for Trade/Module/Profile events; only the top toast fires for CourseDetail.

