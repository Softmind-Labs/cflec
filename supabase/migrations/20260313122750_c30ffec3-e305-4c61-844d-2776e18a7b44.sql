
CREATE OR REPLACE FUNCTION public.reset_simulator_wallet()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_wallet RECORD;
BEGIN
  -- Get wallet
  SELECT id, initial_balance INTO v_wallet
  FROM portfolio_wallet
  WHERE user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No wallet found');
  END IF;

  -- Delete all positions
  DELETE FROM positions WHERE user_id = auth.uid();

  -- Delete all trades
  DELETE FROM trades WHERE user_id = auth.uid();

  -- Reset cash balance
  UPDATE portfolio_wallet
  SET cash_balance = v_wallet.initial_balance, updated_at = now()
  WHERE user_id = auth.uid();

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_wallet.initial_balance
  );
END;
$$;
