import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';

export default function BlindQuestionCard({ issue }) {
  const { blindAnswers, weights, setBlindAnswer, setWeight, nextStep, prevStep } = useWelchePartei();
  const { locale, t } = useI18n();
  const key = issue.question_key;
  const selected = blindAnswers[key];
  const weight = weights[key] ?? 1;

  function choose(slot) {
    setBlindAnswer(key, slot);
  }

  const weightOptions = [
    { value: 0, label: t('wp.weight.0') },
    { value: 1, label: t('wp.weight.1') },
    { value: 2, label: t('wp.weight.2') },
    { value: 3, label: t('wp.weight.3') },
  ];

  const isEn = locale === 'en';
  const answers = [
    { slot: 0, label: (isEn ? issue.yes_label_en : '') || issue.yes_label_de || t('wp.answer.yes') },
    { slot: 1, label: (isEn ? issue.no_label_en : '') || issue.no_label_de || t('wp.answer.no') },
    { slot: 2, label: (isEn ? issue.neutral_label_en : '') || issue.neutral_label_de || t('wp.answer.neutral') },
  ];

  const cardLabel    = (isEn ? issue.label_en : '') || issue.label_de;
  const questionText = (isEn ? issue.question_text_en : '') || issue.question_text_de;

  return (
    <div className="wp-card wp-card--blind">
      <div className="wp-card__tag">{cardLabel}</div>

      <div className="wp-card__body">
        <div className="wp-card__left">
          <h2 className="wp-card__question">{questionText}</h2>
        </div>

        <div className="wp-choices">
          {answers.map(({ slot, label }) => (
            <button
              key={slot}
              className={`wp-choice wp-choice--slot-${slot} ${selected === slot ? 'wp-choice--selected' : ''}`}
              onClick={() => choose(slot)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {selected != null && (
        <div className="wp-weight">
          <span className="wp-weight__label">{t('wp.weight.label')}</span>
          <div className="wp-weight__options">
            {weightOptions.map((w) => (
              <button
                key={w.value}
                className={`wp-weight__btn ${weight === w.value ? 'wp-weight__btn--active' : ''}`}
                onClick={() => setWeight(key, w.value)}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="wp-card__nav">
        <button className="wp-btn wp-btn--ghost" onClick={prevStep}>{t('wp.card.back')}</button>
        {selected != null && (
          <button className="wp-btn wp-btn--primary" onClick={nextStep}>{t('wp.card.next')}</button>
        )}
        {selected == null && (
          <button className="wp-btn wp-btn--ghost" onClick={nextStep}>{t('wp.card.skip')}</button>
        )}
      </div>
    </div>
  );
}
