import { Sparkles } from 'lucide-react';

export default function DesignHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 flex min-h-[420px] flex-col border-b">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-brand-orange/10 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto flex flex-1 items-center justify-center px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
            <Sparkles className="size-4 text-brand-blue" />
            ScopeWise AI — Design System
            <Sparkles className="size-4 text-brand-orange" />
          </div>
          <h1 className="mb-6 font-heading text-5xl font-semibold leading-none tracking-tight md:text-7xl">
            From
            {' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-blue-dark bg-clip-text text-transparent">
              Ambiguous
            </span>
            {' '}
            to Scoped
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A single source of truth for colors, typography, spacing, shadows, and radii — powering
            every page of the ScopeWise AI frontend.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
