

# Phase 4: Update Leaderboard to Use Unified Wallet

## Problem
The leaderboard RPC (`get_leaderboard`) still reads from the old `portfolios` + `stock_holdings` + `mock_stocks` tables. The new trading system writes to `portfolio_wallet` + `positions`. Users who trade via the new simulator won't appear on the leaderboard.

## Solution
Replace the `get_leaderboard` RPC to read from the new unified tables, and update the Leaderboard page to show richer data.

## What to build

### 1. New `get_leaderboard` RPC
Replace the existing function to query from `portfolio_wallet` and `positions`:

```text
SELECT
  pw.user_id,
  pr.full_name,
  pr.avatar_url,
  pr.account_type,
  pw.cash_balance,
  COALESCE(SUM(pos.total_invested), 0) as holdings_value,
  pw.cash_balance + COALESCE(SUM(pos.total_invested), 0) as total_value
FROM portfolio_wallet pw
JOIN profiles pr ON pw.user_id = pr.user_id
LEFT JOIN positions pos ON pw.user_id = pos.user_id
GROUP BY pw.user_id, pr.full_name, pr.avatar_url, pr.account_type, pw.cash_balance
ORDER BY total_value DESC
LIMIT limit_count;
```

### 2. Update Leaderboard page
- Change "in stocks" label to "in positions" since holdings now span all categories
- Add trade count or category breakdown badge (optional enhancement)
- Remove dependency on old `portfolios`/`stock_holdings` tables in the display

### Files

| File | Change |
|---|---|
| New migration | Replace `get_leaderboard` RPC to use `portfolio_wallet` + `positions` |
| `src/pages/Leaderboard.tsx` | Update "in stocks" label to "in positions" |

### No breaking changes
The RPC signature (`limit_count` parameter, returned columns) stays identical, so the frontend needs only a label tweak.

