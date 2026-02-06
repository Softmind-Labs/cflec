-- Fix security issues: update_updated_at_column function and leaderboard view

-- Fix 1: Drop and recreate update_updated_at_column with search_path
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON public.portfolios;
DROP TRIGGER IF EXISTS update_stock_holdings_updated_at ON public.stock_holdings;
DROP TRIGGER IF EXISTS update_mock_stocks_updated_at ON public.mock_stocks;

DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
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

-- Fix 2: Drop and recreate leaderboard view with security_invoker
DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard 
WITH (security_invoker = on)
AS
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

-- Add policy to allow viewing public leaderboard data
-- First, add a policy on profiles to allow viewing limited info for leaderboard
CREATE POLICY "Authenticated users can view leaderboard profile info"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Update portfolios policy to allow viewing for leaderboard
CREATE POLICY "Authenticated users can view all portfolios for leaderboard"
  ON public.portfolios FOR SELECT
  TO authenticated
  USING (true);