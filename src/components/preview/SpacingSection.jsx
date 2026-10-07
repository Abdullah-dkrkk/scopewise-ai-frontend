const spacingScale = [
  {
    name: '0.5', token: '0.5', value: '2px', size: 'w-0.5',
  },
  {
    name: '1', token: '1', value: '4px', size: 'w-1',
  },
  {
    name: '1.5', token: '1.5', value: '6px', size: 'w-1.5',
  },
  {
    name: '2', token: '2', value: '8px', size: 'w-2',
  },
  {
    name: '3', token: '3', value: '12px', size: 'w-3',
  },
  {
    name: '4', token: '4', value: '16px', size: 'w-4',
  },
  {
    name: '5', token: '5', value: '20px', size: 'w-5',
  },
  {
    name: '6', token: '6', value: '24px', size: 'w-6',
  },
  {
    name: '8', token: '8', value: '32px', size: 'w-8',
  },
  {
    name: '10', token: '10', value: '40px', size: 'w-10',
  },
  {
    name: '12', token: '12', value: '48px', size: 'w-12',
  },
  {
    name: '16', token: '16', value: '64px', size: 'w-16',
  },
  {
    name: '20', token: '20', value: '80px', size: 'w-20',
  },
  {
    name: '24', token: '24', value: '96px', size: 'w-24',
  },
];

export default function SpacingSection() {
  return (
    <section className="border-b py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Spacing</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Tailwind-based 4px spacing scale. Section padding uses
            {' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">py-section</code>
            {' '}
            (5rem / 80px
            desktop, 3rem / 48px mobile).
          </p>
        </div>

        <div className="space-y-3">
          {spacingScale.map((space) => (
            <div key={space.token} className="flex items-center gap-4">
              <div className="w-16 shrink-0 text-right">
                <p className="font-mono text-sm text-muted-foreground">{space.token}</p>
              </div>
              <div className={`h-6 rounded bg-brand-blue/40 ${space.size}`} />
              <div className="shrink-0">
                <p className="font-mono text-sm text-muted-foreground">{space.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <p className="mb-1 text-sm font-medium">Section Padding (desktop)</p>
            <p className="font-mono text-xs text-muted-foreground">py-section → 5rem (80px)</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="mb-1 text-sm font-medium">Section Padding (mobile)</p>
            <p className="font-mono text-xs text-muted-foreground">py-section-sm → 3rem (48px)</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="mb-1 text-sm font-medium">Container Max Width</p>
            <p className="font-mono text-xs text-muted-foreground">container → 1280px</p>
          </div>
        </div>
      </div>
    </section>
  );
}
