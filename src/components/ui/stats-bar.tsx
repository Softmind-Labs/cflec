import { cn } from '@/lib/utils';

export interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatsBarProps {
  items: StatItem[];
  className?: string;
}

export function StatsBar({ items, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center rounded-xl bg-muted/60 border border-border px-2 py-3',
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 px-4 py-1',
            index !== items.length - 1 && 'border-r border-border',
          )}
        >
          {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight tabular-nums">{item.value}</span>
            <span className="text-[0.8125rem] font-medium tracking-[0.01em] text-muted-foreground leading-tight">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
