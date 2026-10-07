import PropTypes from 'prop-types';
import cn from '../../utils/cn';

export default function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn('size-9 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {children}
    </div>
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
