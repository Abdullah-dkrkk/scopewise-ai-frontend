import PropTypes from 'prop-types';

export default function CodeSnippet({ code }) {
  return (
    <div className="mt-4 rounded-lg bg-muted p-3">
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">{code}</pre>
    </div>
  );
}

CodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
};
