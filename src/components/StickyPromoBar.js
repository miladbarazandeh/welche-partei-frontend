import { useState } from 'react';
import { useI18n } from '../context/AppContext';

const APPS = [
  {
    icon: '✈️',
    name: 'Tripenai',
    desc: {
      de: 'Deine ganze Reise in einer App',
      en: 'Your whole trip in one app',
    },
    href: 'https://tripenai.com',
  },
  {
    icon: '🇩🇪',
    name: 'Bürger-Test',
    desc: {
      de: 'Teste dein Deutschland-Wissen',
      en: 'Test your knowledge about Germany',
    },
    href: 'https://www.buerger-test.app/',
  },
  
  {
    icon: '👶',
    name: 'Name Radar',
    desc: {
      de: 'Deutsche Vornamen entdecken',
      en: 'Discover German first names',
    },
    href: 'https://name-radar.de/',
  },
  {
    icon: '📖',
    name: 'Memo',
    desc: {
      de: 'Deutsche Wörter lernen',
      en: 'Learn German words',
    },
    href: 'https://apps.apple.com/de/app/memo-learn-german-words/id6746387251',
  },
  {
    icon: '📓',
    name: 'Plus Minus Next',
    desc: {
      de: 'Dein tägliches Tagebuch',
      en: 'Your daily journal',
    },
    href: 'https://apps.apple.com/de/app/daily-journal-plus-minus-next/id6759860431',
  },
];

const STORAGE_KEY = 'sticky_promo_collapsed';

export default function StickyPromoBar() {
  const { locale, t } = useI18n();
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== '0';
  });

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  };

  return (
    <div className={`sticky-promo${collapsed ? ' sticky-promo--collapsed' : ''}`}>
      <button className="sticky-promo__handle" onClick={toggle} aria-label={t('sticky.toggle')}>
        <span className="sticky-promo__handle-label">{t('sticky.label')}</span>
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
              <span className="sticky-promo__desc">{app.desc[locale] || app.desc.en}</span>
            </div>
            <span className="sticky-promo__arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
