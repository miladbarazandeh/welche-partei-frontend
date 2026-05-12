import { useEffect, useState } from 'react';
import { useI18n } from '../context/AppContext';

const CONSENT_KEY = 'ga_consent';

export default function ConsentModal() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <div className="consent-modal__icon">🍪</div>
        <h2 className="consent-modal__title">{t('cookies.title')}</h2>
        <p className="consent-modal__text">{t('cookies.text')}</p>
        <div className="consent-modal__actions">
          <button className="consent-modal__btn consent-modal__btn--accept" onClick={accept}>
            {t('cookies.accept')}
          </button>
          <button className="consent-modal__btn consent-modal__btn--decline" onClick={decline}>
            {t('cookies.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
