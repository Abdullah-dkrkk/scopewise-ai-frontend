import PropTypes from 'prop-types';
import cn from '../../utils/cn';

export default function Separator({ orientation = 'horizontal', className, ...props }) {
  return (
    <div
      role="separator"
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}

Separator.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};
