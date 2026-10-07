import PropTypes from 'prop-types';
import { FileText } from 'lucide-react';
import Button from '../../ui/Button';
import RequirementCard from './RequirementCard';

export default function RequirementList({ requirements, onAnalyze }) {
  if (requirements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">No requirements yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Analyze a requirement for this project and it will appear here.
        </p>
        {onAnalyze && (
          <Button className="mt-4" onClick={onAnalyze}>
            Analyze requirement
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {requirements.map((req) => (
        <RequirementCard key={req.id} requirement={req} />
      ))}
    </ul>
  );
}

RequirementList.propTypes = {
  requirements: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAnalyze: PropTypes.func,
};
