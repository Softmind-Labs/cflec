import { Bell, Info, CheckCircle2, AlertTriangle, GraduationCap, LineChart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, type Notification } from './NotificationContext';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const iconMap: Record<NonNullable<Notification['icon']>, { Icon: typeof Info; color: string; bg: string }> = {
  info: { Icon: Info, color: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.1)' },
  success: { Icon: CheckCircle2, color: 'hsl(142 71% 45%)', bg: 'hsl(142 71% 45% / 0.1)' },
  warning: { Icon: AlertTriangle, color: 'hsl(38 92% 50%)', bg: 'hsl(38 92% 50% / 0.1)' },
  course: { Icon: GraduationCap, color: 'hsl(262 83% 58%)', bg: 'hsl(262 83% 58% / 0.1)' },
  trade: { Icon: LineChart, color: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.1)' },
  certificate: { Icon: Award, color: 'hsl(38 92% 50%)', bg: 'hsl(38 92% 50% / 0.1)' },
};

export function NotificationDropdown() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] p-0 shadow-lg" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-[0.875rem]">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[0.75rem] font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[0.8125rem] font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-[0.75rem] text-muted-foreground/60 mt-0.5">Actions and updates will appear here</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[380px]">
            <div className="divide-y divide-border">
              {notifications.map((notif) => {
                const { Icon, color, bg } = iconMap[notif.icon || 'info'];
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      !notif.read ? 'bg-primary/[0.03]' : ''
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8125rem] leading-snug text-foreground">{notif.message}</p>
                      <p className="text-[0.75rem] text-muted-foreground mt-0.5">{timeAgo(notif.timestamp)}</p>
                    </div>
                    {!notif.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
