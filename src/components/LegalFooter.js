import { Link } from 'react-router-dom';
import { getLastCountry, useI18n } from '../context/AppContext';

export default function LegalFooter({ country }) {
  const { t } = useI18n();
  const baseCountry = country || getLastCountry();

  return (
    <footer className="page-footer">
      <Link to={`/quiz/${baseCountry}/privacy`} className="page-footer__link">
        {t('common.privacy')}
      </Link>
      <span className="page-footer__separator">|</span>
      <Link to={`/quiz/${baseCountry}/imprint`} className="page-footer__link">
        {t('common.imprint')}
      </Link>
    </footer>
  );
}

