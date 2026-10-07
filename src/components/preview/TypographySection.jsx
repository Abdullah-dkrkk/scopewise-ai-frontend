import cn from '../../utils/cn';

const typeScale = [
  {
    name: 'Display 2XL', tag: 'text-9xl', size: 'clamp(3.5rem, 10vw, 5rem)', lineHeight: '1.05', className: 'text-9xl',
  },
  {
    name: 'Display XL', tag: 'text-8xl', size: 'clamp(3rem, 8vw, 4.5rem)', lineHeight: '1.1', className: 'text-8xl',
  },
  {
    name: 'Display LG', tag: 'text-7xl', size: 'clamp(2.625rem, 6.5vw, 4rem)', lineHeight: '1.15', className: 'text-7xl',
  },
  {
    name: 'Display MD', tag: 'text-6xl', size: 'clamp(2.25rem, 5.5vw, 3.25rem)', lineHeight: '1.2', className: 'text-6xl',
  },
  {
    name: 'Display SM', tag: 'text-5xl', size: 'clamp(1.875rem, 4.5vw, 2.5rem)', lineHeight: '1.25', className: 'text-5xl',
  },
  {
    name: 'Heading 1', tag: 'text-4xl', size: 'clamp(1.625rem, 4vw, 2rem)', lineHeight: '1.3', className: 'text-4xl',
  },
  {
    name: 'Heading 2', tag: 'text-3xl', size: '1.5rem (24px)', lineHeight: '1.35', className: 'text-3xl',
  },
  {
    name: 'Heading 3', tag: 'text-2xl', size: '1.25rem (20px)', lineHeight: '1.4', className: 'text-2xl',
  },
  {
    name: 'Heading 4', tag: 'text-xl', size: '1.125rem (18px)', lineHeight: '1.45', className: 'text-xl',
  },
  {
    name: 'Body Large', tag: 'text-lg', size: '1rem (16px)', lineHeight: '1.5', className: 'text-lg',
  },
  {
    name: 'Body', tag: 'text-base', size: '0.875rem (14px)', lineHeight: '1.5', className: 'text-base',
  },
  {
    name: 'Body Small', tag: 'text-sm', size: '0.8125rem (13px)', lineHeight: '1.5', className: 'text-sm',
  },
  {
    name: 'Caption', tag: 'text-xs', size: '0.75rem (12px)', lineHeight: '1.5', className: 'text-xs',
  },
];

const fontFamilies = [
  {
    name: 'Inter', usage: 'Body, UI, Labels', token: '--font-sans', css: 'Inter, sans-serif', className: 'font-sans', sampleSize: 'text-base',
  },
  {
    name: 'Bricolage Grotesque', usage: 'Headings, Display, Titles', token: '--font-heading', css: 'Bricolage Grotesque, sans-serif', className: 'font-heading', sampleSize: 'text-xl',
  },
  {
    name: 'JetBrains Mono', usage: 'Code, Tokens, Technical', token: '--font-mono', css: 'JetBrains Mono, monospace', className: 'font-mono', sampleSize: 'text-sm',
  },
];

const SAMPLE = 'The quick brown fox jumps over the lazy dog 1234567890';

export default function TypographySection() {
  return (
    <section className="border-b py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Typography</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Using Inter for clean UI readability and Bricolage Grotesque for distinctive headings.
            Body set at 14px for a compact, information-dense layout.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="mb-6 font-heading text-xl font-semibold">Font Families</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {fontFamilies.map((font) => (
              <div key={font.name} className="rounded-xl border bg-card p-6">
                <div className="mb-4">
                  <p className="font-heading text-lg font-semibold">{font.name}</p>
                  <p className="text-sm text-muted-foreground">{font.usage}</p>
                </div>
                <div className="mb-4 space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">{font.token}</p>
                  <p className="font-mono text-xs text-muted-foreground">{font.css}</p>
                </div>
                <p className={cn(font.sampleSize, font.className)}>{SAMPLE}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 font-heading text-xl font-semibold">Type Scale</h3>
          <div className="space-y-6">
            {typeScale.map((type) => (
              <div
                key={type.name}
                className="flex flex-col gap-4 border-b pb-6 last:border-0 sm:flex-row sm:items-baseline"
              >
                <div className="w-36 shrink-0">
                  <p className="text-sm font-medium">{type.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{type.tag}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(type.className, 'truncate font-heading font-semibold')}>
                    ScopeWise Intelligent Analysis
                  </p>
                </div>
                <div className="w-56 shrink-0 text-right">
                  <p className="font-mono text-xs text-muted-foreground">{type.size}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    lh:
                    {type.lineHeight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
