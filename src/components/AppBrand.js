import { useI18n } from '../context/AppContext';
import BrandMark from './BrandMark';

export default function AppBrand({ subtitle }) {
  const { t } = useI18n();

  return (
    <div className="header__brand">
      <BrandMark />
      <div className="header__titles">
        <h1 className="header__title">{t('app.title')}</h1>
        <p className="header__subtitle">{subtitle || t('app.subtitle')}</p>
      </div>
    </div>
  );
}
