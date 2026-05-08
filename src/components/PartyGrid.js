const PARTY_SLUG = {
  'SPD': 'spd',
  'CDU/CSU': 'cducsu',
  'Grüne': 'gruene',
  'AfD': 'afd',
  'Die Linke': 'linke',
  'FDP': 'fdp',
};

const PARTIES = ['SPD', 'CDU/CSU', 'Grüne', 'AfD', 'Die Linke', 'FDP'];

export default function PartyGrid({ onGuess, result, disabled }) {
  return (
    <div className="party-grid">
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
