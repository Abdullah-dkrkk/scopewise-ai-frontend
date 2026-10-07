import PropTypes from 'prop-types';

export default function SectionTitle({ title, description }) {
  return (
    <div className="mb-8">
      <h3 className="font-heading text-2xl font-semibold tracking-tight">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
