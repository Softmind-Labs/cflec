

# Phase 3: Portfolio Performance Chart & Wallet Reset

With trading, positions, and trade history complete, the next logical step is adding visual portfolio analytics and a wallet management feature.

## What to build

### 1. Portfolio Performance Summary (Hub page)
Add a visual breakdown below the stats bar on the simulator hub showing how the $500 is allocated across categories. Uses recharts (already installed).

- **Donut/Pie chart** showing allocation: Cash vs Banking vs Investment vs Trading vs Capital Markets
- Compact card layout beside the chart showing top 3 holdings by value
- Only renders when user has at least 1 position (otherwise skip)

### 2. Wallet Reset
Add a "Reset Portfolio" button on the hub page that:
- Calls an RPC `reset_simulator_wallet` that deletes all positions, all trades, and resets `portfolio_wallet.cash_balance` back to `initial_balance`
- Requires confirmation dialog ("This will delete all positions and trade history")
- Useful for students who want to start over

### Files to create/modify

| File | Change |
|---|---|
| `src/pages/Simulator.tsx` | Add allocation chart section + Reset Portfolio button with confirmation dialog |
| `src/components/simulator/AllocationChart.tsx` | **New** — Recharts PieChart showing cash vs category breakdown |
| New migration | `reset_simulator_wallet` RPC (SECURITY DEFINER) |

### RPC: `reset_simulator_wallet`
```text
- Delete all rows from `positions` where user_id = auth.uid()
- Delete all rows from `trades` where user_id = auth.uid()
- Update `portfolio_wallet` set cash_balance = initial_balance
- Return { success: true, new_balance }
```

### Allocation Chart Data
Derived from existing `useSimulatorWallet` data — no new queries needed:
- Cash: `cashBalance`
- Per category: `positionsByType[type].totalInvested`

