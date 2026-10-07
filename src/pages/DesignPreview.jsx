import PreviewHeader from '../components/preview/PreviewHeader';
import DesignHero from '../components/preview/DesignHero';
import ColorSection from '../components/preview/ColorSection';
import TypographySection from '../components/preview/TypographySection';
import SpacingSection from '../components/preview/SpacingSection';
import ShadowSection from '../components/preview/ShadowSection';
import RadiusSection from '../components/preview/RadiusSection';
import ComponentShowcase from '../components/preview/ComponentShowcase';

export default function DesignPreview() {
  return (
    <div className="flex min-h-screen flex-col">
      <PreviewHeader />
      <DesignHero />
      <ColorSection />
      <TypographySection />
      <SpacingSection />
      <ShadowSection />
      <RadiusSection />
      <ComponentShowcase />
    </div>
  );
}
