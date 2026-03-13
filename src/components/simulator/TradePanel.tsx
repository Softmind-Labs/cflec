import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Loader2, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TradeType = 'buy' | 'sell' | 'invest';

export interface TradePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetName: string;
  assetSymbol: string;
  price: number;
  simulatorType: string;
  category: string;
  positionType: 'market' | 'fixed_term';
  tradeType: TradeType;
  currency?: string;
  cashBalance: number;
  /** For fixed-term: interest rate % */
  interestRate?: number;
  /** For fixed-term: tenor in days */
  termDays?: number;
  /** Callback after successful trade */
  onSuccess?: () => void;
}

export function TradePanel({
  open,
  onOpenChange,
  assetName,
  assetSymbol,
  price,
  simulatorType,
  category,
  positionType,
  tradeType,
  currency = 'USD',
  cashBalance,
  interestRate,
  termDays,
  onSuccess,
}: TradePanelProps) {
  const [amount, setAmount] = useState('');
  const [executing, setExecuting] = useState(false);

  const isFixedTerm = positionType === 'fixed_term';
  const inputValue = parseFloat(amount) || 0;

  const calculation = useMemo(() => {
    if (inputValue <= 0) return null;

    if (isFixedTerm) {
      const r = (interestRate || 0) / 100;
      const days = termDays || 365;
      const interest = inputValue * r * (days / 365);
      return {
        quantity: inputValue,
        total: inputValue,
        details: [
          { label: 'Investment Amount', value: `${currency} ${inputValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          { label: `Interest (${interestRate}% × ${days}d)`, value: `${currency} ${interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          { label: 'Maturity Value', value: `${currency} ${(inputValue + interest).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
        ],
      };
    } else {
      const qty = inputValue;
      const total = qty * price;
      return {
        quantity: qty,
        total,
        details: [
          { label: 'Quantity', value: qty.toFixed(4) },
          { label: `Price per unit`, value: `${currency} ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          { label: 'Total Cost', value: `${currency} ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
        ],
      };
    }
  }, [inputValue, price, isFixedTerm, interestRate, termDays, currency]);

  const canExecute = useMemo(() => {
    if (!calculation || inputValue <= 0) return false;
    if (tradeType === 'sell') return true; // server validates position quantity
    return calculation.total <= cashBalance;
  }, [calculation, inputValue, tradeType, cashBalance]);

  const handleExecute = async () => {
    if (!calculation) return;
    setExecuting(true);

    try {
      const { data, error } = await supabase.rpc('execute_simulator_trade', {
        p_simulator_type: simulatorType,
        p_category: category,
        p_asset_symbol: assetSymbol,
        p_asset_name: assetName,
        p_position_type: positionType,
        p_trade_type: tradeType,
        p_quantity: calculation.quantity,
        p_price: price,
        p_interest_rate: interestRate ?? null,
        p_term_days: termDays ?? null,
      });

      if (error) throw error;

      const result = data as { success: boolean; new_cash_balance: number; total_value: number };

      toast.success(
        `${tradeType === 'invest' ? 'Investment' : tradeType === 'buy' ? 'Purchase' : 'Sale'} confirmed`,
        {
          description: `${assetName} — ${currency} ${result.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        }
      );

      setAmount('');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error('Trade failed', { description: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const tradeLabel = tradeType === 'invest' ? 'Invest' : tradeType === 'buy' ? 'Buy' : 'Sell';
  const tradeColor = tradeType === 'sell' ? 'destructive' : 'default';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {tradeLabel}: {assetName}
            <Badge variant="secondary">{assetSymbol}</Badge>
          </SheetTitle>
          <SheetDescription>
            {isFixedTerm ? 'Enter the amount to invest' : `Enter the quantity to ${tradeType}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 py-4">
          {/* Wallet balance */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cash Available:</span>
            <span className="font-semibold tabular-nums ml-auto">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Price display for market assets */}
          {!isFixedTerm && (
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="font-semibold tabular-nums">
                {currency} {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="trade-amount">
              {isFixedTerm ? `Amount (${currency})` : 'Quantity'}
            </Label>
            <Input
              id="trade-amount"
              type="number"
              min="0"
              step={isFixedTerm ? '100' : '0.0001'}
              placeholder={isFixedTerm ? 'e.g. 1000' : 'e.g. 5'}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          {/* Calculation result */}
          {calculation && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              {calculation.details.map((row, i) => (
                <div key={i} className={`flex justify-between text-sm ${row.bold ? 'font-bold border-t pt-2 border-border' : ''}`}>
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Insufficient funds warning */}
          {calculation && !canExecute && tradeType !== 'sell' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Insufficient funds. You need {currency} {(calculation.total - cashBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })} more.</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>This is an <strong>educational simulation</strong>. No real money is involved.</p>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={tradeColor}
            onClick={handleExecute}
            disabled={!canExecute || executing}
            className="flex-1"
          >
            {executing ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Executing...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" />Confirm {tradeLabel}</>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
