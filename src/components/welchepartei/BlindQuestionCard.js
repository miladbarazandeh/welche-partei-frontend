import { useState } from 'react';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';
import SourceQuoteModal from './SourceQuoteModal';

export default function BlindQuestionCard({ issue }) {
  const { data, blindAnswers, weights, setBlindAnswer, setWeight, nextStep, prevStep } = useWelchePartei();
  const { locale, t } = useI18n();
  const [showPositions, setShowPositions] = useState(false);
  const [quoteModal, setQuoteModal] = useState(null);
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

  function answerLabel(slot, neutralFallback = t('wp.answer.neutral')) {
    return slot === 0
      ? (isEn ? issue.yes_label_en : '') || issue.yes_label_de || t('wp.answer.yes')
      : slot === 1
      ? (isEn ? issue.no_label_en : '') || issue.no_label_de || t('wp.answer.no')
      : (isEn ? issue.neutral_label_en : '') || issue.neutral_label_de || neutralFallback;
  }

  const answers = [
    { slot: 0, label: answerLabel(0) },
    { slot: 1, label: answerLabel(1) },
    { slot: 2, label: answerLabel(2) },
  ];

  const cardLabel    = (isEn ? issue.label_en : '') || issue.label_de;
  const questionText = (isEn ? issue.question_text_en : '') || issue.question_text_de;

  const issuePositions = data
    ? data.positions
        .filter((p) => p.issue_id === issue.id)
        .map((position) => ({ position, party: data.parties.find((party) => party.id === position.party_id) }))
        .filter((entry) => entry.party)
    : [];

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
        <div className="wp-card__nav-right">
          {selected != null && issuePositions.length > 0 && (
            <button
              type="button"
              className="wp-btn wp-positions__toggle"
              onClick={() => setShowPositions((v) => !v)}
              aria-expanded={showPositions}
            >
              {showPositions ? t('wp.blind.hidePositions') : t('wp.blind.showPositions')}
            </button>
          )}
          {selected != null && (
            <button className="wp-btn wp-btn--primary" onClick={nextStep}>{t('wp.card.next')}</button>
          )}
          {selected == null && (
            <button className="wp-btn wp-btn--ghost" onClick={nextStep}>{t('wp.card.skip')}</button>
          )}
        </div>
      </div>

      {selected != null && showPositions && issuePositions.length > 0 && (
        <div className="wp-positions__list">
          <p className="wp-positions__hint">{t('wp.blind.positionsHint')}</p>
          {issuePositions.map(({ position, party }) => {
            const slotName = position.answer_slot === 0 ? 'yes' : position.answer_slot === 1 ? 'no' : 'neutral';
            return (
              <button
                key={party.id}
                type="button"
                className={`wp-position-row wp-position-row--${slotName}`}
                onClick={() => setQuoteModal({ position, issue, party })}
              >
                <span className="wp-position-row__dot" style={{ background: party.color_hex || '#888' }} />
                <span className="wp-position-row__name">{party.short_name}</span>
                <span className="wp-position-row__badge">{answerLabel(position.answer_slot, t('wp.answer.neutralShort'))}</span>
                <span className="wp-position-row__chevron" aria-hidden="true">›</span>
              </button>
            );
          })}
        </div>
      )}

      {quoteModal && (
        <SourceQuoteModal
          position={quoteModal.position}
          issue={quoteModal.issue}
          party={quoteModal.party}
          onClose={() => setQuoteModal(null)}
        />
      )}
    </div>
  );
}
