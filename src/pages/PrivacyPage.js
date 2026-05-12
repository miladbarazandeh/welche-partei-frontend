import { Link } from 'react-router-dom';
import AppBrand from '../components/AppBrand';
import LegalFooter from '../components/LegalFooter';
import SettingsMenu from '../components/SettingsMenu';
import { useCountry, useI18n } from '../context/AppContext';

function GermanContent() {
  return (
    <div className="privacy-content">
      <section className="privacy-section">
        <h2 className="privacy-heading">1. Verantwortlicher</h2>
        <p className="privacy-text">
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) für den Betrieb
          dieser Website ist der Betreiber von <strong>welche-partei.de</strong>.
        </p>
        <p className="privacy-text">
          Kontakt: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">2. Hosting</h2>
        <p className="privacy-text">
          Diese Website wird auf Servern der <strong>Hetzner Online GmbH</strong> betrieben
          (Industriestr. 25, 91710 Gunzenhausen, Deutschland). Beim Abruf der Website werden
          automatisch Serverprotokolldaten erfasst, darunter IP-Adresse, Datum und Uhrzeit des
          Zugriffs, aufgerufene URL, übertragene Datenmenge, Browser-Typ und Referrer-URL.
        </p>
        <p className="privacy-text">
          Diese Daten werden ausschließlich zur Sicherstellung des technischen Betriebs verarbeitet
          und nicht mit anderen Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1
          lit. f DSGVO.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">3. Cookies und Sitzungsdaten</h2>
        <p className="privacy-text">
          Die Website setzt ein technisch notwendiges Sitzungs-Cookie, um deinen Spielfortschritt
          (Punkte, Serie, Verlauf) während einer Browser-Sitzung zu speichern. Dieses Cookie
          enthält keine personenbezogenen Daten und dient nur dem Betrieb des Spiels.
        </p>
        <p className="privacy-text">
          Weitere Cookies für Analyse oder Werbung werden nur nach ausdrücklicher Einwilligung
          gesetzt.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">4. Google Analytics</h2>
        <p className="privacy-text">
          Diese Website nutzt <strong>Google Analytics</strong> (Google Ireland Limited, Gordon
          House, Barrow Street, Dublin 4, Irland) mit der Mess-ID <strong>G-NBTJZLT3KN</strong>.
          Analytics-Cookies werden nur nach Zustimmung aktiviert.
        </p>
        <p className="privacy-text">
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen findest du in der{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="privacy-link"
          >
            Datenschutzerklärung von Google
          </a>.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">5. Google AdSense</h2>
        <p className="privacy-text">
          Diese Website verwendet <strong>Google AdSense</strong> (Publisher-ID:{' '}
          <strong>ca-pub-1616735179810869</strong>) zur Einblendung von Werbeanzeigen.
          Personalisierte Werbung wird nur nach Einwilligung aktiviert.
        </p>
        <p className="privacy-text">
          Weitere Informationen und Opt-out-Möglichkeiten findest du unter{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="privacy-link"
          >
            Google-Werberichtlinien
          </a>.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">6. Einwilligungsverwaltung</h2>
        <p className="privacy-text">
          Zur Einholung und Verwaltung deiner Einwilligung nutzen wir einen Consent-Dialog. Deine
          Auswahl wird lokal in deinem Browser gespeichert und kann jederzeit geändert oder
          widerrufen werden.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">7. Deine Rechte</h2>
        <p className="privacy-text">
          Du hast nach der DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch und Widerruf bereits
          erteilter Einwilligungen.
        </p>
        <p className="privacy-text">
          Zur Ausübung deiner Rechte wende dich an:{' '}
          <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
        </p>
      </section>

      <p className="privacy-updated">Stand: Mai 2026</p>
    </div>
  );
}

function EnglishContent() {
  return (
    <div className="privacy-content">
      <section className="privacy-section">
        <h2 className="privacy-heading">1. Controller</h2>
        <p className="privacy-text">
          The controller for this website within the meaning of the General Data Protection
          Regulation (GDPR) is the operator of <strong>welche-partei.de</strong>.
        </p>
        <p className="privacy-text">
          Contact: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">2. Hosting</h2>
        <p className="privacy-text">
          This website is hosted on servers operated by <strong>Hetzner Online GmbH</strong>,
          Industriestr. 25, 91710 Gunzenhausen, Germany. Standard server log data may be processed
          automatically when the website is accessed, including IP address, date and time, requested
          URL, amount of data transferred, browser type, and referrer URL.
        </p>
        <p className="privacy-text">
          This data is processed only to ensure the secure and reliable operation of the service.
          The legal basis is Art. 6(1)(f) GDPR.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">3. Cookies and Session Data</h2>
        <p className="privacy-text">
          The website uses a technically necessary session cookie to store game progress such as
          score, streak, and answer history during a browser session. This cookie does not contain
          directly identifying personal data and is used only to operate the game.
        </p>
        <p className="privacy-text">
          Additional cookies for analytics or advertising are only set with your explicit consent.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">4. Google Analytics</h2>
        <p className="privacy-text">
          This website uses <strong>Google Analytics</strong> (Google Ireland Limited, Gordon
          House, Barrow Street, Dublin 4, Ireland) with measurement ID <strong>G-NBTJZLT3KN</strong>.
          Analytics cookies are activated only if you consent.
        </p>
        <p className="privacy-text">
          The legal basis is Art. 6(1)(a) GDPR. More information is available in Google&apos;s{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="privacy-link"
          >
            privacy policy
          </a>.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">5. Google AdSense</h2>
        <p className="privacy-text">
          This website uses <strong>Google AdSense</strong> (Publisher ID:{' '}
          <strong>ca-pub-1616735179810869</strong>) to display advertisements. Personalized ads are
          enabled only after consent.
        </p>
        <p className="privacy-text">
          Further details and opt-out options are available in the{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="privacy-link"
          >
            Google ads policies
          </a>.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">6. Consent Management</h2>
        <p className="privacy-text">
          We use a consent dialog to collect and manage your choices. Your selection is stored
          locally in your browser and can be changed or withdrawn at any time.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">7. Your Rights</h2>
        <p className="privacy-text">
          Under the GDPR, you have rights including access, rectification, erasure, restriction of
          processing, data portability, objection, and withdrawal of previously given consent.
        </p>
        <p className="privacy-text">
          To exercise these rights, contact:{' '}
          <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
        </p>
      </section>

      <p className="privacy-updated">Updated: May 2026</p>
    </div>
  );
}

export default function PrivacyPage() {
  const country = useCountry();
  const { locale, t } = useI18n();

  return (
    <main className="privacy-page">
      <header className="stats-header">
        <div className="stats-header__top">
          <AppBrand subtitle={t('legal.privacySubtitle')} />
          <SettingsMenu buildCountryHref={(slug) => `/${slug}/privacy`} />
        </div>
        <div className="stats-header__actions">
          <Link to={`/${country.slug}`} className="stats-back-btn">
            ← {t('nav.backToGame')}
          </Link>
        </div>
      </header>

      {locale === 'de' ? <GermanContent /> : <EnglishContent />}
      <LegalFooter country={country.slug} />
    </main>
  );
}
