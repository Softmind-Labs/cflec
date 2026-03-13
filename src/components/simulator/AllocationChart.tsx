import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type PositionSummary } from '@/hooks/useSimulatorWallet';

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  cash: { label: 'Cash', color: 'hsl(215, 20%, 65%)' },
  banking: { label: 'Banking', color: 'hsl(217, 91%, 60%)' },
  investment: { label: 'Investment', color: 'hsl(142, 76%, 36%)' },
  trading: { label: 'Trading', color: 'hsl(36, 77%, 49%)' },
  capital_markets: { label: 'Capital Markets', color: 'hsl(239, 84%, 67%)' },
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface AllocationChartProps {
  cashBalance: number;
  positionsByType: Record<string, PositionSummary>;
  totalPortfolio: number;
}

export function AllocationChart({ cashBalance, positionsByType, totalPortfolio }: AllocationChartProps) {
  const data = [
    { name: 'Cash', value: cashBalance, key: 'cash' },
    ...Object.entries(positionsByType).map(([type, summary]) => ({
      name: CATEGORY_CONFIG[type]?.label || type,
      value: summary.totalInvested,
      key: type,
    })),
  ].filter((d) => d.value > 0);

  if (data.length <= 1) return null;

  const topHoldings = [...data]
    .filter((d) => d.key !== 'cash')
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-[180px] h-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={CATEGORY_CONFIG[entry.key]?.color || 'hsl(var(--muted))'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--popover))',
                    color: 'hsl(var(--popover-foreground))',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            {data.map((entry) => {
              const pct = totalPortfolio > 0 ? ((entry.value / totalPortfolio) * 100).toFixed(1) : '0';
              return (
                <div key={entry.key} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_CONFIG[entry.key]?.color }}
                  />
                  <span className="text-sm flex-1 truncate">{entry.name}</span>
                  <span className="text-sm tabular-nums font-medium">{formatCurrency(entry.value)}</span>
                  <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">{pct}%</span>
                </div>
              );
            })}

            {topHoldings.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Top holdings</p>
                {topHoldings.map((h) => (
                  <p key={h.key} className="text-xs text-muted-foreground">
                    {h.name}: {formatCurrency(h.value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
