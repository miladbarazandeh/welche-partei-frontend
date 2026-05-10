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
        <h2 className="consent-modal__title">Datenschutz & Cookies</h2>
        <p className="consent-modal__text">
          Wir nutzen <strong>Google Analytics</strong>, um zu verstehen, wie die App genutzt wird – anonym und ohne persönliche Daten.
          Deine Einwilligung ist freiwillig und kann jederzeit widerrufen werden.
        </p>
        <div className="consent-modal__actions">
          <button className="consent-modal__btn consent-modal__btn--accept" onClick={accept}>
            Akzeptieren
          </button>
          <button className="consent-modal__btn consent-modal__btn--decline" onClick={decline}>
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}
