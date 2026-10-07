import {
  Heart, ShoppingCart, User, ChevronRight,
} from 'lucide-react';
import Button from '../../ui/Button';
import PreviewCard from '../PreviewCard';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

export default function ButtonShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle title="Buttons" description="Six variants in five sizes" />
      <div className="space-y-6">
        <PreviewCard>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <CodeSnippet code={'<Button>Default</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="destructive">Destructive</Button>\n<Button variant="link">Link</Button>'} />
        </PreviewCard>

        <PreviewCard>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Favorite">
              <Heart />
            </Button>
          </div>
          <CodeSnippet code={'<Button size="xs">XSmall</Button>\n<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>\n<Button size="icon"><Heart /></Button>'} />
        </PreviewCard>

        <PreviewCard>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <ShoppingCart />
              Analyze Requirement
            </Button>
            <Button variant="secondary">
              Learn More
              <ChevronRight />
            </Button>
            <Button variant="outline" size="sm">
              <User />
              Profile
            </Button>
          </div>
          <CodeSnippet code={'<Button><ShoppingCart /> Analyze Requirement</Button>\n<Button variant="secondary">Learn More <ChevronRight /></Button>\n<Button variant="outline" size="sm"><User /> Profile</Button>'} />
        </PreviewCard>
      </div>
    </div>
  );
}
