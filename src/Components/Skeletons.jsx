export function ProfileSkeleton({ label }) {
  return (
    <div className="skeleton-profile" role="status" aria-label={`Loading ${label} profile`}>
      <span className="skeleton skeleton-avatar" aria-hidden="true" />
      <span>
        <span className="skeleton skeleton-line skeleton-line--short" aria-hidden="true" />
        <span className="skeleton skeleton-line skeleton-line--heading" aria-hidden="true" />
        <span className="skeleton skeleton-line skeleton-line--short" aria-hidden="true" />
      </span>
      <span className="skeleton-stats" aria-hidden="true">
        <span className="skeleton skeleton-stat" />
      </span>
      <span className="visually-hidden">Loading {label} profile.</span>
    </div>
  );
}

export function ChartSkeleton({ label }) {
  return (
    <div className="skeleton-chart" role="status" aria-label={`Loading ${label}`}>
      <span className="visually-hidden">Loading {label}.</span>
      {Array.from({ length: 5 }, (_, index) => <span key={index} className="skeleton skeleton-chart-line" aria-hidden="true" />)}
    </div>
  );
}
