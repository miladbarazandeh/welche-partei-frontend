import { useEffect, useRef, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 768px)';
const MOBILE_AD_SRC = '//untimely-hello.com/bmX.VesxdwGQlc0dYDW/cQ/YeVmN9busZbUul/kLPMTFciwdNJDGAvxuONDFEPtMNKzCAW0UMYD/Ef4mNNQD';
const DESKTOP_AD_SRC = '//untimely-hello.com/bDXyVksGd.GQls0/YCWdce/heRmo9UuqZ/UBlwkBPNT/cvwQNxDnALxeO-TlMStVNczhAe0-MHDMEr5RN_wM';

function getIsDesktop() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(DESKTOP_QUERY).matches;
}

export default function ResponsiveAdBanner({ className = '' }) {
  const slotRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const slot = slotRef.current;

    if (!slot) {
      return undefined;
    }

    const script = document.createElement('script');
    script.settings = {};
    script.src = isDesktop ? DESKTOP_AD_SRC : MOBILE_AD_SRC;
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    slot.replaceChildren(script);

    return () => {
      slot.replaceChildren();
    };
  }, [isDesktop]);

  return (
    <aside
      className={`ad-banner${isDesktop ? ' ad-banner--desktop' : ' ad-banner--mobile'}${className ? ` ${className}` : ''}`}
      aria-label="Advertisement"
    >
      <div ref={slotRef} className="ad-banner__slot" />
    </aside>
  );
}
