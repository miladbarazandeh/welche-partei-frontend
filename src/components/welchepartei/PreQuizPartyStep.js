import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';
import PartyPicker from './PartyPicker';

export default function PreQuizPartyStep() {
  const { data, preQuizParty, setPreQuizParty, nextStep } = useWelchePartei();
  const { t } = useI18n();

  return (
    <div className="wp-party-step">
      <div className="wp-party-step__header">
        <span className="wp-party-step__eyebrow">
          {t('wp.preVote.eyebrow')}
        </span>
        <h2 className="wp-party-step__title">
          {t('wp.preVote.title')}
        </h2>
        <p className="wp-party-step__sub">
          {t('wp.preVote.subtitle')}
        </p>
      </div>

      <PartyPicker
        parties={data?.parties || []}
        selected={preQuizParty}
        onSelect={setPreQuizParty}
      />

      <div className="wp-party-step__actions">
        <button className="wp-btn wp-btn--primary" onClick={nextStep}>
          {preQuizParty ? t('wp.preVote.continue') : t('wp.preVote.skip')}
        </button>
      </div>
    </div>
  );
}
