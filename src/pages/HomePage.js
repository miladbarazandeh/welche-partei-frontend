import { Link } from 'react-router-dom';
import AppBrand from '../components/AppBrand';
import FlagMark from '../components/FlagMark';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LegalFooter from '../components/LegalFooter';
import { COUNTRY_LIST, getCountryName } from '../config/gameConfig';
import { useI18n } from '../context/AppContext';

function CountryCard({ country }) {
  const { locale, t } = useI18n();
  const name = getCountryName(country.slug, locale);

  return (
    <Link to={`/quiz/${country.slug}`} className="country-card">
      <FlagMark country={country} className="country-card__flag" />
      <div className="country-card__content">
        <h2 className="country-card__title">{name}</h2>
        <span className="country-card__cta">{t('home.start')} →</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__top">
          <AppBrand subtitle={t('home.brandSubtitle')} />
          <LanguageSwitcher />
        </div>

        <div className="home-copy">
          <h2 className="home-copy__title">{t('home.title')}</h2>
          <p className="home-copy__text">{t('home.subtitle')}</p>
        </div>
      </section>

      <section className="country-grid">
        {COUNTRY_LIST.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </section>

      <LegalFooter />
    </main>
  );
}
