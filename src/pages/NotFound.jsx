import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-heading text-[9rem] font-bold leading-none tracking-tighter text-primary/10">
        404
      </p>
      <h1 className="mb-3 font-heading text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
