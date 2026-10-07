import { Star } from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Card, {
  CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '../../ui/Card';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

export default function CardShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle title="Cards" description="Flexible card with header, content, and footer" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Card</CardTitle>
            <CardDescription>Functional requirement detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">92% confidence</span>
            </div>
            <p className="text-2xl font-bold">Low</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button size="sm" variant="outline">Details</Button>
            <Button size="sm">View Analysis</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="warning" className="w-fit">Clarify</Badge>
            <CardTitle>Open Question</CardTitle>
            <CardDescription>Missing constraints detected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The requirement does not define performance targets. Ask the stakeholder for expected
              response times and concurrent users.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Draft Follow-up</Button>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Compact Card</CardTitle>
            <CardDescription>Small variant for tight spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Perfect for grids and sidebars.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full">Action</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="mt-4">
        <CodeSnippet code={'<Card>\n  <CardHeader><CardTitle>Title</CardTitle><CardDescription>Desc</CardDescription></CardHeader>\n  <CardContent>Content</CardContent>\n  <CardFooter>Footer</CardFooter>\n</Card>'} />
      </div>
    </div>
  );
}
