import { useI18n } from '../context/AppContext';

const BMC_URL = 'https://buymeacoffee.com/welche.partei';

export default function SupportModal({ onClose }) {
  const { t } = useI18n();

  const handleSupport = () => {
    window.open(BMC_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="support-overlay" onClick={onClose}>
      <div className="support-modal" onClick={e => e.stopPropagation()}>
        <div className="support-modal__icon">☕</div>
        <h2 className="support-modal__title">{t('support.title')}</h2>
        <p className="support-modal__text">{t('support.text')}</p>
        <div className="support-modal__actions">
          <button className="support-modal__btn support-modal__btn--primary" onClick={handleSupport}>
            {t('support.cta')} ☕
          </button>
          <button className="support-modal__btn support-modal__btn--secondary" onClick={onClose}>
            {t('support.later')}
          </button>
        </div>
      </div>
    </div>
  );
}
