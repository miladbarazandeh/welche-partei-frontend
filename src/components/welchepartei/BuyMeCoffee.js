import { useI18n } from '../../context/AppContext';
import { useSupportTreat } from '../../hooks/useSupportTreat';

export default function BuyMeCoffee() {
  const { t } = useI18n();
  const { treat, emoji } = useSupportTreat();
  return (
    <div className="wp-coffee">
      <div className="wp-coffee__inner">
        <span className="wp-coffee__icon">{emoji}</span>
        <div className="wp-coffee__text">
          <p className="wp-coffee__title">{t('wp.coffee.title')}</p>
          <p className="wp-coffee__sub">{t(`wp.coffee.sub.${treat}`)}</p>
        </div>
        <a
          href="https://buymeacoffee.com/welche.partei"
          target="_blank"
          rel="noopener noreferrer"
          className="wp-coffee__btn"
        >
          {t('wp.coffee.btn', { treat: t(`treat.${treat}`) })}
        </a>
      </div>
    </div>
  );
}
