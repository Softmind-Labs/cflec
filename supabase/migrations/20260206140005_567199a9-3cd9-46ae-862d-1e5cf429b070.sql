-- ============================================
-- CFLP Platform Database Schema
-- Phase 1: Foundation & Core Schema
-- ============================================

-- Create custom enums
CREATE TYPE public.account_type AS ENUM ('kid', 'high_schooler', 'adult');
CREATE TYPE public.certificate_level AS ENUM ('green', 'white', 'gold', 'blue');
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT NOT NULL,
  account_type public.account_type NOT NULL DEFAULT 'adult',
  date_of_birth DATE,
  phone TEXT,
  mothers_first_name TEXT,
  avatar_url TEXT,
  subscription_status public.subscription_status DEFAULT 'pending',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. MODULES TABLE
-- ============================================
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  certificate_level public.certificate_level NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 30,
  has_simulation BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Modules are readable by all authenticated users
CREATE POLICY "Authenticated users can view modules"
  ON public.modules FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================
-- 3. MODULE CONTENT TABLE
-- ============================================
CREATE TABLE public.module_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'image')),
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view module content"
  ON public.module_content FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 4. QUIZZES TABLE
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view quizzes"
  ON public.quizzes FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 5. USER PROGRESS TABLE
-- ============================================
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  video_completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  quiz_passed BOOLEAN DEFAULT false,
  simulation_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. CERTIFICATES TABLE
-- ============================================
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  certificate_level public.certificate_level NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_number TEXT NOT NULL UNIQUE,
  UNIQUE(user_id, certificate_level)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. MOCK STOCKS TABLE
-- ============================================
CREATE TABLE public.mock_stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  previous_close DECIMAL(10,2),
  day_high DECIMAL(10,2),
  day_low DECIMAL(10,2),
  sector TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mock_stocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stocks"
  ON public.mock_stocks FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 8. PORTFOLIOS TABLE
-- ============================================
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cash_balance DECIMAL(12,2) NOT NULL DEFAULT 500.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolio"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 9. STOCK HOLDINGS TABLE
-- ============================================
CREATE TABLE public.stock_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  stock_id UUID REFERENCES public.mock_stocks(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  average_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, stock_id)
);

