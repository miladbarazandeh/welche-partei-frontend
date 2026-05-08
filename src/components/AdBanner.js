import { useEffect } from 'react';

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1616735179810869"
      data-ad-slot="7497804533"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
