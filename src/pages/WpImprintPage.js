import { Link } from 'react-router-dom';
import '../welchepartei.css';

export default function WpImprintPage() {
  return (
    <div className="wp-page wp-legal-page">
      <div className="wp-legal__inner">
        <div className="wp-legal__nav">
          <Link to="/" className="wp-btn wp-btn--ghost wp-btn--sm">← Zurück</Link>
        </div>

        <header className="wp-legal__header">
          <span className="wp-legal__eyebrow">Rechtliches</span>
          <h1 className="wp-legal__title">Impressum</h1>
        </header>

        <div className="wp-legal__content">
          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">Angaben gemäß § 5 TMG</h2>
            <p className="wp-legal__text">
              Milad Barazandeh<br />
              Am Carlsgarten 9<br />
              10318 Berlin<br />
              Deutschland
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">Kontakt</h2>
            <p className="wp-legal__text">
              E-Mail: <a href="mailto:miladbrznd@gmail.com" className="wp-legal__link">miladbrznd@gmail.com</a>
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p className="wp-legal__text">
              Milad Barazandeh<br />
              Am Carlsgarten 9<br />
              10318 Berlin
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">Haftungsausschluss</h2>
            <p className="wp-legal__text">
              Alle auf dieser Website dargestellten Positionen und Quellen basieren auf öffentlich
              verfügbaren Dokumenten und wurden redaktionell geprüft. Für die inhaltliche
              Richtigkeit der verlinkten Quellen übernehmen wir keine Haftung.
            </p>
          </section>

          <p className="wp-legal__updated">Stand: August 2026</p>
        </div>
      </div>
    </div>
  );
}
