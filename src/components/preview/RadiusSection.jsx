const radiusLevels = [
  {
    name: 'xs', token: 'radius-xs', value: '0.25rem / 4px', class: 'rounded-xs',
  },
  {
    name: 'sm', token: 'radius-sm', value: '0.375rem / 6px', class: 'rounded-sm',
  },
  {
    name: 'md', token: 'radius-md', value: '0.5rem / 8px', class: 'rounded-md',
  },
  {
    name: 'lg', token: 'radius-lg', value: '0.75rem / 12px', class: 'rounded-lg',
  },
  {
    name: 'xl', token: 'radius-xl', value: '1rem / 16px', class: 'rounded-xl',
  },
  {
    name: '2xl', token: 'radius-2xl', value: '1.5rem / 24px', class: 'rounded-2xl',
  },
];

export default function RadiusSection() {
  return (
    <section className="border-b py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Border Radius</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Default radius is 0.5rem (md). Scale ranges from subtle (4px) to pronounced (24px).
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {radiusLevels.map((radius) => (
            <div key={radius.token} className="text-center">
              <div className={`mb-3 h-24 w-full border border-brand-blue/30 bg-brand-blue/20 ${radius.class}`} />
              <p className="text-sm font-medium">{radius.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{radius.token}</p>
              <p className="font-mono text-xs text-muted-foreground">{radius.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
