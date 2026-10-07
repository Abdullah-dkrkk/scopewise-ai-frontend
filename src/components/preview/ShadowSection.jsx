const shadowLevels = [
  {
    name: '2xs', token: 'shadow-2xs', value: '0 1px 2px 0 rgb(0 0 0 / 0.04)', class: 'shadow-2xs',
  },
  {
    name: 'xs', token: 'shadow-xs', value: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)', class: 'shadow-xs',
  },
  {
    name: 'sm', token: 'shadow-sm', value: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)', class: 'shadow-sm',
  },
  {
    name: 'md', token: 'shadow', value: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)', class: 'shadow',
  },
  {
    name: 'lg', token: 'shadow-md', value: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)', class: 'shadow-md',
  },
  {
    name: 'xl', token: 'shadow-lg', value: '0 25px 50px -12px rgb(0 0 0 / 0.12)', class: 'shadow-lg',
  },
  {
    name: '2xl', token: 'shadow-xl', value: '0 50px 100px -12px rgb(0 0 0 / 0.15)', class: 'shadow-xl',
  },
];

export default function ShadowSection() {
  return (
    <section className="border-b py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Shadows</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Seven levels of shadow depth for elevation and layering.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shadowLevels.map((shadow) => (
            <div key={shadow.token} className={`rounded-xl bg-card p-6 ${shadow.class}`}>
              <div className="mb-4 flex h-24 items-center justify-center rounded-lg border bg-background">
                <div className={`h-12 w-24 rounded-md bg-card ${shadow.class}`} />
              </div>
              <p className="text-sm font-medium">{shadow.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{shadow.token}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
