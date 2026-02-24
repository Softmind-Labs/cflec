import { useEffect, useState } from 'react';
import { X, Info, CheckCircle2, AlertTriangle, GraduationCap, LineChart, Award } from 'lucide-react';
import { useNotifications, type Notification } from './NotificationContext';

const iconMap: Record<NonNullable<Notification['icon']>, { Icon: typeof Info; color: string; bg: string }> = {
  info: { Icon: Info, color: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.1)' },
  success: { Icon: CheckCircle2, color: 'hsl(142 71% 45%)', bg: 'hsl(142 71% 45% / 0.1)' },
  warning: { Icon: AlertTriangle, color: 'hsl(38 92% 50%)', bg: 'hsl(38 92% 50% / 0.1)' },
  course: { Icon: GraduationCap, color: 'hsl(262 83% 58%)', bg: 'hsl(262 83% 58% / 0.1)' },
  trade: { Icon: LineChart, color: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.1)' },
  certificate: { Icon: Award, color: 'hsl(38 92% 50%)', bg: 'hsl(38 92% 50% / 0.1)' },
};

export function NotificationToast() {
  const { latestNotification, clearLatest } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (!latestNotification) {
      setVisible(false);
      setDismissing(false);
      return;
    }

    setVisible(true);
    setDismissing(false);

    const dismissTimer = setTimeout(() => {
      setDismissing(true);
    }, 3500);

    const removeTimer = setTimeout(() => {
      clearLatest();
    }, 4000);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(removeTimer);
    };
  }, [latestNotification, clearLatest]);

  if (!latestNotification || !visible) return null;

  const { Icon, color, bg } = iconMap[latestNotification.icon || 'info'];

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(clearLatest, 300);
  };

  return (
    <div
      className={`
        fixed top-[76px] right-5 z-[60] w-[320px] pointer-events-auto
        rounded-[14px] border border-[rgba(0,0,0,0.06)] bg-card
        shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]
        transition-all duration-300 ease-out
        ${dismissing
          ? 'opacity-0 -translate-y-2'
          : 'opacity-100 translate-y-0 animate-[notif-slide-down_0.35s_cubic-bezier(0.34,1.56,0.64,1)]'
        }
      `}
    >
      <div className="flex items-start gap-3 p-3.5">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: bg }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[0.8125rem] leading-snug text-foreground font-medium">
            {latestNotification.message}
          </p>
          <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Just now</p>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
