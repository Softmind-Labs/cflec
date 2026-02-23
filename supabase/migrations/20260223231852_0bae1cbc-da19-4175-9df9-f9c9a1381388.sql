
-- 1. Drop overly permissive portfolio SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view all portfolios for leaderboard" ON public.portfolios;

-- 2. Add database constraints to prevent invalid state
ALTER TABLE public.portfolios ADD CONSTRAINT positive_balance CHECK (cash_balance >= 0);
ALTER TABLE public.stock_holdings ADD CONSTRAINT positive_quantity CHECK (quantity > 0);

-- 3. Create secure execute_trade RPC (SECURITY DEFINER with row locks)
CREATE OR REPLACE FUNCTION public.execute_trade(
  p_stock_id UUID,
  p_transaction_type TEXT,
  p_quantity INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_portfolio RECORD;
  v_stock RECORD;
  v_total_amount NUMERIC;
  v_holding RECORD;
  v_new_qty INTEGER;
  v_new_avg_cost NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Validate inputs
  IF p_transaction_type NOT IN ('buy', 'sell') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;
  
  IF p_quantity <= 0 OR p_quantity > 10000 THEN
    RAISE EXCEPTION 'Invalid quantity: must be between 1 and 10000';
  END IF;
  
  -- Get portfolio with row lock to prevent race conditions
  SELECT id, cash_balance INTO v_portfolio
  FROM portfolios
  WHERE user_id = auth.uid()
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Portfolio not found';
  END IF;
  
  -- Get current stock price from server (not client-supplied)
  SELECT id, current_price INTO v_stock
  FROM mock_stocks
  WHERE id = p_stock_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock not found';
  END IF;
  
  v_total_amount := v_stock.current_price * p_quantity;
  
  IF p_transaction_type = 'buy' THEN
    IF v_portfolio.cash_balance < v_total_amount THEN
      RAISE EXCEPTION 'Insufficient funds';
    END IF;
    
    -- Deduct cash
    UPDATE portfolios SET cash_balance = cash_balance - v_total_amount WHERE id = v_portfolio.id;
    
    -- Update or create holding
    SELECT * INTO v_holding FROM stock_holdings
    WHERE portfolio_id = v_portfolio.id AND stock_id = p_stock_id
    FOR UPDATE;
    
    IF FOUND THEN
      v_new_qty := v_holding.quantity + p_quantity;
      v_new_avg_cost := ((v_holding.quantity * v_holding.average_cost) + v_total_amount) / v_new_qty;
      UPDATE stock_holdings SET quantity = v_new_qty, average_cost = v_new_avg_cost WHERE id = v_holding.id;
    ELSE
      INSERT INTO stock_holdings (portfolio_id, stock_id, quantity, average_cost)
      VALUES (v_portfolio.id, p_stock_id, p_quantity, v_stock.current_price);
    END IF;
    
  ELSE -- sell
    SELECT * INTO v_holding FROM stock_holdings
    WHERE portfolio_id = v_portfolio.id AND stock_id = p_stock_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No holdings found for this stock';
    END IF;
    
    IF v_holding.quantity < p_quantity THEN
      RAISE EXCEPTION 'Insufficient shares';
    END IF;
    
    -- Add cash
    UPDATE portfolios SET cash_balance = cash_balance + v_total_amount WHERE id = v_portfolio.id;
    
    v_new_qty := v_holding.quantity - p_quantity;
    IF v_new_qty = 0 THEN
      DELETE FROM stock_holdings WHERE id = v_holding.id;
    ELSE
      UPDATE stock_holdings SET quantity = v_new_qty WHERE id = v_holding.id;
    END IF;
  END IF;
  
  -- Record transaction
  INSERT INTO transactions (portfolio_id, stock_id, transaction_type, quantity, price_per_share, total_amount)
  VALUES (v_portfolio.id, p_stock_id, p_transaction_type, p_quantity, v_stock.current_price, v_total_amount)
  RETURNING id INTO v_transaction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'price_per_share', v_stock.current_price,
    'total_amount', v_total_amount,
    'new_cash_balance', (SELECT cash_balance FROM portfolios WHERE id = v_portfolio.id)
  );
END;
$$;

-- 4. Create get_leaderboard RPC (replaces direct leaderboard view access)
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  account_type account_type,
  cash_balance NUMERIC,
  holdings_value NUMERIC,
  total_value NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    pr.full_name,
    pr.avatar_url,
    pr.account_type,
    p.cash_balance,
    COALESCE(SUM(sh.quantity * ms.current_price), 0) as holdings_value,
    p.cash_balance + COALESCE(SUM(sh.quantity * ms.current_price), 0) as total_value
  FROM portfolios p
  JOIN profiles pr ON p.user_id = pr.user_id
  LEFT JOIN stock_holdings sh ON p.id = sh.portfolio_id
  LEFT JOIN mock_stocks ms ON sh.stock_id = ms.id
  GROUP BY p.user_id, pr.full_name, pr.avatar_url, pr.account_type, p.cash_balance
  ORDER BY total_value DESC
  LIMIT limit_count;
$$;
