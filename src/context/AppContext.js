import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import {
  DEFAULT_COUNTRY,
  getCountryConfig,
  getPartyLabel,
  getPartyShortLabel,
  getPartySlug,
} from '../config/gameConfig';

const LANGUAGE_KEY = 'app_locale';
const LAST_COUNTRY_KEY = 'app_last_country';
const PLAYER_NAME_KEY = 'app_player_name';

const messages = {
  de: {
    'app.title': 'Welche Partei?',
    'app.subtitle': 'Partei per Foto erraten',
    'home.brandSubtitle': 'Das Bilder-Spiel',
    'home.title': 'Erkennst du die Partei nur am Foto?',
    'home.subtitle':
      'Wähle ein Land und finde heraus, wie gut dein politisches Bauchgefühl wirklich ist.',
    'home.lastPlayed': 'Zuletzt gespielt: {country}',
    'home.country.de.desc': 'Bundestags-Spiel mit den bekannten deutschen Parteien.',
    'home.country.us.desc':
      'Kongress und Landesparlamente mit frei nutzbaren Porträts und Attributionen.',
    'home.start': 'Spiel starten',
    'nav.stats': 'Statistiken',
    'nav.support': 'Support',
    'nav.play': 'Spielen',
    'nav.home': 'Start',
    'nav.backToGame': 'Zum Spiel',
    'nav.backToStats': 'Zu Statistiken',
    'common.retry': 'Erneut versuchen',
    'common.privacy': 'Datenschutz',
    'common.imprint': 'Impressum',
    'common.loading': 'Lade…',
    'common.notAvailable': '—',
    'settings.open': 'Einstellungen öffnen',
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.country': 'Land',
    'settings.current': 'Aktiv',
    'settings.playerName': 'Spielername',
    'settings.playerNamePlaceholder': 'Name eingeben…',
    'settings.playerNameSaved': 'Gespeichert',
    'settings.playerNameError': 'Max. 19 Zeichen',
    'sound.enable': 'Ton einschalten',
    'sound.disable': 'Ton ausschalten',
    'header.score': 'Score',
    'header.streak': 'Serie',
    'header.best': 'Rekord',
    'header.spectrum': 'Spektrum',
    'game.connectionError':
      'Verbindung zum Server fehlgeschlagen. Ist das Backend gestartet?',
    'game.pickParty': 'Partei wählen',
    'game.left': '← Links',
    'game.right': 'Rechts →',
    'game.history': 'Letzte Antworten',
    'game.over.title': 'Alle verfügbaren Politiker erraten',
    'game.over.subtitle':
      'Diese Session hat alle verfügbaren Politiker gesehen. Du kannst neu starten oder das Land wechseln.',
    'game.over.points': 'Punkte',
    'game.over.best': 'Beste Serie',
    'game.over.answered': 'Beantwortet',
    'game.over.accuracy': 'Spektrum',
    'game.over.support': 'Kaffee spendieren',
    'game.over.restart': 'Neu starten',
    'support.title': 'Macht dir das Spiel Spaß?',
    'support.text':
      'Welche Partei? ist kostenlos. Ein kleiner Kaffee hilft, das Projekt am Leben zu halten.',
    'support.cta': 'Kaffee spendieren',
    'support.later': 'Vielleicht später',
    'promo.label': 'Vom selben Macher',
    'promo.cta': 'Jetzt testen',
    'sticky.label': 'Unsere Apps',
    'sticky.toggle': 'Apps ein- oder ausblenden',
    'cookies.title': 'Cookie-Einstellungen',
    'cookies.text':
      'Wir verwenden notwendige Cookies, damit die App funktioniert. Mit deiner Zustimmung setzen wir zusätzlich Analyse-Cookies ein, um das Erlebnis zu verbessern.',
    'cookies.accept': 'Alle akzeptieren',
    'cookies.decline': 'Nur notwendige',
    'stats.subtitle': 'Statistiken',
    'stats.loading': 'Statistiken werden geladen…',
    'stats.error': 'Statistiken konnten nicht geladen werden.',
    'stats.answers': 'Antworten',
    'stats.accuracy': 'Genauigkeit',
    'stats.players': 'Spieler',
    'stats.bestStreak': 'Rekord-Serie',
    'stats.leftRight': 'Links / Rechts Genauigkeit',
    'stats.globalSpectrum': 'Globales Spektrum',
    'stats.exact': '{value}% exakt',
    'stats.side': '{value}% Seite',
    'stats.left': '← Links',
    'stats.right': 'Rechts →',
    'stats.byParty': 'Genauigkeit pro Partei',
    'stats.matrix': 'Verwechslungsmatrix',
    'stats.matrix.actual': 'Ist ↓',
    'stats.matrix.guessed': 'Geraten →',
    'stats.topCorrect': 'Oft richtig geraten',
    'stats.topWrong': 'Oft falsch geraten',
    'stats.topUsers': 'Bestenliste',
    'stats.you': 'Du',
    'stats.confusions': 'Häufigste Verwechslungen',
    'stats.search': 'Politiker suchen…',
    'stats.noResults': 'Keine Ergebnisse für „{query}“',
    'politician.subtitle': 'Politiker',
    'politician.notFound': 'Dieser Politiker wurde nicht gefunden.',
    'politician.answers': 'Antworten gesamt',
    'politician.guessedAs': 'Wie wurde geraten',
    'politician.correct': 'Richtig',
    'politician.imageAttribution': 'Bild-Attribution',
    'politician.author': 'Autor',
    'politician.license': 'Lizenz',
    'politician.sourceImage': 'Bildseite',
    'politician.credit': 'Credit',
    'politician.rawParty': 'Partei im Datensatz',
    'politician.open': 'Öffnen',
    'politician.attributionMissing':
      'Für dieses Bild liegen keine zusätzlichen Attributionen vor.',
    'politician.attributionLocked': 'Die Bild-Attribution wird nach deiner Antwort angezeigt.',
    'common.close': 'Schließen',
    'legal.privacySubtitle': 'Datenschutzerklärung',
    'legal.imprintSubtitle': 'Impressum',
    'country.change': 'Land wechseln',
  },
  en: {
    'app.title': 'Which Party?',
    'app.subtitle': 'Guess the party from the photo',
    'home.brandSubtitle': 'The Photo Game',
    'home.title': 'Can you guess the party from just the photo?',
    'home.subtitle':
      'Pick a country and see how good your political instincts really are.',
    'home.lastPlayed': 'Last played: {country}',
    'home.country.de.desc': 'Bundestag politicians and the main German party labels.',
    'home.country.us.desc':
      'Congress and state legislators with reusable portraits and attribution links.',
    'home.start': 'Start game',
    'nav.stats': 'Statistics',
    'nav.support': 'Support',
    'nav.play': 'Play',
    'nav.home': 'Home',
    'nav.backToGame': 'Back to game',
    'nav.backToStats': 'Back to statistics',
    'common.retry': 'Try again',
    'common.privacy': 'Privacy',
    'common.imprint': 'Imprint',
    'common.loading': 'Loading…',
    'common.notAvailable': '—',
    'settings.open': 'Open settings',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.country': 'Country',
    'settings.current': 'Current',
    'settings.playerName': 'Player name',
    'settings.playerNamePlaceholder': 'Enter a name…',
    'settings.playerNameSaved': 'Saved',
    'settings.playerNameError': 'Max. 19 characters',
    'sound.enable': 'Turn sound on',
    'sound.disable': 'Turn sound off',
    'header.score': 'Score',
    'header.streak': 'Streak',
    'header.best': 'Best',
    'header.spectrum': 'Spectrum',
    'game.connectionError': 'Could not reach the server. Is the backend running?',
    'game.pickParty': 'Pick a party',
    'game.left': '← Left',
    'game.right': 'Right →',
    'game.history': 'Recent answers',
    'game.over.title': 'You guessed everyone in this pool',
    'game.over.subtitle':
      'This session has seen every available politician. Restart or switch to another country.',
    'game.over.points': 'Points',
    'game.over.best': 'Best streak',
    'game.over.answered': 'Answered',
    'game.over.accuracy': 'Spectrum',
    'game.over.support': 'Buy a coffee',
    'game.over.restart': 'Restart',
    'support.title': 'Enjoying the game?',
    'support.text':
      'Which Party? is free. A small coffee helps keep the project online.',
    'support.cta': 'Buy a coffee',
    'support.later': 'Maybe later',
    'promo.label': 'More from the same maker',
    'promo.cta': 'Try it',
    'sticky.label': 'Our apps',
    'sticky.toggle': 'Show or hide app recommendations',
    'cookies.title': 'Cookie settings',
    'cookies.text':
      'We use essential cookies so the app works. With your consent we also use analytics cookies to improve the experience.',
    'cookies.accept': 'Accept all',
    'cookies.decline': 'Essential only',
    'stats.subtitle': 'Statistics',
    'stats.loading': 'Loading statistics…',
    'stats.error': 'Could not load statistics.',
    'stats.answers': 'Answers',
    'stats.accuracy': 'Accuracy',
    'stats.players': 'Players',
    'stats.bestStreak': 'Best streak',
    'stats.leftRight': 'Left / Right accuracy',
    'stats.globalSpectrum': 'Overall spectrum',
    'stats.exact': '{value}% exact',
    'stats.side': '{value}% side',
    'stats.left': '← Left',
    'stats.right': 'Right →',
    'stats.byParty': 'Accuracy by party',
    'stats.matrix': 'Confusion matrix',
    'stats.matrix.actual': 'Actual ↓',
    'stats.matrix.guessed': 'Guessed →',
    'stats.topCorrect': 'Often guessed correctly',
    'stats.topWrong': 'Often guessed wrong',
    'stats.topUsers': 'Leaderboard',
    'stats.you': 'You',
    'stats.confusions': 'Most common confusions',
    'stats.search': 'Search politicians…',
    'stats.noResults': 'No results for "{query}"',
    'politician.subtitle': 'Politician',
    'politician.notFound': 'That politician could not be found.',
    'politician.answers': 'Total answers',
    'politician.guessedAs': 'How people guessed',
    'politician.correct': 'Correct',
    'politician.imageAttribution': 'Image attribution',
    'politician.author': 'Author',
    'politician.license': 'License',
    'politician.sourceImage': 'Image page',
    'politician.credit': 'Credit',
    'politician.rawParty': 'Dataset party',
    'politician.open': 'Open',
    'politician.attributionMissing':
      'No additional attribution metadata is stored for this image.',
    'politician.attributionLocked': 'Image attribution will be shown after you answer.',
    'common.close': 'Close',
    'legal.privacySubtitle': 'Privacy Policy',
    'legal.imprintSubtitle': 'Imprint',
    'country.change': 'Switch country',
  },
};

