import PropTypes from 'prop-types';
import {
  AlertCircle, CheckCircle2, Info, AlertTriangle, X,
} from 'lucide-react';
import cn from '../../utils/cn';

const VARIANT_CONFIG = {
  info: { classes: 'border-primary/20 bg-primary/5 text-primary', Icon: Info },
  success: { classes: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600', Icon: CheckCircle2 },
  warning: { classes: 'border-amber-500/20 bg-amber-500/5 text-amber-600', Icon: AlertTriangle },
  error: { classes: 'border-destructive/20 bg-destructive/5 text-destructive', Icon: AlertCircle },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}) {
  const { classes, Icon } = VARIANT_CONFIG[variant];
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-lg border p-4 text-sm', classes, className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="rounded p-0.5 hover:bg-current/10">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  className: PropTypes.string,
};
