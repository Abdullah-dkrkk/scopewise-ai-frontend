import PropTypes from 'prop-types';
import { AlertOctagon } from 'lucide-react';

/**
 * Rendered instead of the app when the build is misconfigured.
 *
 * Failing here is far better than firing requests at an undefined base URL and
 * showing an empty dashboard in production.
 */
export default function ConfigErrorScreen({ problems }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl rounded-xl border border-destructive/30 bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertOctagon className="size-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-semibold tracking-tight">
              Configuration error
            </h1>
            <p className="text-sm text-muted-foreground">
              The app cannot start with its current environment settings.
            </p>
          </div>
        </div>

        <ul className="mb-5 space-y-2">
          {problems.map((problem) => (
            <li
              key={problem}
              className="flex items-start gap-2 rounded-lg bg-destructive/5 p-3 text-sm"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
              <span className="min-w-0 break-words">{problem}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg bg-muted p-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            How to fix
          </p>
          <p className="text-sm text-muted-foreground">
            Copy
            {' '}
            <code className="font-mono text-xs">.env.example</code>
            {' '}
            to
            {' '}
            <code className="font-mono text-xs">.env</code>
            {' '}
            and set the values for the environment you are deploying to.
          </p>
        </div>
      </div>
    </div>
  );
}

ConfigErrorScreen.propTypes = {
  problems: PropTypes.arrayOf(PropTypes.string).isRequired,
};
