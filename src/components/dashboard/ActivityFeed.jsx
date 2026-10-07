import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/Card';
import Spinner from '../ui/Spinner';
import { formatRelative } from '../../utils/format';

function ActivityBody({ activity, loading }) {
  if (loading) {
    return <div className="flex justify-center py-8"><Spinner /></div>;
  }
  if (activity.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet — run your first analysis to get started.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {activity.slice(0, 6).map((item) => (
        <li key={item.id} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Activity className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm">{item.text}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelative(item.at)}
              {item.project ? ` · ${item.project}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

ActivityBody.propTypes = {
  activity: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function ActivityFeed({ activity, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent activity</CardTitle>
        <CardDescription>Latest changes across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityBody activity={activity} loading={loading} />
      </CardContent>
    </Card>
  );
}

ActivityFeed.propTypes = {
  activity: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};
