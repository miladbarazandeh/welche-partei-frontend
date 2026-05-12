import { useI18n } from '../context/AppContext';

function Row({ label, value, href, actionLabel }) {
  if (!value && !href) return null;
  return (
    <div className="attr-modal__row">
      <span className="attr-modal__label">{label}</span>
      <div className="attr-modal__value-wrap">
        {value && <span className="attr-modal__value">{value}</span>}
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="attr-modal__link">
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export default function AttributionModal({ politician, answered, onClose }) {
  const { t } = useI18n();

  return (
    <div className="support-overlay" onClick={onClose}>
      <div className="attr-modal" onClick={(e) => e.stopPropagation()}>
        <p className="attr-modal__heading">{t('politician.imageAttribution')}</p>

        {answered ? (
          <div className="attr-modal__body">
            <Row
              label={t('politician.author')}
              value={politician.author_name}
              href={politician.author_url}
              actionLabel={t('politician.open')}
            />
            <Row
              label={t('politician.license')}
              value={politician.license_short_name}
              href={politician.license_url}
              actionLabel={t('politician.open')}
            />
            <Row
              label={t('politician.sourceImage')}
              href={politician.image_page_url}
              actionLabel={t('politician.open')}
            />
          </div>
        ) : (
          <p className="attr-modal__locked">{t('politician.attributionLocked')}</p>
        )}

        <button className="attr-modal__close" onClick={onClose}>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
}
