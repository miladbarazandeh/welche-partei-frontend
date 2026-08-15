import { useEffect } from 'react';
import { useI18n } from '../../context/AppContext';

export default function SourceQuoteModal({ position, issue, party, onClose }) {
  const { locale, t } = useI18n();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Pick EN quote if locale=en and EN field is populated, otherwise fall back to DE
  const quoteText = locale === 'en'
    ? (position?.source_quote_en || position?.party_rationale_en || position?.source_quote || position?.party_rationale)
    : (position?.source_quote || position?.party_rationale);

  const hasSource = Boolean(quoteText);

  const positionLabel =
    position?.answer_slot === 0
      ? issue?.yes_label_de || t('wp.answer.yes')
      : position?.answer_slot === 1
      ? issue?.no_label_de || t('wp.answer.no')
      : issue?.neutral_label_de || t('wp.answer.neutralShort');

  return (
    <div className="wp-modal-backdrop" onClick={onClose}>
      <div className="wp-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="wp-modal__close" onClick={onClose} aria-label={t('wp.modal.close')}>×</button>

        <div className="wp-modal__header">
          <span
            className="wp-modal__party-dot"
            style={{ background: party?.color_hex || '#888' }}
          />
          <span className="wp-modal__party">{party?.short_name}</span>
          <span className="wp-modal__issue">{issue?.label_de}</span>
        </div>

        <div className="wp-modal__position">
          {t('wp.modal.position')}:{' '}
          <strong>{positionLabel}</strong>
        </div>

        {hasSource ? (
          <blockquote className="wp-modal__quote">{quoteText}</blockquote>
        ) : (
          <p className="wp-modal__no-source">{t('wp.modal.noSource')}</p>
        )}

        {position?.source_url && (
          <a
            href={position.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="wp-modal__source-link"
          >
            {t('wp.modal.openSource')}
          </a>
        )}
      </div>
    </div>
  );
}
