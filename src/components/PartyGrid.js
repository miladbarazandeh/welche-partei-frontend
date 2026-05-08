const PARTY_SLUG = {
  'SPD': 'spd',
  'CDU/CSU': 'cducsu',
  'Grüne': 'gruene',
  'AfD': 'afd',
  'Die Linke': 'linke',
  'FDP': 'fdp',
};

// Left parties in left column, right parties in right column (paired by row)
const PARTIES = ['SPD', 'CDU/CSU', 'Grüne', 'FDP', 'Die Linke', 'AfD'];

export default function PartyGrid({ onGuess, result, disabled }) {
  return (
    <div className="party-grid">
      <span className="party-grid__label">← Links</span>
      <span className="party-grid__label party-grid__label--right">Rechts →</span>
      {PARTIES.map((party) => {
        const slug = PARTY_SLUG[party];
        let stateClass = '';

        if (result) {
          if (party === result.correct_party) {
            stateClass = 'party-btn--correct';
          } else if (party === result.guessed_party && !result.correct) {
            stateClass = 'party-btn--wrong-guess';
          } else {
            stateClass = 'party-btn--idle';
          }
        }

        return (
          <button
            key={party}
            className={`party-btn party-btn--${slug} ${stateClass}`}
            onClick={() => !disabled && onGuess(party)}
            disabled={disabled}
          >
            {party}
          </button>
        );
      })}
    </div>
  );
}
