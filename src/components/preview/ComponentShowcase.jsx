import ButtonShowcase from './sections/ButtonShowcase';
import BadgeShowcase from './sections/BadgeShowcase';
import CardShowcase from './sections/CardShowcase';
import InputShowcase from './sections/InputShowcase';
import MiscShowcase from './sections/MiscShowcase';
import AnalysisShowcase from './sections/AnalysisShowcase';
import CompositionShowcase from './sections/CompositionShowcase';

export default function ComponentShowcase() {
  return (
    <section className="py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Components</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Live previews of the reusable UI components and domain-specific analysis components that
            power the ScopeWise AI frontend.
          </p>
        </div>

        <ButtonShowcase />
        <BadgeShowcase />
        <CardShowcase />
        <InputShowcase />
        <MiscShowcase />
        <AnalysisShowcase />
        <CompositionShowcase />
      </div>
    </section>
  );
}
