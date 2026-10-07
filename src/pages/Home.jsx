import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-blue/10">
          <BrainCircuit className="size-8 text-brand-blue" />
        </div>
        <h1 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">
          ScopeWise AI
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Intelligent software requirement analysis, scope creep prevention, and project estimation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">
              Get Started
              <ArrowRight />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
          <Link to="/design-preview">
            <Button size="lg" variant="ghost">View Design Preview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
