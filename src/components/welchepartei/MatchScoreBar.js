export default function MatchScoreBar({ pct, koFail, lowCoverage }) {
  const fill = (koFail || lowCoverage) ? 0 : Math.round(pct);
  const colorClass = koFail
    ? 'wp-score-bar__fill--ko'
    : lowCoverage
    ? 'wp-score-bar__fill--unknown'
    : fill >= 70
    ? 'wp-score-bar__fill--high'
    : fill >= 40
    ? 'wp-score-bar__fill--mid'
    : 'wp-score-bar__fill--low';

  const label = lowCoverage ? 'Zu wenig Daten für einen Vergleich' : `${fill}% Übereinstimmung`;

  return (
    <div className="wp-score-bar" aria-label={label}>
      <div className={`wp-score-bar__fill ${colorClass}`} style={{ width: `${fill}%` }} />
    </div>
  );
}
