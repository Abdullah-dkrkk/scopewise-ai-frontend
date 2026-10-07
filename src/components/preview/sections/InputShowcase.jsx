import { Search } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import PreviewCard from '../PreviewCard';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

export default function InputShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle title="Inputs" />
      <div className="grid gap-6 md:grid-cols-2">
        <PreviewCard>
          <div className="space-y-4">
            <div>
              <label htmlFor="preview-email" className="mb-1.5 block text-sm font-medium">Default</label>
              <Input id="preview-email" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="preview-search" className="mb-1.5 block text-sm font-medium">With Icon</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="preview-search" placeholder="Search requirements..." className="pl-9" />
              </div>
            </div>
          </div>
          <CodeSnippet code={'<Input placeholder="Enter your email" />\n<div className="relative">\n  <Search className="absolute left-3 top-1/2 size-4" />\n  <Input placeholder="Search..." className="pl-9" />\n</div>'} />
        </PreviewCard>

        <PreviewCard>
          <div className="space-y-4">
            <div>
              <label htmlFor="preview-combo" className="mb-1.5 block text-sm font-medium">With Button</label>
              <div className="flex gap-2">
                <Input id="preview-combo" placeholder="Paste requirement text" />
                <Button>Analyze</Button>
              </div>
            </div>
            <div>
              <label htmlFor="preview-disabled" className="mb-1.5 block text-sm font-medium">Disabled</label>
              <Input id="preview-disabled" placeholder="Disabled input" disabled />
            </div>
          </div>
          <CodeSnippet code={'<div className="flex gap-2">\n  <Input placeholder="Paste requirement text" />\n  <Button>Analyze</Button>\n</div>\n<Input placeholder="Disabled input" disabled />'} />
        </PreviewCard>
      </div>
    </div>
  );
}
