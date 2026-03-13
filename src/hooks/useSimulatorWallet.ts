import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Position {
  id: string;
  simulator_type: string;
  category: string;
  asset_symbol: string;
  asset_name: string;
  position_type: string;
  quantity: number;
  entry_price: number;
  total_invested: number;
  interest_rate: number | null;
  term_days: number | null;
  maturity_date: string | null;
  is_matured: boolean | null;
  created_at: string;
}

export interface SimulatorWallet {
  id: string;
  cash_balance: number;
  initial_balance: number;
}

export interface Trade {
  id: string;
  simulator_type: string;
  category: string;
  asset_symbol: string;
  asset_name: string;
  trade_type: string;
  quantity: number;
  price_at_execution: number;
  total_value: number;
  created_at: string;
}

export interface PositionSummary {
  count: number;
  totalInvested: number;
}

export function useSimulatorWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<SimulatorWallet | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch or create wallet
      let { data: walletData, error: walletError } = await supabase
        .from('portfolio_wallet')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) throw walletError;

      if (!walletData) {
        const { data: newWallet, error: insertError } = await supabase
          .from('portfolio_wallet')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        walletData = newWallet;
      }

      setWallet({
        id: walletData.id,
        cash_balance: Number(walletData.cash_balance),
        initial_balance: Number(walletData.initial_balance),
      });

      // Fetch positions
      const { data: posData, error: posError } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (posError) throw posError;

      setPositions(
        (posData || []).map((p) => ({
          ...p,
          quantity: Number(p.quantity),
          entry_price: Number(p.entry_price),
          total_invested: Number(p.total_invested),
          interest_rate: p.interest_rate != null ? Number(p.interest_rate) : null,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed values
  const totalInvested = positions.reduce((sum, p) => sum + p.total_invested, 0);
  const cashBalance = wallet?.cash_balance ?? 500;
  const initialBalance = wallet?.initial_balance ?? 500;
  const totalPortfolio = cashBalance + totalInvested;
  const totalReturn = initialBalance > 0 ? ((totalPortfolio - initialBalance) / initialBalance) * 100 : 0;

  // Group positions by simulator_type
  const positionsByType: Record<string, PositionSummary> = {};
  for (const p of positions) {
    if (!positionsByType[p.simulator_type]) {
      positionsByType[p.simulator_type] = { count: 0, totalInvested: 0 };
    }
    positionsByType[p.simulator_type].count++;
    positionsByType[p.simulator_type].totalInvested += p.total_invested;
  }

  return {
    wallet,
    positions,
    loading,
    error,
    refetch: fetchData,
    cashBalance,
    totalInvested,
    totalPortfolio,
    totalReturn,
    positionsByType,
  };
}
