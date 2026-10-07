import PropTypes from 'prop-types';
import cn from '../../utils/cn';

const SIDE_CLASSES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({
  label, side = 'top', children, className,
}) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-xs rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100',
          SIDE_CLASSES[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
