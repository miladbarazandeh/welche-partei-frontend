import { getCountryConfig } from '../config/gameConfig';

export default function FlagMark({ country, className = '' }) {
  const config = typeof country === 'string' ? getCountryConfig(country) : country;
  const slug = config?.slug || 'de';

  return (
    <div
      className={`${className} flag-mark flag-mark--${slug}`.trim()}
      aria-hidden="true"
    >
      {slug === 'de' && (
        <>
          <span />
          <span />
          <span />
        </>
      )}
    </div>
  );
}
