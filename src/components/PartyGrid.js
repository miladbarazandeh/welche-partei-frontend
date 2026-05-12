import { useCountry, useI18n, usePartyHelpers } from '../context/AppContext';

export default function PartyGrid({ onGuess, result, disabled }) {
  const country = useCountry();
  const { t } = useI18n();
  const { partyLabel, partySlug } = usePartyHelpers();

  return (
    <div className={`party-grid${country.supportsSpectrum ? '' : ' party-grid--neutral'}`}>
      {country.supportsSpectrum ? (
        <>
          <span className="party-grid__label">{t('game.left')}</span>
          <span className="party-grid__label party-grid__label--right">{t('game.right')}</span>
        </>
      ) : (
        <span className="party-grid__label party-grid__label--full">{t('game.pickParty')}</span>
      )}
      {country.partyOrder.map((party) => {
        const slug = partySlug(party);
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
            {partyLabel(party)}
          </button>
        );
      })}
    </div>
  );
}
