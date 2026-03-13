
-- 1. portfolio_wallet table
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

-- 2. positions table
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulator_type text not null,
  category text not null,
  asset_symbol text not null,
  asset_name text not null,
  position_type text not null,
  quantity decimal not null default 0,
  entry_price decimal not null default 0,
  total_invested decimal not null default 0,
  interest_rate decimal,
  term_days integer,
  maturity_date timestamptz,
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

-- 3. trades table
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulator_type text not null,
  category text not null,
  asset_symbol text not null,
  asset_name text not null,
  trade_type text not null,
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

-- 4. updated_at triggers
create trigger update_portfolio_wallet_updated_at
  before update on public.portfolio_wallet
  for each row execute function public.update_updated_at_column();

create trigger update_positions_updated_at
  before update on public.positions
  for each row execute function public.update_updated_at_column();
