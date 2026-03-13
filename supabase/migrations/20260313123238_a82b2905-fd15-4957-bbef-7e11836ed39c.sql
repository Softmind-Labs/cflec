CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count integer DEFAULT 50)
 RETURNS TABLE(user_id uuid, full_name text, avatar_url text, account_type account_type, cash_balance numeric, holdings_value numeric, total_value numeric)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;