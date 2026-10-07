import { Bell } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import PreviewCard from '../PreviewCard';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

export default function BadgeShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle title="Badges" />
      <div className="grid gap-6 md:grid-cols-2">
        <PreviewCard>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Over Budget</Badge>
          </div>
          <CodeSnippet code={'<Badge>Default</Badge>\n<Badge variant="secondary">Secondary</Badge>\n<Badge variant="outline">Outline</Badge>\n<Badge variant="destructive">Over Budget</Badge>'} />
        </PreviewCard>

        <PreviewCard>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand">AI Analyzed</Badge>
            <Badge variant="warning">Clarify Needed</Badge>
            <Badge variant="success">Scoped</Badge>
            <Badge className="bg-brand-blue-light text-brand-blue-dark border border-brand-blue/30">
              In Progress
            </Badge>
            <div className="relative inline-flex">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell />
              </Button>
              <Badge className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0">
                3
              </Badge>
            </div>
          </div>
          <CodeSnippet code={'<Badge variant="brand">AI Analyzed</Badge>\n<Badge variant="warning">Clarify Needed</Badge>\n<Badge variant="success">Scoped</Badge>'} />
        </PreviewCard>
      </div>
    </div>
  );
}
