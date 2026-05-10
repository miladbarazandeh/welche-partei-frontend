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
    name: 'Plus Minus Next',
    desc: 'Dein tägliches Tagebuch',
    href: 'https://apps.apple.com/de/app/daily-journal-plus-minus-next/id6759860431',
  },
];

export default function AppPromoCards() {
  return (
    <div className="app-promo">
      <p className="app-promo__label">Vom selben Macher</p>
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
            <span className="app-promo__desc">{app.desc}</span>
            <span className="app-promo__cta">Jetzt testen →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
