import { useNotification } from '../../context/NotificationContext';

const TYPE_STYLES = {
  success: 'border-success bg-success/10 text-success',
  error: 'border-destructive bg-destructive/10 text-destructive',
  warning: 'border-warning bg-warning/10 text-warning',
  info: 'border-brand-blue bg-brand-blue/10 text-brand-blue',
};

const TYPE_LABELS = {
  success: 'success notification',
  error: 'error notification',
  warning: 'warning notification',
  info: 'info notification',
};

const TYPE_ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 11 3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Toast() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${TYPE_STYLES[n.type] || TYPE_STYLES.info}`}
        >
          {TYPE_ICONS[n.type] || TYPE_ICONS.info}
          <div className="min-w-0 flex-1">
            {n.title && <p className="text-sm font-medium">{n.title}</p>}
            {n.message && <p className="text-sm opacity-90">{n.message}</p>}
          </div>
          <button
            type="button"
            onClick={() => removeNotification(n.id)}
            aria-label={`Dismiss ${TYPE_LABELS[n.type] || 'notification'}`}
            className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="m18 6-12 12M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
