import { Link } from 'react-router-dom';
import '../welchepartei.css';

export default function WpPrivacyPage() {
  return (
    <div className="wp-page wp-legal-page">
      <div className="wp-legal__inner">
        <div className="wp-legal__nav">
          <Link to="/" className="wp-btn wp-btn--ghost wp-btn--sm">← Zurück</Link>
        </div>

        <header className="wp-legal__header">
          <span className="wp-legal__eyebrow">Rechtliches</span>
          <h1 className="wp-legal__title">Datenschutzerklärung</h1>
        </header>

        <div className="wp-legal__content">
          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">1. Verantwortlicher</h2>
            <p className="wp-legal__text">
              Verantwortlicher im Sinne der DSGVO für den Betrieb dieser Website ist:
            </p>
            <p className="wp-legal__text">
              Milad Barazandeh<br />
              Am Carlsgarten 9<br />
              10318 Berlin<br />
              E-Mail: <a href="mailto:miladbrznd@gmail.com" className="wp-legal__link">miladbrznd@gmail.com</a>
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">2. Hosting</h2>
            <p className="wp-legal__text">
              Diese Website wird auf Servern der <strong>Hetzner Online GmbH</strong> (Industriestr. 25,
              91710 Gunzenhausen, Deutschland) betrieben. Beim Abruf der Website werden automatisch
              Serverprotokolldaten erfasst: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene URL,
              übertragene Datenmenge, Browser-Typ und Referrer-URL. Diese Daten werden ausschließlich zur
              Sicherstellung des technischen Betriebs verarbeitet und nicht mit anderen Quellen
              zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">3. Lokale Speicherung (localStorage)</h2>
            <p className="wp-legal__text">
              Der Fragebogen speichert deinen Fortschritt (Werteantworten, Positionen, Gewichtungen und
              den aktuellen Schritt) ausschließlich im <strong>localStorage</strong> deines Browsers.
              Diese Daten verlassen deinen Browser nicht und werden nicht an unsere Server übertragen,
              solange du den Fragebogen nicht abschließt. Sie enthalten keine direkt
              personenbezogenen Angaben. Du kannst sie jederzeit löschen, indem du „Neu starten" wählst
              oder den Browserspeicher leerst.
            </p>
            <p className="wp-legal__text">
              Cookies werden auf dieser Seite für die Kernfunktion nicht eingesetzt.
              Analyse- oder Werbe-Cookies werden nur nach ausdrücklicher Einwilligung gesetzt.
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">4. Anonyme Sitzungsdaten</h2>
            <p className="wp-legal__text">
              Wenn du den Gegencheck abschließt und auf „Quellen prüfen" klickst, werden deine Antworten
              und Gewichtungen anonymisiert an unsere Server übermittelt und gespeichert. Die übertragenen
              Daten enthalten keine Namen, E-Mail-Adressen oder sonstigen Identifikatoren.
              Sie dienen der Qualitätssicherung und statistischen Auswertung.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              Verbesserung des Dienstes).
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">5. Google Analytics</h2>
            <p className="wp-legal__text">
              Diese Website nutzt <strong>Google Analytics</strong> (Google Ireland Limited, Gordon
              House, Barrow Street, Dublin 4, Irland) mit der Mess-ID <strong>G-NBTJZLT3KN</strong>.
              Analytics-Cookies werden nur nach deiner Zustimmung aktiviert.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen findest du in der{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="wp-legal__link">
                Datenschutzerklärung von Google
              </a>.
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">6. Google AdSense</h2>
            <p className="wp-legal__text">
              Diese Website verwendet <strong>Google AdSense</strong> (Publisher-ID:{' '}
              <strong>ca-pub-1616735179810869</strong>) zur Einblendung von Werbeanzeigen.
              Personalisierte Werbung wird nur nach deiner Einwilligung aktiviert.
              Weitere Informationen und Opt-out-Möglichkeiten findest du unter den{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="wp-legal__link">
                Google-Werberichtlinien
              </a>.
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">7. Einwilligungsverwaltung</h2>
            <p className="wp-legal__text">
              Zur Einholung und Verwaltung deiner Einwilligung für Analyse und Werbung nutzen wir einen
              Consent-Dialog. Deine Auswahl wird lokal in deinem Browser gespeichert und kann jederzeit
              geändert oder widerrufen werden.
            </p>
          </section>

          <section className="wp-legal__section">
            <h2 className="wp-legal__heading">8. Deine Rechte</h2>
            <p className="wp-legal__text">
              Du hast nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16),
              Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
              (Art. 20), Widerspruch (Art. 21) sowie das Recht, eine erteilte Einwilligung jederzeit
              zu widerrufen (Art. 7 Abs. 3). Zur Ausübung deiner Rechte wende dich an:{' '}
              <a href="mailto:miladbrznd@gmail.com" className="wp-legal__link">miladbrznd@gmail.com</a>
            </p>
            <p className="wp-legal__text">
              Du hast außerdem das Recht, dich bei einer Aufsichtsbehörde zu beschweren. Die zuständige
              Behörde für Berlin ist die <strong>Berliner Beauftragte für Datenschutz und
              Informationsfreiheit</strong>.
            </p>
          </section>

          <p className="wp-legal__updated">Stand: August 2026</p>
        </div>
      </div>
    </div>
  );
}
