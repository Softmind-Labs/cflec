import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export type SimAssetType = 'crypto' | 'forex' | 'commodity' | 'bond' | 'fund' | 'etf' | 'tbill' | 'gse-stock' | 'stock';

interface SimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetName: string;
  assetSymbol?: string;
  price: number;
  assetType: SimAssetType;
  currency?: string;
  /** For T-Bills: annual rate as % */
  rate?: number;
  /** For T-Bills: tenor in days */
  tenorDays?: number;
  /** For bonds: yield % p.a. */
  yieldPct?: number;
  /** For bonds: maturity year */
  maturity?: string;
  /** For mutual funds: YTD return % */
  ytdReturn?: number;
  /** For forex: bid/ask */
  bid?: number;
  ask?: number;
  /** For commodities: unit label */
  unit?: string;
}

export function SimulationDialog({
  open, onOpenChange, assetName, assetSymbol, price, assetType, currency = 'USD',
  rate, tenorDays, yieldPct, maturity, ytdReturn, bid, ask, unit,
}: SimulationDialogProps) {
  const [amount, setAmount] = useState('');
  const investmentAmount = parseFloat(amount) || 0;

  const result = useMemo(() => {
    if (investmentAmount <= 0) return null;

    switch (assetType) {
      case 'tbill': {
        const r = (rate || 0) / 100;
        const days = tenorDays || 91;
        const interest = investmentAmount * r * (days / 365);
        const maturityVal = investmentAmount + interest;
        return {
          title: 'T-Bill Simulation',
          rows: [
            { label: 'Principal', value: `GHS ${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Interest (${rate}% × ${days} days)`, value: `GHS ${interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Maturity Value', value: `GHS ${maturityVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
          ],
        };
      }
      case 'bond': {
        const y = (yieldPct || 0) / 100;
        const annualInterest = investmentAmount * y;
        return {
          title: 'Bond Investment Simulation',
          rows: [
            { label: 'Investment', value: `GHS ${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Annual Interest (${yieldPct}%)`, value: `GHS ${annualInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Maturity', value: maturity || 'N/A' },
            { label: 'Total at Maturity (est.)', value: `GHS ${(investmentAmount + annualInterest * 5).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
          ],
        };
      }
      case 'fund': {
        const nav = price;
        const units = nav > 0 ? investmentAmount / nav : 0;
        const projectedReturn = investmentAmount * ((ytdReturn || 0) / 100);
        return {
          title: 'Mutual Fund Simulation',
          rows: [
            { label: 'Investment', value: `GHS ${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Units at NAV ${nav.toFixed(2)}`, value: units.toFixed(4) },
            { label: `Projected Return (${ytdReturn}% YTD)`, value: `GHS ${projectedReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Projected Value', value: `GHS ${(investmentAmount + projectedReturn).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
          ],
        };
      }
      case 'forex': {
        const buyRate = ask || price;
        const sellRate = bid || price;
        const bought = buyRate > 0 ? investmentAmount / buyRate : 0;
        return {
          title: 'Forex Simulation',
          rows: [
            { label: 'Amount', value: `${currency} ${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Buy at ${buyRate}`, value: `${bought.toLocaleString(undefined, { minimumFractionDigits: 4 })}` },
            { label: `Sell at ${sellRate}`, value: `${(investmentAmount * sellRate).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Spread Cost', value: `${((ask || 0) - (bid || 0)).toFixed(4)}` },
          ],
        };
      }
      case 'commodity': {
        const qty = price > 0 ? investmentAmount / price : 0;
        return {
          title: 'Commodity Simulation',
          rows: [
            { label: 'Investment', value: `$${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Price per ${unit || 'unit'}`, value: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Quantity', value: `${qty.toFixed(4)} ${unit || 'units'}` },
            { label: 'Position Value', value: `$${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
          ],
        };
      }
      default: {
        // crypto, stock, etf, gse-stock
        const cur = assetType === 'gse-stock' ? 'GHS' : '$';
        const qty = price > 0 ? investmentAmount / price : 0;
        const projected5 = investmentAmount * 1.05;
        const projected10 = investmentAmount * 1.10;
        return {
          title: `${assetType === 'gse-stock' ? 'GSE Stock' : assetType === 'etf' ? 'ETF' : assetType === 'crypto' ? 'Crypto' : 'Stock'} Simulation`,
          rows: [
            { label: 'Investment', value: `${cur}${investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: `Shares/Units at ${cur}${price.toFixed(2)}`, value: qty.toFixed(4) },
            { label: 'If +5% (1yr est.)', value: `${cur}${projected5.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'If +10% (1yr est.)', value: `${cur}${projected10.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bold: true },
          ],
        };
      }
    }
  }, [investmentAmount, assetType, price, rate, tenorDays, yieldPct, maturity, ytdReturn, bid, ask, unit, currency]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Simulate: {assetName}
            {assetSymbol && <Badge variant="secondary">{assetSymbol}</Badge>}
          </DialogTitle>
          <DialogDescription>
            Enter an amount to see projected outcomes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sim-amount">
              Investment Amount ({assetType === 'gse-stock' || assetType === 'tbill' || assetType === 'bond' || assetType === 'fund' ? 'GHS' : 'USD'})
            </Label>
            <Input
              id="sim-amount"
              type="number"
              min="1"
              placeholder="e.g. 1000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          {result && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <p className="font-semibold text-sm">{result.title}</p>
              {result.rows.map((row, i) => (
                <div key={i} className={`flex justify-between text-sm ${row.bold ? 'font-bold border-t pt-2' : ''}`}>
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>This is an <strong>educational simulation</strong> only. No real money is being invested. Projected returns are hypothetical and not guaranteed.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
