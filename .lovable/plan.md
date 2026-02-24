

# Route All Key App Events to Bell Notification Dropdown

## Current State
Only `CourseDetail.tsx` calls `addNotification()`. Four other pages fire bottom toasts (`useToast`) for important events that should also appear in the bell:

| Page | Event | Current | Should Also → Bell? |
|---|---|---|---|
| **Trade.tsx** | Trade Successful | bottom toast | Yes (icon: `trade`) |
| **Trade.tsx** | Trade Failed | bottom toast | Yes (icon: `warning`) |
| **ModulePlayer.tsx** | Video Completed | bottom toast | Yes (icon: `success`) |
| **ModulePlayer.tsx** | Quiz Passed/Failed | bottom toast | Yes (icon: `certificate` / `warning`) |
| **Profile.tsx** | Profile Updated | bottom toast | Yes (icon: `success`) |
| **Auth.tsx** | Welcome back | bottom toast | No (transient, pre-app) |
| **Auth.tsx** | Login Failed | bottom toast | No (error feedback) |
| **CourseDetail.tsx** | Course coming soon | toast + bell | Remove toast, keep bell only |

Auth toasts stay as bottom toasts (they're immediate feedback before the user is in-app). Trade, Module, and Profile events get added to the bell.

## Changes

| File | Change |
|---|---|
| `src/pages/CourseDetail.tsx` | Remove `toast.info()` calls (lines 215, 336); remove `toast` import. Keep `addNotification` only. |
| `src/pages/Trade.tsx` | Import `useNotifications`; on successful trade call `addNotification("Bought/Sold X shares of Y", 'trade')`; on failed trade call `addNotification("Trade failed: …", 'warning')`. Keep existing `toast()` for inline feedback. |
| `src/pages/ModulePlayer.tsx` | Import `useNotifications`; on video complete call `addNotification("Video completed!", 'success')`; on quiz pass call `addNotification("Quiz passed — module complete!", 'certificate')`; on quiz fail call `addNotification("Quiz not passed — try again", 'warning')`. Keep toasts. |
| `src/pages/Profile.tsx` | Import `useNotifications`; on profile save success call `addNotification("Profile updated successfully", 'success')`. Keep toast. |

Both the bottom toast (immediate feedback) and bell notification (persistent record) will fire for Trade, Module, and Profile events. Only CourseDetail removes its toast entirely (per prior plan).

No new files. No new components. Just 4 files getting `addNotification` calls alongside existing toasts.

