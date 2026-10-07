import PropTypes from 'prop-types';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../../ui/Card';
import QuestionCard from './QuestionCard';

export default function QuestionList({
  questions, analysisId, onAnswered, riskLevel,
}) {
  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm font-medium">No clarifying questions</p>
          <p className="mx-auto mt-1 max-w-sm break-words text-sm text-muted-foreground">
            {riskLevel === 'low'
              ? 'This requirement scored low risk, so there is nothing to clarify.'
              : 'The analysis did not produce any follow-up questions for this requirement.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Clarifying questions</CardTitle>
        <CardDescription>
          Answer these to raise confidence and tighten the estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              analysisId={analysisId}
              onAnswered={onAnswered}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  analysisId: PropTypes.string.isRequired,
  onAnswered: PropTypes.func.isRequired,
  riskLevel: PropTypes.string,
};
