import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle navigation"
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">Software requirement analysis &amp; estimation</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/design-preview"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
        >
          Design preview
        </Link>
        <Link
          to="/app/analyze"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Analyze requirement</span>
          <span className="sm:hidden">Analyze</span>
        </Link>
      </div>
    </header>
  );
}

Header.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
};
