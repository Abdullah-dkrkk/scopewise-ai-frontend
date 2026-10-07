import PropTypes from 'prop-types';
import cn from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-border text-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  brand: 'bg-brand-blue text-white',
  warning: 'bg-brand-orange text-white',
  success: 'bg-emerald-500 text-white',
};

export default function Badge({
  variant = 'default', className, children, ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['default', 'secondary', 'outline', 'destructive', 'brand', 'warning', 'success']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
