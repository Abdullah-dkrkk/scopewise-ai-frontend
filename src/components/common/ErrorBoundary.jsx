import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Catches render-time errors anywhere below it.
 *
 * Without this a single bad payload (null field, unexpected enum) produces a
 * permanently blank page with no diagnostics. React error boundaries must be
 * class components.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with your reporter (Sentry, etc.) in production.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Unhandled UI error:', error, info.componentStack);
    }
  }

  handleReset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) return children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Something broke
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected error stopped this page from rendering. Your data is safe —
            nothing was lost.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-4 max-h-40 overflow-auto break-words whitespace-pre-wrap rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {error.message}
            </pre>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
