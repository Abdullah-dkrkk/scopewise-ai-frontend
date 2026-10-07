import { User } from 'lucide-react';
import Separator from '../../ui/Separator';
import Avatar from '../../ui/Avatar';
import Spinner from '../../ui/Spinner';
import Alert from '../../ui/Alert';
import Tooltip from '../../ui/Tooltip';
import Button from '../../ui/Button';
import PreviewCard from '../PreviewCard';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

export default function MiscShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle title="Separator, Avatars, Alerts & More" />

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <PreviewCard>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Horizontal separator between content</p>
            <Separator />
            <p className="text-sm text-muted-foreground">This content is below the separator</p>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <p className="text-sm">Left</p>
            <Separator orientation="vertical" className="h-8" />
            <p className="text-sm">Center</p>
            <Separator orientation="vertical" className="h-8" />
            <p className="text-sm">Right</p>
          </div>
          <CodeSnippet code={'<Separator />\n<Separator orientation="vertical" className="h-8" />'} />
        </PreviewCard>

        <PreviewCard>
          <div className="mb-4 flex items-center gap-4">
            <Avatar>
              <div className="flex size-full items-center justify-center bg-brand-blue text-sm font-medium text-white">JD</div>
            </Avatar>
            <Avatar className="size-10">
              <div className="flex size-full items-center justify-center bg-brand-orange text-sm font-medium text-white">SK</div>
            </Avatar>
            <Avatar className="size-12">
              <div className="flex size-full items-center justify-center bg-muted text-base font-medium text-muted-foreground">
                <User />
              </div>
            </Avatar>
          </div>
          <CodeSnippet code={'<Avatar>\n  <div className="bg-brand-blue text-white">JD</div>\n</Avatar>'} />
        </PreviewCard>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <PreviewCard>
          <div className="flex flex-wrap items-center gap-4">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Tooltip label="Analyze requirement">
              <Button variant="outline" size="sm">Hover me</Button>
            </Tooltip>
          </div>
          <CodeSnippet code={'<Spinner size="md" />\n<Tooltip label="Analyze requirement">\n  <Button variant="outline">Hover me</Button>\n</Tooltip>'} />
        </PreviewCard>

        <PreviewCard>
          <div className="space-y-3">
            <Alert title="Analysis complete" variant="success">Requirement classified with 92% confidence.</Alert>
            <Alert title="Missing details" variant="warning">Two clarifying questions were generated.</Alert>
            <Alert title="Unexpected scope" variant="error">Complexity exceeds the project threshold.</Alert>
          </div>
          <CodeSnippet code={'<Alert title="Analysis complete" variant="success">...</Alert>\n<Alert title="Missing details" variant="warning">...</Alert>'} />
        </PreviewCard>
      </div>
    </div>
  );
}
