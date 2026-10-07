import PropTypes from 'prop-types';
import cn from '../../utils/cn';

export default function PreviewCard({ children, className }) {
  return <div className={cn('rounded-xl border bg-card p-6', className)}>{children}</div>;
}

PreviewCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
