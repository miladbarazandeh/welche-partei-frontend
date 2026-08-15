export default function MatchScoreBar({ pct, koFail }) {
  const fill = koFail ? 0 : Math.round(pct);
  const colorClass = koFail
    ? 'wp-score-bar__fill--ko'
    : fill >= 70
    ? 'wp-score-bar__fill--high'
    : fill >= 40
    ? 'wp-score-bar__fill--mid'
    : 'wp-score-bar__fill--low';

  return (
    <div className="wp-score-bar" aria-label={`${fill}% Übereinstimmung`}>
      <div className={`wp-score-bar__fill ${colorClass}`} style={{ width: `${fill}%` }} />
    </div>
  );
}
