import { Star } from 'lucide-react';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Separator from '../../ui/Separator';
import ClassificationBadge from '../../features/analysis/ClassificationBadge';
import ComplexityScore from '../../features/analysis/ComplexityScore';
import SectionTitle from '../SectionTitle';

export default function CompositionShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle
        title="Composition Example"
        description="Real-world combination of components on a requirement detail card"
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="success">AI Analyzed</Badge>
                <ClassificationBadge type="functional" />
              </div>
              <CardTitle>User Authentication &amp; SSO</CardTitle>
              <CardDescription>
                Users must be able to sign in with email/password or a corporate identity provider.
              </CardDescription>
            </div>
            <Avatar className="size-12">
              <div className="flex size-full items-center justify-center bg-brand-blue font-medium text-white">SW</div>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1 text-sm font-medium">4.9</span>
            <span className="text-sm text-muted-foreground">(128 analyses)</span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Includes password reset, account lockout, session management, and multi-factor
            authentication. Clarify whether SAML or OIDC is preferred for SSO.
          </p>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ComplexityScore score={42} label="Complexity" />
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">View Analysis</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