const LocaleContext = createContext(null);
const CountryContext = createContext(null);
const PlayerNameContext = createContext(null);

function getInitialLocale() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'de' || stored === 'en') {
    return stored;
  }

  return window.navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${vars[key] ?? ''}`);
}

export function getLastCountry() {
  if (typeof window === 'undefined') {
    return DEFAULT_COUNTRY;
  }

  const stored = window.localStorage.getItem(LAST_COUNTRY_KEY);
  return getCountryConfig(stored) ? stored : DEFAULT_COUNTRY;
}

function getInitialPlayerName() {
  return typeof window !== 'undefined' ? window.localStorage.getItem(PLAYER_NAME_KEY) || '' : '';
}

export function PlayerNameProvider({ children }) {
  const [playerName, setPlayerNameState] = useState(getInitialPlayerName);

  const setPlayerName = useCallback((name) => {
    setPlayerNameState(name);
    window.localStorage.setItem(PLAYER_NAME_KEY, name);
  }, []);

  const value = useMemo(() => ({ playerName, setPlayerName }), [playerName, setPlayerName]);

  return <PlayerNameContext.Provider value={value}>{children}</PlayerNameContext.Provider>;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (nextLocale) => setLocaleState(nextLocale === 'de' ? 'de' : 'en'),
      t: (key, vars) => {
        const template = messages[locale]?.[key] || messages.en[key] || key;
        return interpolate(template, vars);
      },
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>
      <PlayerNameProvider>{children}</PlayerNameProvider>
    </LocaleContext.Provider>
  );
}

export function CountryRouteLayout() {
  const { country } = useParams();
  const config = getCountryConfig(country);

  useEffect(() => {
    if (config) {
      window.localStorage.setItem(LAST_COUNTRY_KEY, config.slug);
    }
  }, [config]);

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <CountryContext.Provider value={config}>
      <Outlet />
    </CountryContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return value;
}

export function useCountry() {
  const value = useContext(CountryContext);
  if (!value) {
    throw new Error('useCountry must be used within a country route');
  }
  return value;
}

export function usePlayerName() {
  const value = useContext(PlayerNameContext);
  if (!value) {
    throw new Error('usePlayerName must be used within a PlayerNameProvider');
  }
  return value;
}

export function usePartyHelpers() {
  const { locale } = useI18n();
  const country = useCountry();

  return useMemo(
    () => ({
      partyLabel: (party) => getPartyLabel(country.slug, party, locale),
      partyShortLabel: (party) => getPartyShortLabel(country.slug, party, locale),
      partySlug: (party) => getPartySlug(country.slug, party),
    }),
    [country, locale]
  );
}
