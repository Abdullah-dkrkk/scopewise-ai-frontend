import PropTypes from 'prop-types';
import cn from '../../utils/cn';

export default function Spinner({ className, size = 'md', ...props }) {
  const sizes = { sm: 'size-4', md: 'size-6', lg: 'size-8' };
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-2 border-border border-t-primary',
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
