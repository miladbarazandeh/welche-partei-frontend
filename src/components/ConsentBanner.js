import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ga_consent';

export default function ConsentModal() {
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
        <h2 className="consent-modal__title">Cookie-Einstellungen</h2>
        <p className="consent-modal__text">
          Wir verwenden notwendige Cookies, damit die App funktioniert. Mit deiner Zustimmung setzen wir zusätzlich Analyse-Cookies (Google Analytics) ein, um das Erlebnis zu verbessern.
        </p>
        <div className="consent-modal__actions">
          <button className="consent-modal__btn consent-modal__btn--accept" onClick={accept}>
            Alle akzeptieren
          </button>
          <button className="consent-modal__btn consent-modal__btn--decline" onClick={decline}>
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
