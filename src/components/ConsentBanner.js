import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ga_consent';

export default function ConsentBanner() {
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
    <div className="consent-bar">
      <p className="consent-bar__text">
        Wir nutzen Google Analytics, um die Nutzung besser zu verstehen.
      </p>
      <div className="consent-bar__actions">
        <button className="consent-bar__btn consent-bar__btn--decline" onClick={decline}>Ablehnen</button>
        <button className="consent-bar__btn consent-bar__btn--accept" onClick={accept}>Akzeptieren</button>
      </div>
    </div>
  );
}