-- Enable RLS
ALTER TABLE public.stock_holdings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check portfolio ownership
CREATE OR REPLACE FUNCTION public.owns_portfolio(_portfolio_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.portfolios
    WHERE id = _portfolio_id
      AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Users can view their own holdings"
  ON public.stock_holdings FOR SELECT
  USING (public.owns_portfolio(portfolio_id));

CREATE POLICY "Users can insert their own holdings"
  ON public.stock_holdings FOR INSERT
  WITH CHECK (public.owns_portfolio(portfolio_id));

CREATE POLICY "Users can update their own holdings"
  ON public.stock_holdings FOR UPDATE
  USING (public.owns_portfolio(portfolio_id));

CREATE POLICY "Users can delete their own holdings"
  ON public.stock_holdings FOR DELETE
  USING (public.owns_portfolio(portfolio_id));

-- ============================================
-- 10. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  stock_id UUID REFERENCES public.mock_stocks(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_share DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (public.owns_portfolio(portfolio_id));

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.owns_portfolio(portfolio_id));

-- ============================================
-- 11. LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.user_id,
  pr.full_name,
  pr.avatar_url,
  pr.account_type,
  p.cash_balance,
  COALESCE(SUM(sh.quantity * ms.current_price), 0) as holdings_value,
  p.cash_balance + COALESCE(SUM(sh.quantity * ms.current_price), 0) as total_value
FROM public.portfolios p
JOIN public.profiles pr ON p.user_id = pr.user_id
LEFT JOIN public.stock_holdings sh ON p.id = sh.portfolio_id
LEFT JOIN public.mock_stocks ms ON sh.stock_id = ms.id
GROUP BY p.user_id, pr.full_name, pr.avatar_url, pr.account_type, p.cash_balance
ORDER BY total_value DESC;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stock_holdings_updated_at
  BEFORE UPDATE ON public.stock_holdings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mock_stocks_updated_at
  BEFORE UPDATE ON public.mock_stocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA: Mock Stocks
-- ============================================
INSERT INTO public.mock_stocks (symbol, name, current_price, previous_close, day_high, day_low, sector) VALUES
  ('AAPL', 'Apple Inc.', 175.50, 174.20, 176.80, 173.50, 'Technology'),
  ('GOOGL', 'Alphabet Inc.', 140.25, 139.80, 141.50, 138.90, 'Technology'),
  ('MSFT', 'Microsoft Corp.', 378.90, 377.50, 380.20, 375.80, 'Technology'),
  ('AMZN', 'Amazon.com Inc.', 178.15, 177.30, 179.80, 176.20, 'Consumer'),
  ('TSLA', 'Tesla Inc.', 245.60, 243.80, 248.90, 241.50, 'Automotive'),
  ('META', 'Meta Platforms', 485.30, 483.20, 488.50, 480.10, 'Technology'),
  ('NVDA', 'NVIDIA Corp.', 875.40, 870.20, 880.50, 865.30, 'Technology'),
  ('JPM', 'JPMorgan Chase', 195.20, 194.50, 196.80, 193.20, 'Finance');

-- ============================================
-- SEED DATA: Initial Modules
-- ============================================
INSERT INTO public.modules (module_number, title, description, certificate_level, duration_minutes, has_simulation) VALUES
  (1, 'Introduction to Money', 'Learn what money is and why it matters', 'green', 15, false),
  (2, 'Earning and Saving', 'Understanding income and the importance of saving', 'green', 20, false),
  (3, 'Budgeting Basics', 'Create your first budget and track spending', 'green', 25, true),
  (4, 'Smart Spending', 'Making wise purchasing decisions', 'green', 20, false),
  (5, 'Banks and Accounts', 'How banks work and types of accounts', 'green', 25, false),
  (6, 'Interest Explained', 'Understanding simple and compound interest', 'green', 30, true),
  (7, 'Credit Fundamentals', 'What is credit and how does it work', 'green', 25, false),
  (8, 'Debt Management', 'Managing and avoiding bad debt', 'green', 30, false),
  (9, 'Financial Goals', 'Setting short and long-term goals', 'green', 20, false),
  (10, 'Green Certificate Review', 'Final assessment for Green certification', 'green', 45, true),
  (11, 'Introduction to Investing', 'Why and how to invest your money', 'white', 30, false),
  (12, 'Stock Market Basics', 'Understanding stocks and the market', 'white', 35, true),
  (13, 'Bonds and Fixed Income', 'Learn about bonds as investments', 'white', 30, false),
  (14, 'Mutual Funds & ETFs', 'Diversification made simple', 'white', 30, false),
  (15, 'Risk and Return', 'Understanding investment risk', 'white', 35, true),
  (16, 'Portfolio Building', 'Creating a balanced portfolio', 'white', 40, true),
  (17, 'Market Analysis', 'Reading charts and market data', 'white', 35, false),
  (18, 'Investment Strategies', 'Different approaches to investing', 'white', 40, false),
  (19, 'Retirement Planning Intro', 'Starting to plan for retirement', 'white', 35, false),
  (20, 'White Certificate Review', 'Final assessment for White certification', 'white', 60, true),
  (21, 'Advanced Trading', 'Complex trading strategies', 'gold', 45, true),
  (22, 'Options Fundamentals', 'Introduction to options trading', 'gold', 50, true),
  (23, 'Real Estate Investing', 'Investing in property', 'gold', 40, false),
  (24, 'Tax-Advantaged Accounts', '401k, IRA, and tax strategies', 'gold', 45, false),
  (25, 'Estate Planning Basics', 'Planning for wealth transfer', 'gold', 40, false),
  (26, 'Gold Certificate Review', 'Final assessment for Gold certification', 'gold', 75, true),
  (99, 'Advanced Wealth Management', 'Comprehensive wealth strategies for adults', 'blue', 90, true);