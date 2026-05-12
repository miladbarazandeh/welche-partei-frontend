import { useI18n } from '../context/AppContext';

const OPTIONS = [
  { value: 'de', label: 'DE' },
  { value: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label="Language switcher">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`lang-switch__btn${
            locale === option.value ? ' lang-switch__btn--active' : ''
          }`}
          onClick={() => setLocale(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

