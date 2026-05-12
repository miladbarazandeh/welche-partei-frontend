import { useI18n, usePartyHelpers } from '../context/AppContext';

export default function GuessHistory({ history }) {
  const { t } = useI18n();
  const { partyLabel, partySlug } = usePartyHelpers();

  if (!history.length) return null;

  return (
    <div className="history">
      <p className="history__heading">{t('game.history')}</p>
      <ul className="history__list">
        {history.map((item, i) => (
          <li key={i} className="history-item">
            <span className={`history-item__indicator history-item__indicator--${item.correct ? 'correct' : 'wrong'}`} />
            <span className="history-item__name">{item.politician_name}</span>
            <div className="history-item__tags">
              {!item.correct && (
                <>
                  <span className={`party-tag party-tag--${partySlug(item.guessed_party) || ''}`}>
                    {partyLabel(item.guessed_party)}
                  </span>
                  <span className="history-item__arrow">→</span>
                </>
              )}
              <span className={`party-tag party-tag--${partySlug(item.correct_party) || ''}`}>
                {partyLabel(item.correct_party)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
