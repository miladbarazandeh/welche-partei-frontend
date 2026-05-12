import { useI18n } from '../context/AppContext';

const APPS = [
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
    icon: '✈️',
    name: 'Tripenai',
    desc: {
      de: 'Deine ganze Reise in einer App',
      en: 'Your whole trip in one app',
    },
    href: 'https://tripenai.com',
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

export default function AppPromoCards() {
  const { locale, t } = useI18n();

  return (
    <div className="app-promo">
      <p className="app-promo__label">{t('promo.label')}</p>
      <div className="app-promo__grid">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="app-promo__card"
          >
            <span className="app-promo__icon">{app.icon}</span>
            <span className="app-promo__name">{app.name}</span>
            <span className="app-promo__desc">{app.desc[locale] || app.desc.en}</span>
            <span className="app-promo__cta">{t('promo.cta')} →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
