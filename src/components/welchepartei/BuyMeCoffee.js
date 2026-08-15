import { useI18n } from '../../context/AppContext';

export default function BuyMeCoffee() {
  const { t } = useI18n();
  return (
    <div className="wp-coffee">
      <div className="wp-coffee__inner">
        <span className="wp-coffee__icon">☕</span>
        <div className="wp-coffee__text">
          <p className="wp-coffee__title">{t('wp.coffee.title')}</p>
          <p className="wp-coffee__sub">{t('wp.coffee.sub')}</p>
        </div>
        <a
          href="https://buymeacoffee.com/welche.partei"
          target="_blank"
          rel="noopener noreferrer"
          className="wp-coffee__btn"
        >
          {t('wp.coffee.btn')}
        </a>
      </div>
    </div>
  );
}
