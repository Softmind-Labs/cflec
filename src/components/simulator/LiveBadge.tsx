import { Badge } from '@/components/ui/badge';

interface LiveBadgeProps {
  timestamp?: number;
}

export function LiveBadge({ timestamp }: LiveBadgeProps) {
  const timeAgo = timestamp
    ? Math.round((Date.now() - timestamp) / 1000)
    : null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="gap-1.5 text-xs">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Live
      </Badge>
      {timeAgo !== null && (
        <span className="text-xs text-muted-foreground">
          Updated {timeAgo < 60 ? `${timeAgo}s` : `${Math.round(timeAgo / 60)}m`} ago
        </span>
      )}
    </div>
  );
}
