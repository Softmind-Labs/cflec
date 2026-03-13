

# Phase 5: Dashboard Portfolio Integration

The Dashboard sidebar has a placeholder "Trading Simulator" card that just links to `/simulator`. Now that the wallet system tracks real data, enhance this card to show live portfolio stats — giving users an at-a-glance view of their trading performance without leaving the dashboard.

## What to build

### 1. Enhanced Trading Simulator Card (Dashboard sidebar)
Replace the current static card with a mini portfolio summary:
- **Cash Balance** and **Total Portfolio** values from `useSimulatorWallet`
- **Return %** with green/red color coding
- **Active positions count**
- "Open Simulator" button stays

### 2. Fix hardcoded Learning Streak
The streak card currently shows a hardcoded "3 days". Replace with actual streak logic based on `user_progress` dates — count consecutive days (going backwards from today) where the user completed or interacted with a module.

## Files to modify

| File | Change |
|---|---|
| `src/pages/Dashboard.tsx` | Import `useSimulatorWallet`, replace static simulator card with live data; compute real learning streak from `user_progress.completed_at` dates |

## Design details

The simulator card will show:
```text
┌──────────────────────────┐
│ 📈 Trading Simulator     │
│                          │
│  $487.50    $512.50      │
│  Cash       Portfolio    │
│                          │
│  +2.50%  ·  3 positions  │
│                          │
│  [ Open Simulator ]      │
└──────────────────────────┘
```

Learning streak logic:
- Query `user_progress` records with non-null `completed_at`
- Extract unique dates, sort descending
- Count consecutive days from today backwards
- If no activity today, start from yesterday

