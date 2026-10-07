import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ArrowLeft, Lightbulb, MessageSquareText,
} from 'lucide-react';
import {
  analysisApi, requirementsApi, getRiskLevel, toMessage,
} from '../api';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import ClassificationBadge from '../components/features/analysis/ClassificationBadge';
import RiskAssessment from '../components/features/analysis/RiskAssessment';
import ComplexityScore from '../components/features/analysis/ComplexityScore';
import EstimationPanel from '../components/features/analysis/EstimationPanel';
import ScoresChart from '../components/charts/ScoresChart';
import QuestionList from '../components/features/questions/QuestionList';
import { formatRelative } from '../utils/format';

function SummaryCards({ analysis }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ComplexityScore score={analysis.complexity} label="Complexity" />
      <RiskAssessment
        level={analysis.riskLevel}
        score={analysis.risk}
        details="Combined risk from ambiguity, integrations, and missing details."
      />
      <EstimationPanel
        effort={analysis.estimation.effort}
        cost={analysis.estimation.cost}
        timeline={analysis.estimation.timeline}
        confidence={analysis.confidence}
      />
    </div>
  );
}

SummaryCards.propTypes = { analysis: PropTypes.object.isRequired };

function Insights({ analysis }) {
  const hasMissing = analysis.missingInfo.length > 0;
  const hasKeywords = analysis.keywords.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scoring overview</CardTitle>
          <CardDescription>
            Confidence, complexity, and risk at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-[240px]">
            <ScoresChart
              confidence={analysis.confidence}
              complexity={analysis.complexity}
              risk={analysis.risk}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendations</CardTitle>
          <CardDescription>
            Gaps and hints to strengthen the requirement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasMissing && !hasKeywords && (
            <p className="text-sm text-muted-foreground">
              No gaps were flagged for this requirement.
            </p>
          )}

          {hasMissing && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Missing information
              </p>
              <ul className="space-y-2">
                {analysis.missingInfo.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">
                      !
                    </span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasKeywords && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Key terms detected
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="max-w-full break-words rounded-full bg-muted px-2.5 py-1 font-mono text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

Insights.propTypes = { analysis: PropTypes.object.isRequired };

export default function AnalysisResults() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [requirementText, setRequirementText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    analysisApi
      .getAnalysis(id)
      .then(async (result) => {
        if (!active) return;
        setAnalysis(result);

        // Requirement text is a nice-to-have; a failure here must not blank
        // the whole results page.
        if (result.requirementId) {
          try {
            const requirement = await requirementsApi.getRequirement(result.requirementId);
            if (active) setRequirementText(requirement.text);
          } catch {
            if (active) setRequirementText('');
          }
        }
      })
      .catch((err) => {
        if (active) setError(toMessage(err, 'Could not load this analysis.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  if (error || !analysis) {
    return (
      <div className="py-16 text-center">
        <Alert variant="error" title="Analysis unavailable">
          {error || 'This analysis does not exist.'}
        </Alert>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
            Try again
          </Button>
          <Link to="/app/analyze" className="text-sm font-medium text-primary hover:underline">
            Start a new analysis
          </Link>
        </div>
      </div>
    );
  }

  const answeredCount = analysis.questions.filter((q) => q.status === 'answered').length;
  const risk = getRiskLevel(analysis.riskLevel);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to="/app/history"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to history
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <ClassificationBadge type={analysis.classification} />
            <span className="text-xs text-muted-foreground">
              Analyzed
              {formatRelative(analysis.createdAt)}
            </span>
          </div>
          <h1 className="mt-2 break-words font-heading text-2xl font-semibold tracking-tight">
            Analysis results
          </h1>
          {analysis.projectName && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {analysis.projectName}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-xl border bg-card px-4 py-3 text-center">
          <p className="font-heading text-3xl font-semibold text-primary">
            {analysis.confidence > 0 ? analysis.confidence : '—'}
            {analysis.confidence > 0 && '%'}
          </p>
          <p className="text-xs text-muted-foreground">Confidence</p>
        </div>
      </div>

      {requirementText && (
        <div className="mb-6 rounded-xl border bg-muted/40 p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MessageSquareText className="size-3.5 shrink-0" />
            Analyzed requirement
          </p>
          <p className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed">
            {requirementText}
          </p>
        </div>
      )}

      {analysis.summary && (
        <Card className="mb-6">
          <CardContent className="break-words py-4 text-sm leading-relaxed text-muted-foreground">
            {analysis.summary}
          </CardContent>
        </Card>
      )}

      <SummaryCards analysis={analysis} />
      <div className="mt-6"><Insights analysis={analysis} /></div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Lightbulb className="size-3.5 shrink-0" />
        <span className="min-w-0 break-words">
          {answeredCount}
          {' of '}
          {analysis.questions.length}
          {' questions answered — each answer can raise confidence.'}
        </span>
      </div>

      {analysis.riskLevel === 'critical' && (
        <Alert variant="error" title="Critical risk">
          This requirement scored critical on risk. Review the risk factors before
          committing to a delivery date.
        </Alert>
      )}

      <div className="mt-3">
        <QuestionList
          questions={analysis.questions}
          analysisId={analysis.id}
          onAnswered={setAnalysis}
          riskLevel={risk.key}
        />
      </div>
    </div>
  );
}
