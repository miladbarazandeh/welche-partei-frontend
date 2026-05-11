import { Link } from 'react-router-dom';
export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <header className="stats-header">
        <div className="header__brand">
          <div className="header__flag" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="header__titles">
            <h1 className="header__title">Welche Partei?</h1>
            <p className="header__subtitle">Datenschutzerklärung</p>
          </div>
        </div>
        <Link to="/" className="stats-back-btn">← Spielen</Link>
      </header>

      <div className="privacy-content">

        <section className="privacy-section">
          <h2 className="privacy-heading">1. Verantwortlicher</h2>
          <p className="privacy-text">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) für den Betrieb dieser Website ist der Betreiber von <strong>welche-partei.de</strong>.
          </p>
          <p className="privacy-text">
            Kontakt: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">2. Hosting</h2>
          <p className="privacy-text">
            Diese Website wird auf Servern der <strong>Hetzner Online GmbH</strong> (Industriestr. 25, 91710 Gunzenhausen, Deutschland) betrieben. Beim Abruf der Website werden automatisch Serverprotokolldaten erfasst, darunter IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene URL, übertragene Datenmenge, Browser-Typ und Referrer-URL. Diese Daten werden ausschließlich zur Sicherstellung des technischen Betriebs verarbeitet und sind nicht mit anderen Datenquellen zusammenführbar.
          </p>
          <p className="privacy-text">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und fehlerfreien Betrieb der Website).
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">3. Cookies und Sitzungsdaten</h2>
          <p className="privacy-text">
            Die Website setzt ein technisch notwendiges Sitzungs-Cookie, um deinen Spielfortschritt (Punkte, Streak, Verlauf) während einer Browser-Sitzung zu speichern. Dieses Cookie enthält keine personenbezogenen Daten und ist nicht auf andere Websites übertragbar. Eine Identifizierung einzelner Personen ist darüber nicht möglich.
          </p>
          <p className="privacy-text">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weitere Cookies (Analytics, Werbung) werden nur nach deiner ausdrücklichen Einwilligung gesetzt (siehe Abschnitte 4 und 5).
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">4. Google Analytics</h2>
          <p className="privacy-text">
            Diese Website nutzt <strong>Google Analytics</strong> (Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) mit der Mess-ID <strong>G-NBTJZLT3KN</strong>. Google Analytics verwendet Cookies, um die Nutzung der Website statistisch auszuwerten (z. B. Seitenaufrufe, Sitzungsdauer, Herkunftsland).
          </p>
          <p className="privacy-text">
            Wir setzen Google Consent Mode v2 ein: Analytics-Cookies werden standardmäßig blockiert und nur aktiviert, wenn du im Einwilligungsdialog zustimmst. IP-Adressen werden innerhalb der EU anonymisiert, bevor sie an Google übertragen werden.
          </p>
          <p className="privacy-text">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Du kannst deine Einwilligung jederzeit widerrufen, indem du die Cookie-Einstellungen über den Einwilligungsdialog anpasst oder das <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="privacy-link">Google Analytics Opt-out Browser-Add-on</a> installierst.
          </p>
          <p className="privacy-text">
            Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="privacy-link">Datenschutzerklärung von Google</a>.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">5. Google AdSense</h2>
          <p className="privacy-text">
            Diese Website verwendet <strong>Google AdSense</strong> (Publisher-ID: <strong>ca-pub-1616735179810869</strong>), einen Dienst von Google Ireland Limited, zur Einblendung von Werbeanzeigen. Google AdSense setzt Cookies, um Anzeigen auf Basis deiner Interessen auszuspielen.
          </p>
          <p className="privacy-text">
            Personalisierte Werbung wird nur nach deiner Einwilligung aktiviert. Ohne Einwilligung werden ausschließlich kontextbasierte, nicht-personalisierte Anzeigen angezeigt.
          </p>
          <p className="privacy-text">
            Rechtsgrundlage für personalisierte Werbung ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Weitere Informationen sowie Opt-out-Möglichkeiten findest du unter <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="privacy-link">Google-Werberichtlinien</a>.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">6. Einwilligungsverwaltung (CMP)</h2>
          <p className="privacy-text">
            Zur Einholung und Verwaltung deiner Einwilligung setzen wir <strong>Google Funding Choices</strong> ein. Dieses Consent-Management-Tool zeigt dir beim ersten Besuch einen Einwilligungsdialog und speichert deine Entscheidung lokal in deinem Browser. Du kannst deine Einwilligung jederzeit über den erneut eingeblendeten Dialog anpassen oder widerrufen.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">7. Deine Rechte</h2>
          <p className="privacy-text">
            Du hast nach der DSGVO folgende Rechte gegenüber dem Verantwortlichen:
          </p>
          <ul className="privacy-list">
            <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten über dich verarbeitet werden.</li>
            <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten.</li>
            <li><strong>Löschung</strong> (Art. 17 DSGVO): Löschung deiner Daten, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
            <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Einschränkung der Verarbeitung.</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Übertragung deiner Daten in einem maschinenlesbaren Format.</li>
            <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen die Verarbeitung auf Basis berechtigter Interessen.</li>
            <li><strong>Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.</li>
          </ul>
          <p className="privacy-text">
            Zur Ausübung deiner Rechte wende dich per E-Mail an: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
          </p>
          <p className="privacy-text">
            Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde richtet sich nach deinem Wohnort in Deutschland.
          </p>
        </section>

        <p className="privacy-updated">Stand: Mai 2026</p>
      </div>

    </main>
  );
}
