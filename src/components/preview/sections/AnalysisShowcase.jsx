import {
  Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ClassificationBadge from '../../features/analysis/ClassificationBadge';
import RiskAssessment from '../../features/analysis/RiskAssessment';
import ComplexityScore from '../../features/analysis/ComplexityScore';
import EstimationPanel from '../../features/analysis/EstimationPanel';
import SectionTitle from '../SectionTitle';
import CodeSnippet from '../CodeSnippet';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const chartData = {
  labels: ['Functional', 'Technical', 'Non-Functional'],
  datasets: [
    {
      data: [58, 27, 15],
      backgroundColor: ['#2563eb', '#f97316', '#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
};

export default function AnalysisShowcase() {
  return (
    <div className="mb-16">
      <SectionTitle
        title="ScopeWise Analysis Components"
        description="Domain-specific components used across analysis results and dashboard pages"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <p className="mb-4 text-sm font-medium">Classification Badges</p>
          <div className="flex flex-wrap items-center gap-3">
            <ClassificationBadge type="functional" />
            <ClassificationBadge type="technical" />
            <ClassificationBadge type="non-functional" />
          </div>
          <CodeSnippet code={'<ClassificationBadge type="functional" />\n<ClassificationBadge type="technical" />\n<ClassificationBadge type="non-functional" />'} />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="mb-4 text-sm font-medium">Requirement Distribution</p>
          <div className="mx-auto max-w-[220px]">
            <Doughnut data={chartData} />
          </div>
          <CodeSnippet code="<Doughnut data={{ labels, datasets }} />" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <RiskAssessment level="high" score={78} details="Integrations with 4 third-party APIs and legacy data migration." />
        <ComplexityScore score={64} label="Complexity" />
        <EstimationPanel effort="34 PD" cost="$18,400" timeline="6 weeks" />
      </div>
    </div>
  );
}
