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
    'settings.playerNameError': 'Max. 50 Zeichen',
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
    'wp.header.brand': 'Welche Partei?',
    'wp.header.stats': 'Statistik',
    'wp.header.reset': 'Neu starten',
    'wp.header.resetConfirm': 'Sicher?',
    'wp.landing.eyebrow': 'Berlin · Abgeordnetenhaus',
    'wp.landing.title': 'Welche\nPartei?',
    'wp.landing.subtitle': 'Beantworte kurze Fragen zu deinen Werten und Positionen — wir zeigen dir, welche Berliner Partei wirklich zu dir passt. Mit verifizierten Quellen.',
    'wp.landing.flow.values.label': 'Werte',
    'wp.landing.flow.values.desc': '8 Fragen',
    'wp.landing.flow.positions.label': 'Positionen',
    'wp.landing.flow.positions.desc': '15 Themen',
    'wp.landing.flow.result.label': 'Ergebnis',
    'wp.landing.flow.result.desc': 'Dein Match',
    'wp.landing.flow.sources.label': 'Quellen',
    'wp.landing.flow.sources.desc': 'Nachprüfen',
    'wp.landing.resume.label': 'Angefangener Fragebogen',
    'wp.landing.continue': 'Weitermachen',
    'wp.landing.restart': 'Von vorne beginnen',
    'wp.landing.start': 'Jetzt starten',
    'wp.landing.meta.time': '~2 Minuten',
    'wp.landing.meta.anon': 'Anonym',
    'wp.landing.meta.sources': 'Verifizierte Quellen',
    'wp.landing.community': 'Community-Statistik »',
    'wp.landing.privacy': 'Datenschutz',
    'wp.landing.imprint': 'Impressum',
    'wp.progress.values': 'Werte {step}/{total}',
    'wp.progress.question': 'Frage {step}/{total}',
    'wp.progress.gegencheck': 'Gegencheck',
    'wp.progress.atlas': 'Quellenatlas',
    'wp.card.back': '← Zurück',
    'wp.card.next': 'Weiter →',
    'wp.card.skip': 'Überspringen',
    'wp.weight.label': 'Wie wichtig ist dir das?',
    'wp.weight.0': 'Unwichtig',
    'wp.weight.1': 'Relevant',
    'wp.weight.2': 'Wichtig',
    'wp.weight.3': 'K.O.-Kriterium',
    'wp.answer.yes': 'Dafür',
    'wp.answer.no': 'Dagegen',
    'wp.answer.neutral': 'Neutral / egal',
    'wp.answer.neutralShort': 'Neutral',
    'wp.gegencheck.eyebrow': 'Ergebnis',
    'wp.gegencheck.title': 'Dein Gegencheck',
    'wp.gegencheck.answered': '{answered} von {total} Fragen beantwortet',
    'wp.gegencheck.showAtlas': 'Quellen prüfen →',
    'wp.gegencheck.profile.title': 'Dein Werteprofil',
    'wp.gegencheck.profile.empty': 'Beantworte mindestens 3 Wertefragen für dein Profil.',
    'wp.atlas.eyebrow': 'Transparenz',
    'wp.atlas.title': 'Quellenatlas',
    'wp.atlas.hint': 'Tippe auf eine Zelle, um die Quellenangabe zu sehen.',
    'wp.atlas.back': '← Gegencheck',
    'wp.modal.position': 'Position',
    'wp.modal.noSource': 'Kein Quellenzitat hinterlegt.',
    'wp.modal.openSource': 'Quelle öffnen ↗',
    'wp.modal.close': 'Schließen',
    'wp.coffee.title': 'Gefällt dir das Projekt?',
    'wp.coffee.sub': 'Unterstütze die Weiterentwicklung mit einem Kaffee.',
    'wp.coffee.btn': 'Kaffee spendieren →',
    'wp.stats.eyebrow': 'Community',
    'wp.stats.title': 'So hat Berlin geantwortet',
    'wp.stats.subtitle.one': 'Basierend auf {total} abgeschlossenem Fragebogen',
    'wp.stats.subtitle.many': 'Basierend auf {total} abgeschlossenen Fragebögen',
    'wp.stats.empty': 'Noch keine Daten vorhanden. Sei der Erste!',
    'wp.stats.join': 'Jetzt mitmachen →',
    'wp.stats.back': '← Zurück',
    'wp.stats.loading': 'Daten werden geladen…',
    'wp.stats.error': 'Fehler: {error}',
    'wp.stats.summary.mostAgreed': 'Meiste Einigkeit',
    'wp.stats.summary.mostSplit': 'Meiste Spaltung',
    'wp.stats.summary.topics': 'Themen bewertet',
    'wp.stats.summary.topicsOf': 'von 15 möglichen',
    'wp.stats.section.positions': 'Positionen',
    'wp.stats.section.values': 'Werteprofil',
    'wp.stats.weight.ko': 'K.O.',
    'wp.stats.weight.important': 'Wichtig',
    'wp.stats.weight.relevant': 'Relevant',
    'wp.stats.weight.unimportant': 'Unwichtig',
    'wp.progress.preParty': 'Wahlabsicht',
    'wp.preVote.eyebrow': 'Vor dem Quiz',
    'wp.preVote.title': 'Welche Partei würdest du heute wählen?',
    'wp.preVote.subtitle': 'Optional — wir zeigen dir am Ende, ob das Quiz deine Meinung beeinflusst hat.',
    'wp.preVote.continue': 'Weiter →',
    'wp.preVote.skip': 'Überspringen →',
    'wp.gegencheck.postVote.title': 'Welche Partei wirst du wählen?',
    'wp.gegencheck.postVote.hint': 'Hat das Ergebnis deine Wahl beeinflusst?',
    'wp.stats.section.postVote': 'Wahlabsicht nach dem Quiz',
    'wp.stats.postVote.note': 'Basiert auf {total} Antworten',
    'wp.stats.section.voteShift': 'Meinungswechsel: Vorher → Nachher',
    'wp.stats.voteShift.legendDiag': 'Diagonal = keine Änderung',
    'wp.stats.voteShift.legendOff': 'Farbig = Wechsel',
    'wp.stats.voteShift.axis': 'Vorher ↓ / Nachher →',
  },
  en: {
    'app.title': 'Welche Partei?',
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
    'settings.playerNameError': 'Max. 50 characters',
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
      'Welche Partei? is free. A small coffee helps keep the project online.',
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
    'wp.header.brand': 'Welche Partei?',
    'wp.header.stats': 'Stats',
    'wp.header.reset': 'Restart',
    'wp.header.resetConfirm': 'Sure?',
    'wp.landing.eyebrow': 'Berlin · House of Representatives',
    'wp.landing.title': 'Which\nParty?',
    'wp.landing.subtitle': 'Answer a few questions about your values and policy positions — we\'ll show you which Berlin party truly matches you. With verified sources.',
    'wp.landing.flow.values.label': 'Values',
    'wp.landing.flow.values.desc': '8 questions',
    'wp.landing.flow.positions.label': 'Positions',
    'wp.landing.flow.positions.desc': '15 topics',
    'wp.landing.flow.result.label': 'Result',
    'wp.landing.flow.result.desc': 'Your match',
    'wp.landing.flow.sources.label': 'Sources',
    'wp.landing.flow.sources.desc': 'Verify',
    'wp.landing.resume.label': 'Quiz in progress',
    'wp.landing.continue': 'Continue',
    'wp.landing.restart': 'Start over',
    'wp.landing.start': 'Start now',
    'wp.landing.meta.time': '~2 minutes',
    'wp.landing.meta.anon': 'Anonymous',
    'wp.landing.meta.sources': 'Verified sources',
    'wp.landing.community': 'Community stats »',
    'wp.landing.privacy': 'Privacy',
    'wp.landing.imprint': 'Imprint',
    'wp.progress.values': 'Values {step}/{total}',
    'wp.progress.question': 'Question {step}/{total}',
    'wp.progress.gegencheck': 'Results',
    'wp.progress.atlas': 'Source atlas',
    'wp.card.back': '← Back',
    'wp.card.next': 'Next →',
    'wp.card.skip': 'Skip',
    'wp.weight.label': 'How important is this to you?',
    'wp.weight.0': 'Not important',
    'wp.weight.1': 'Relevant',
    'wp.weight.2': 'Important',
    'wp.weight.3': 'Dealbreaker',
    'wp.answer.yes': 'For it',
    'wp.answer.no': 'Against it',
    'wp.answer.neutral': 'Neutral / doesn\'t matter',
    'wp.answer.neutralShort': 'Neutral',
    'wp.gegencheck.eyebrow': 'Results',
    'wp.gegencheck.title': 'Your match',
    'wp.gegencheck.answered': '{answered} of {total} questions answered',
    'wp.gegencheck.showAtlas': 'Check sources →',
    'wp.gegencheck.profile.title': 'Your value profile',
    'wp.gegencheck.profile.empty': 'Answer at least 3 value questions to see your profile.',
    'wp.atlas.eyebrow': 'Transparency',
    'wp.atlas.title': 'Source atlas',
    'wp.atlas.hint': 'Tap a cell to see the source reference.',
    'wp.atlas.back': '← Results',
    'wp.modal.position': 'Position',
    'wp.modal.noSource': 'No source quote available.',
    'wp.modal.openSource': 'Open source ↗',
    'wp.modal.close': 'Close',
    'wp.coffee.title': 'Enjoying the project?',
    'wp.coffee.sub': 'Support further development with a coffee.',
    'wp.coffee.btn': 'Buy a coffee →',
    'wp.stats.eyebrow': 'Community',
    'wp.stats.title': 'How Berlin answered',
    'wp.stats.subtitle.one': 'Based on {total} completed questionnaire',
    'wp.stats.subtitle.many': 'Based on {total} completed questionnaires',
    'wp.stats.empty': 'No data yet. Be the first!',
    'wp.stats.join': 'Take the quiz →',
    'wp.stats.back': '← Back',
    'wp.stats.loading': 'Loading data…',
    'wp.stats.error': 'Error: {error}',
    'wp.stats.summary.mostAgreed': 'Most agreed',
    'wp.stats.summary.mostSplit': 'Most divided',
    'wp.stats.summary.topics': 'Topics rated',
    'wp.stats.summary.topicsOf': 'of 15 possible',
    'wp.stats.section.positions': 'Positions',
    'wp.stats.section.values': 'Value profile',
    'wp.stats.weight.ko': 'Dealbreaker',
    'wp.stats.weight.important': 'Important',
    'wp.stats.weight.relevant': 'Relevant',
    'wp.stats.weight.unimportant': 'Not important',
    'wp.progress.preParty': 'Voting intent',
    'wp.preVote.eyebrow': 'Before the quiz',
    'wp.preVote.title': 'Which party would you vote for today?',
    'wp.preVote.subtitle': 'Optional — we\'ll show you at the end whether the quiz changed your mind.',
    'wp.preVote.continue': 'Continue →',
    'wp.preVote.skip': 'Skip →',
    'wp.gegencheck.postVote.title': 'Which party will you vote for?',
    'wp.gegencheck.postVote.hint': 'Did the result influence your choice?',
    'wp.stats.section.postVote': 'Voting intent after the quiz',
    'wp.stats.postVote.note': 'Based on {total} responses',
    'wp.stats.section.voteShift': 'Mind changes: Before → After',
    'wp.stats.voteShift.legendDiag': 'Diagonal = no change',
    'wp.stats.voteShift.legendOff': 'Coloured = switched',
    'wp.stats.voteShift.axis': 'Before ↓ / After →',
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
