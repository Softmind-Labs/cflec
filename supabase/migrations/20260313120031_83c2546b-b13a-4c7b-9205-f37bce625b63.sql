
CREATE OR REPLACE FUNCTION public.execute_simulator_trade(
  p_simulator_type text,
  p_category text,
  p_asset_symbol text,
  p_asset_name text,
  p_position_type text,
  p_trade_type text,
  p_quantity numeric,
  p_price numeric,
  p_interest_rate numeric DEFAULT NULL,
  p_term_days integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_wallet RECORD;
  v_total_cost numeric;
  v_position RECORD;
  v_trade_id uuid;
  v_new_qty numeric;
  v_new_avg numeric;
  v_maturity_date timestamptz;
BEGIN
  -- Validate trade type
  IF p_trade_type NOT IN ('buy', 'sell', 'invest') THEN
    RAISE EXCEPTION 'Invalid trade type: must be buy, sell, or invest';
  END IF;

  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;

  IF p_price < 0 THEN
    RAISE EXCEPTION 'Price must be non-negative';
  END IF;

  v_total_cost := p_quantity * p_price;

  -- For invest type (fixed-term), total_cost is p_quantity (which is the amount)
  IF p_trade_type = 'invest' THEN
    v_total_cost := p_quantity;
  END IF;

  -- Get wallet with row lock
  SELECT id, cash_balance INTO v_wallet
  FROM portfolio_wallet
  WHERE user_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Auto-create wallet
    INSERT INTO portfolio_wallet (user_id)
    VALUES (auth.uid())
    RETURNING id, cash_balance INTO v_wallet;
  END IF;

  IF p_trade_type IN ('buy', 'invest') THEN
    -- Check sufficient funds
    IF v_wallet.cash_balance < v_total_cost THEN
      RAISE EXCEPTION 'Insufficient funds. Available: %, Required: %', v_wallet.cash_balance, v_total_cost;
    END IF;

    -- Deduct cash
    UPDATE portfolio_wallet SET cash_balance = cash_balance - v_total_cost WHERE id = v_wallet.id;

    IF p_trade_type = 'invest' THEN
      -- Fixed-term: always create new position
      v_maturity_date := now() + (COALESCE(p_term_days, 365) || ' days')::interval;

      INSERT INTO positions (user_id, simulator_type, category, asset_symbol, asset_name, position_type, quantity, entry_price, total_invested, interest_rate, term_days, maturity_date, is_matured)
      VALUES (auth.uid(), p_simulator_type, p_category, p_asset_symbol, p_asset_name, p_position_type, p_quantity, p_price, v_total_cost, p_interest_rate, p_term_days, v_maturity_date, false);
    ELSE
      -- Market buy: upsert position
      SELECT * INTO v_position FROM positions
      WHERE user_id = auth.uid() AND asset_symbol = p_asset_symbol AND simulator_type = p_simulator_type AND position_type = 'market'
      FOR UPDATE;

      IF FOUND THEN
        v_new_qty := v_position.quantity + p_quantity;
        v_new_avg := (v_position.total_invested + v_total_cost) / v_new_qty;
        UPDATE positions SET quantity = v_new_qty, entry_price = v_new_avg, total_invested = v_position.total_invested + v_total_cost WHERE id = v_position.id;
      ELSE
        INSERT INTO positions (user_id, simulator_type, category, asset_symbol, asset_name, position_type, quantity, entry_price, total_invested)
        VALUES (auth.uid(), p_simulator_type, p_category, p_asset_symbol, p_asset_name, 'market', p_quantity, p_price, v_total_cost);
      END IF;
    END IF;

  ELSE
    -- Sell
    SELECT * INTO v_position FROM positions
    WHERE user_id = auth.uid() AND asset_symbol = p_asset_symbol AND simulator_type = p_simulator_type AND position_type = 'market'
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No position found for %', p_asset_symbol;
    END IF;

    IF v_position.quantity < p_quantity THEN
      RAISE EXCEPTION 'Insufficient quantity. Have: %, Selling: %', v_position.quantity, p_quantity;
    END IF;

    -- Add cash back
    UPDATE portfolio_wallet SET cash_balance = cash_balance + v_total_cost WHERE id = v_wallet.id;

    v_new_qty := v_position.quantity - p_quantity;
    IF v_new_qty = 0 THEN
      DELETE FROM positions WHERE id = v_position.id;
    ELSE
      UPDATE positions SET quantity = v_new_qty, total_invested = v_position.total_invested - (v_total_cost * (p_quantity / v_position.quantity)) WHERE id = v_position.id;
    END IF;
  END IF;

  -- Log trade
  INSERT INTO trades (user_id, simulator_type, category, asset_symbol, asset_name, trade_type, quantity, price_at_execution, total_value)
  VALUES (auth.uid(), p_simulator_type, p_category, p_asset_symbol, p_asset_name, p_trade_type, p_quantity, p_price, v_total_cost)
  RETURNING id INTO v_trade_id;

  RETURN jsonb_build_object(
    'success', true,
    'trade_id', v_trade_id,
    'trade_type', p_trade_type,
    'total_value', v_total_cost,
    'new_cash_balance', (SELECT cash_balance FROM portfolio_wallet WHERE id = v_wallet.id)
  );
END;
$$;
