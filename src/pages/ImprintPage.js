import { Link } from 'react-router-dom';

export default function ImprintPage() {
  return (
    <main className="privacy-page">
      <header className="stats-header">
        <div className="header__brand">
          <div className="header__flag" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="header__titles">
            <h1 className="header__title">Welche Partei?</h1>
            <p className="header__subtitle">Impressum</p>
          </div>
        </div>
        <Link to="/" className="stats-back-btn">← Spielen</Link>
      </header>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2 className="privacy-heading">Angaben gemäß § 5 TMG</h2>
          <p className="privacy-text">
            Milad Barazandeh<br />
            Am Carlsgarten 9<br />
            10318 Berlin<br />
            Deutschland
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Kontakt</h2>
          <p className="privacy-text">
            E-Mail: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p className="privacy-text">
            Milad Barazandeh<br />
            Am Carlsgarten 9<br />
            10318 Berlin
          </p>
        </section>

        <p className="privacy-updated">Stand: Mai 2026</p>
      </div>
    </main>
  );
}
