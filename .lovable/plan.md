

# Database Foundation for Unified Simulator

Create the core tables (`portfolio_wallet`, `positions`, `trades`) that will power the unified simulator across all 4 categories. No UI changes — just the backend foundation with proper RLS.

## Database Migration

### 1. `portfolio_wallet` table
Replaces the concept of the current `portfolios` table for the unified wallet. Since `portfolios` already exists with active data, we'll create `portfolio_wallet` as the new unified wallet alongside it, and migrate later.

```sql
create table public.portfolio_wallet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cash_balance decimal not null default 500.00,
  initial_balance decimal not null default 500.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.portfolio_wallet enable row level security;

create policy "Users can view own wallet" on public.portfolio_wallet
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own wallet" on public.portfolio_wallet
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own wallet" on public.portfolio_wallet
  for update to authenticated using (auth.uid() = user_id);
```

### 2. `positions` table
Tracks all open positions across all 4 simulator categories.

```sql
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulator_type text not null,          -- 'banking', 'investment', 'trading', 'capital_markets'
  category text not null,                -- 'tbill', 'fixed_deposit', 'savings', 'stock_gse', 'stock_world', 'crypto', 'forex', 'commodity', 'bond', 'mutual_fund', 'etf'
  asset_symbol text not null,
  asset_name text not null,
  position_type text not null,           -- 'market', 'fixed_term', 'yield'
  quantity decimal not null default 0,
  entry_price decimal not null default 0,
  total_invested decimal not null default 0,
  interest_rate decimal,                 -- for fixed_term/yield
  term_days integer,                     -- for fixed_term
  maturity_date timestamptz,             -- for fixed_term
  is_matured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.positions enable row level security;

create policy "Users can view own positions" on public.positions
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own positions" on public.positions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own positions" on public.positions
  for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own positions" on public.positions
  for delete to authenticated using (auth.uid() = user_id);
```

### 3. `trades` table
Immutable log of every transaction.

```sql
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulator_type text not null,
  category text not null,
  asset_symbol text not null,
  asset_name text not null,
  trade_type text not null,              -- 'buy', 'sell', 'invest', 'withdraw', 'matured'
  quantity decimal not null default 0,
  price_at_execution decimal not null default 0,
  total_value decimal not null default 0,
  created_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create policy "Users can view own trades" on public.trades
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own trades" on public.trades
  for insert to authenticated with check (auth.uid() = user_id);
```

### 4. Updated_at trigger
```sql
create trigger update_portfolio_wallet_updated_at
  before update on public.portfolio_wallet
  for each row execute function public.update_updated_at_column();

create trigger update_positions_updated_at
  before update on public.positions
  for each row execute function public.update_updated_at_column();
```

## What this enables
- Unified $500 wallet shared across all 4 simulator categories
- Positions tracked with type awareness (market-priced, fixed-term, yield)
- Full trade history log for every action
- RLS ensures users only see their own data
- The existing `portfolios`/`stock_holdings`/`transactions` tables remain untouched — the new system runs in parallel

## What's NOT included (future phases)
- No UI changes
- No `market_data_cache` or `fixed_rate_cache` tables (current edge function caching still works)
- No `api_health_log` table
- No RPC functions for trade execution (Phase 1 UI work)

