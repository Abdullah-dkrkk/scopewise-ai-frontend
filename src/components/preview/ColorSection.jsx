import PropTypes from 'prop-types';
import cn from '../../utils/cn';

const brandColors = [
  {
    name: 'Brand Blue', token: 'brand-blue', value: '#2563eb', light: false,
  },
  {
    name: 'Brand Blue Light', token: 'brand-blue-light', value: '#eff6ff', light: true,
  },
  {
    name: 'Brand Blue Dark', token: 'brand-blue-dark', value: '#1e40af', light: false,
  },
  {
    name: 'Brand Orange', token: 'brand-orange', value: '#f97316', light: false,
  },
  {
    name: 'Brand Orange Light', token: 'brand-orange-light', value: '#fff7ed', light: true,
  },
  {
    name: 'Brand Orange Dark', token: 'brand-orange-dark', value: '#c2410c', light: false,
  },
];

const semanticColors = [
  {
    name: 'Background', token: 'background', value: '#ffffff', light: true,
  },
  {
    name: 'Foreground', token: 'foreground', value: '#0c1222', light: false,
  },
  {
    name: 'Card', token: 'card', value: '#ffffff', light: true,
  },
  {
    name: 'Card Foreground', token: 'card-foreground', value: '#0c1222', light: false,
  },
  {
    name: 'Primary', token: 'primary', value: '#2563eb', light: false,
  },
  {
    name: 'Primary Foreground', token: 'primary-foreground', value: '#ffffff', light: true,
  },
  {
    name: 'Secondary', token: 'secondary', value: '#f1f5f9', light: true,
  },
  {
    name: 'Secondary Foreground', token: 'secondary-foreground', value: '#1e293b', light: false,
  },
  {
    name: 'Muted', token: 'muted', value: '#f8fafc', light: true,
  },
  {
    name: 'Muted Foreground', token: 'muted-foreground', value: '#64748b', light: false,
  },
  {
    name: 'Accent', token: 'accent', value: '#fff7ed', light: true,
  },
  {
    name: 'Accent Foreground', token: 'accent-foreground', value: '#c2410c', light: false,
  },
  {
    name: 'Border', token: 'border', value: '#e2e8f0', light: true,
  },
  {
    name: 'Input', token: 'input', value: '#e2e8f0', light: true,
  },
  {
    name: 'Ring', token: 'ring', value: '#2563eb', light: false,
  },
  {
    name: 'Destructive', token: 'destructive', value: '#ef4444', light: false,
  },
];

function Swatch({
  name, token, value, light,
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn('h-20 w-full rounded-lg', light && 'border flex items-end p-2')}
        style={{ backgroundColor: value }}
      >
        {light && (
          <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">
          --
          {token}
        </p>
        <p className="font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

Swatch.propTypes = {
  name: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  light: PropTypes.bool,
};

export default function ColorSection() {
  return (
    <section className="border-b py-section">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Colors</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            A balanced palette combining confident blue and warm orange tones for a professional,
            intelligence-driven scoping experience.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="mb-6 font-heading text-xl font-semibold">Brand Colors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {brandColors.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 font-heading text-xl font-semibold">Semantic Colors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {semanticColors.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
