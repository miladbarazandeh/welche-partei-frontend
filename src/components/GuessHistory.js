const PARTY_SLUG = {
  'SPD': 'spd',
  'CDU/CSU': 'cducsu',
  'Grüne': 'gruene',
  'AfD': 'afd',
  'Die Linke': 'linke',
  'FDP': 'fdp',
};

export default function GuessHistory({ history }) {
  if (!history.length) return null;

  return (
    <div className="history">
      <p className="history__heading">Letzte Antworten</p>
      <ul className="history__list">
        {history.map((item, i) => (
          <li key={i} className="history-item">
            <span className={`history-item__indicator history-item__indicator--${item.correct ? 'correct' : 'wrong'}`} />
            <span className="history-item__name">{item.politician_name}</span>
            <div className="history-item__tags">
              {!item.correct && (
                <>
                  <span className={`party-tag party-tag--${PARTY_SLUG[item.guessed_party] || ''}`}>
                    {item.guessed_party}
                  </span>
                  <span className="history-item__arrow">→</span>
                </>
              )}
              <span className={`party-tag party-tag--${PARTY_SLUG[item.correct_party] || ''}`}>
                {item.correct_party}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
