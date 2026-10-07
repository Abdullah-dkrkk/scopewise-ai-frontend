import PropTypes from 'prop-types';
import cn from '../../utils/cn';

export default function Card({
  className, children, size = 'md', ...props
}) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card text-card-foreground',
        size === 'sm' ? 'p-4' : 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
};

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-heading font-semibold tracking-tight text-xl', className)} {...props}>
      {children}
    </h3>
  );
}

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center mt-4', className)} {...props}>
      {children}
    </div>
  );
}

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
