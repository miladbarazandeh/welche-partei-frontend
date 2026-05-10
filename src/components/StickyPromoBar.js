import { useEffect, useState } from 'react';

const APPS = [
  {
    icon: '🇩🇪',
    name: 'Bürger-Test',
    desc: 'Teste dein Deutschland-Wissen',
    href: 'https://www.buerger-test.app/',
  },
  {
    icon: '✈️',
    name: 'Tripenai',
    desc: 'Deine ganze Reise in einer App',
    href: 'https://tripenai.com',
  },
  {
    icon: '👶',
    name: 'Name Radar',
    desc: 'Deutsche Vornamen entdecken',
    href: 'https://name-radar.de/',
  },
  {
    icon: '📖',
    name: 'Memo',
    desc: 'Deutsche Wörter lernen',
    href: 'https://apps.apple.com/de/app/memo-learn-german-words/id6746387251',
  },
  {
    icon: '📓',
    name: 'Daily Journal',
    desc: 'Dein tägliches Tagebuch',
    href: 'https://apps.apple.com/de/app/daily-journal-plus-minus-next/id6759860431',
  },
];

const STORAGE_KEY = 'sticky_promo_collapsed';
const UNLOCK_THRESHOLD = 20;

export default function StickyPromoBar() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.totalAnswers >= UNLOCK_THRESHOLD) setVisible(true);
    };
    window.addEventListener('answers-updated', handler);
    return () => window.removeEventListener('answers-updated', handler);
  }, []);

  if (!visible) return null;

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  };

  return (
    <div className={`sticky-promo${collapsed ? ' sticky-promo--collapsed' : ''}`}>
      <button className="sticky-promo__handle" onClick={toggle} aria-label="Apps ein-/ausblenden">
        <span className="sticky-promo__handle-label">Unsere Apps</span>
        <span className="sticky-promo__chevron">{collapsed ? '▲' : '▼'}</span>
      </button>

      <div className="sticky-promo__body">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-promo__card"
          >
            <span className="sticky-promo__icon">{app.icon}</span>
            <div className="sticky-promo__text">
              <span className="sticky-promo__name">{app.name}</span>
              <span className="sticky-promo__desc">{app.desc}</span>
            </div>
            <span className="sticky-promo__arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
