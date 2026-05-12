import { Link } from 'react-router-dom';
import AppBrand from '../components/AppBrand';
import LegalFooter from '../components/LegalFooter';
import SettingsMenu from '../components/SettingsMenu';
import { useCountry, useI18n } from '../context/AppContext';

function GermanContent() {
  return (
    <div className="privacy-content">
      <section className="privacy-section">
        <h2 className="privacy-heading">Angaben gemäß § 5 TMG</h2>
        <p className="privacy-text">
          Milad Barazandeh
          <br />
          Am Carlsgarten 9
          <br />
          10318 Berlin
          <br />
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
          Milad Barazandeh
          <br />
          Am Carlsgarten 9
          <br />
          10318 Berlin
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
        <h2 className="privacy-heading">Information pursuant to Sec. 5 TMG</h2>
        <p className="privacy-text">
          Milad Barazandeh
          <br />
          Am Carlsgarten 9
          <br />
          10318 Berlin
          <br />
          Germany
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">Contact</h2>
        <p className="privacy-text">
          Email: <a href="mailto:miladbrznd@gmail.com" className="privacy-link">miladbrznd@gmail.com</a>
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-heading">Responsible for content pursuant to Sec. 18 para. 2 MStV</h2>
        <p className="privacy-text">
          Milad Barazandeh
          <br />
          Am Carlsgarten 9
          <br />
          10318 Berlin
        </p>
      </section>

      <p className="privacy-updated">Updated: May 2026</p>
    </div>
  );
}

export default function ImprintPage() {
  const country = useCountry();
  const { locale, t } = useI18n();

  return (
    <main className="privacy-page">
      <header className="stats-header">
        <div className="stats-header__top">
          <AppBrand subtitle={t('legal.imprintSubtitle')} />
          <SettingsMenu buildCountryHref={(slug) => `/${slug}/imprint`} />
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
