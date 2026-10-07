import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function AuthShell({
  title, subtitle, children, footer,
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-blue">
            <BrainCircuit className="size-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-md">{children}</div>
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
      <Link to="/design-preview" className="mt-8 text-xs text-muted-foreground hover:text-foreground">
        View design system preview
      </Link>
    </div>
  );
}

AuthShell.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};
