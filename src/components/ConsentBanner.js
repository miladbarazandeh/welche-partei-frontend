import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ga_consent';

export function getAdConsent() {
  return localStorage.getItem(CONSENT_KEY) === 'granted';
}

function dispatchAdConsent(granted) {
  window.dispatchEvent(new CustomEvent('adconsent', { detail: granted }));
}

export default function ConsentModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
      dispatchAdConsent(true);
    } else if (stored === 'denied') {
      dispatchAdConsent(false);
    } else {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    window.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    dispatchAdConsent(true);
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
    dispatchAdConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <div className="consent-modal__icon">🍪</div>
        <h2 className="consent-modal__title">Cookie-Einstellungen</h2>
        <p className="consent-modal__text">
          Wir verwenden notwendige Cookies, damit die App funktioniert. Mit deiner Zustimmung setzen wir zusätzlich Marketing- und Analyse-Cookies (Google AdSense, Adsterra) ein, um das Erlebnis zu verbessern.
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
