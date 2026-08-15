import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';

const VALUES_CARDS = [
  {
    id: 'efficiency-vs-inclusion',
    dim:     'Effizienz ↔ Partizipation',
    dim_en:  'Efficiency ↔ Participation',
    q:       'Eine Parkanlage soll saniert werden. Was ist dir wichtiger?',
    q_en:    'A park is being renovated. What matters more to you?',
    context:    'Schnelle Umsetzung durch Beauftragung vs. langer Beteiligungsprozess mit Anwohner:innen.',
    context_en: 'Quick execution by hiring contractors vs. a long participation process with local residents.',
    choices: [
      { key: 'a', text: 'Schnell und einfach umsetzen — das Ergebnis zählt.',                  text_en: 'Get it done quickly — the result is what counts.' },
      { key: 'b', text: 'Erst die Nachbarschaft einbeziehen, auch wenn es länger dauert.',      text_en: 'Involve the neighbourhood first, even if it takes longer.' },
    ],
  },
  {
    id: 'individual-vs-order',
    dim:     'Autonomie ↔ Soziale Ordnung',
    dim_en:  'Autonomy ↔ Social Order',
    q:       'Eine Nachbarschaftsregel soll eingeführt werden. Was passt besser zu dir?',
    q_en:    'A neighbourhood rule is being introduced. Which fits you better?',
    context:    'Z. B. Nachtruhezeiten, Müllregeln oder Gartenordnung.',
    context_en: 'E.g. quiet hours, waste rules, or garden rules.',
    choices: [
      { key: 'a', text: 'Ausnahmen für besondere Situationen sollten möglich sein.',            text_en: 'Exceptions for special situations should be possible.' },
      { key: 'b', text: 'Einheitliche Regeln für alle gelten — das ist gerechter.',             text_en: 'Uniform rules for everyone — that is fairer.' },
    ],
  },
  {
    id: 'solidarity-vs-market',
    dim:     'Solidarität ↔ Wettbewerb',
    dim_en:  'Solidarity ↔ Competition',
    q:       'Ein Kiez-Laden kämpft gegen Supermarktketten ums Überleben. Was spricht dich mehr an?',
    q_en:    'A local shop is fighting to survive against supermarket chains. What appeals to you more?',
    context:    'Öffentliche Subvention für lokale Betriebe vs. freier Markt entscheidet.',
    context_en: 'Public subsidies for local businesses vs. letting the free market decide.',
    choices: [
      { key: 'a', text: 'Lokale Läden gezielt fördern — Vielfalt hat einen Preis.',             text_en: 'Actively support local shops — diversity has a price.' },
      { key: 'b', text: 'Der Markt soll entscheiden — niemand sollte bevorzugt werden.',        text_en: 'Let the market decide — no one should be favoured.' },
    ],
  },
  {
    id: 'stability-vs-change',
    dim:     'Tradition ↔ Offenheit für Wandel',
    dim_en:  'Tradition ↔ Openness to Change',
    q:       'Eine Infrastrukturmaßnahme steht an. Was ist dir wichtiger?',
    q_en:    'An infrastructure project is coming up. What matters more to you?',
    context:    'Z. B. neue Straßenbahnlinie oder Sanierung der alten Buslinien.',
    context_en: 'E.g. a new tram line vs. renovating existing bus routes.',
    choices: [
      { key: 'a', text: 'Bewährte Methoden — weniger Risiko, verlässliche Ergebnisse.',         text_en: 'Proven methods — less risk, reliable results.' },
      { key: 'b', text: 'Innovative Ansätze ausprobieren, auch wenn sie unsicher sind.',        text_en: 'Try innovative approaches, even if uncertain.' },
    ],
  },
  {
    id: 'security-vs-liberty',
    dim:     'Sicherheit ↔ Bürgerrechte',
    dim_en:  'Security ↔ Civil Liberties',
    q:       'Mehr Sicherheit im öffentlichen Raum — was ist dir wichtiger?',
    q_en:    'More safety in public spaces — what matters more to you?',
    context:    'Mehr Befugnisse für Ordnungskräfte vs. stärkere Kontroll- und Rechtsmechanismen.',
    context_en: 'More powers for law enforcement vs. stronger oversight and legal mechanisms.',
    choices: [
      { key: 'a', text: 'Mehr Sicherheit, auch wenn das etwas mehr Überwachung bedeutet.',     text_en: 'More security, even if that means somewhat more surveillance.' },
      { key: 'b', text: 'Überprüfbare Kontrollmechanismen müssen Vorrang haben.',               text_en: 'Verifiable oversight mechanisms must take priority.' },
    ],
  },
  {
    id: 'present-vs-future',
    dim:     'Gegenwart ↔ Zukunftsorientierung',
    dim_en:  'Present ↔ Future Orientation',
    q:       'Der Haushalt ist knapp. Was würdest du priorisieren?',
    q_en:    'The budget is tight. What would you prioritise?',
    context:    'Sofortige Entlastung jetzt — oder Investitionen, die in 10 Jahren wirken.',
    context_en: 'Immediate relief now — or investments that pay off in 10 years.',
    choices: [
      { key: 'a', text: 'Jetzt helfen — bestehende Probleme lösen, nicht verschieben.',         text_en: 'Help now — solve existing problems, don\'t defer them.' },
      { key: 'b', text: 'Investieren — auch wenn es heute Verzicht bedeutet.',                  text_en: 'Invest — even if it means making sacrifices today.' },
    ],
  },
  {
    id: 'central-vs-local',
    dim:     'Zentralisierung ↔ Lokale Autonomie',
    dim_en:  'Centralisation ↔ Local Autonomy',
    q:       'Schullehrpläne sollen angepasst werden. Was bevorzugst du?',
    q_en:    'School curricula are being revised. What do you prefer?',
    context:    'Einheitlicher Standard für alle vs. mehr Spielraum für einzelne Schulen und Bezirke.',
    context_en: 'Uniform standards for all vs. more flexibility for individual schools and districts.',
    choices: [
      { key: 'a', text: 'Einheitliche Standards — gleiche Chancen für alle Kinder.',            text_en: 'Uniform standards — equal opportunities for all children.' },
      { key: 'b', text: 'Schulen und Bezirke sollten mehr Freiheit haben.',                     text_en: 'Schools and districts should have more freedom.' },
    ],
  },
  {
    id: 'speed-vs-protection',
    dim:     'Effizienz ↔ Schutz',
    dim_en:  'Efficiency ↔ Protection',
    q:       'Neue Wohnungen werden dringend gebraucht. Was hat Vorrang?',
    q_en:    'New housing is urgently needed. What takes priority?',
    context:    'Schnelle Genehmigungen und Bau vs. stärkerer Schutz für bestehende Mieter:innen.',
    context_en: 'Fast approvals and construction vs. stronger protection for existing tenants.',
    choices: [
      { key: 'a', text: 'Bauen beschleunigen — mehr Angebot hilft auf Dauer allen.',            text_en: 'Speed up construction — more supply helps everyone in the long run.' },
      { key: 'b', text: 'Bestehende Mieter:innen zuerst schützen.',                             text_en: 'Protect existing tenants first.' },
    ],
  },
];

export { VALUES_CARDS };

export default function ValuesCard({ cardIndex }) {
  const { valuesAnswers, setValuesAnswer, nextStep, prevStep } = useWelchePartei();
  const { locale, t } = useI18n();
  const card = VALUES_CARDS[cardIndex];
  const selected = valuesAnswers[card.id];
  const isEn = locale === 'en';

  function choose(key) {
    setValuesAnswer(card.id, key);
    setTimeout(nextStep, 220);
  }

  return (
    <div className="wp-card wp-card--values">
      <div className="wp-card__tag">{isEn ? card.dim_en : card.dim}</div>

      <div className="wp-card__body">
        <div className="wp-card__left">
          <h2 className="wp-card__question">{isEn ? card.q_en : card.q}</h2>
          <p className="wp-card__context">{isEn ? card.context_en : card.context}</p>
        </div>

        <div className="wp-choices">
          {card.choices.map((c) => (
            <button
              key={c.key}
              className={`wp-choice ${selected === c.key ? 'wp-choice--selected' : ''}`}
              onClick={() => choose(c.key)}
            >
              {isEn ? c.text_en : c.text}
            </button>
          ))}
        </div>
      </div>

      <div className="wp-card__nav">
        <button className="wp-btn wp-btn--ghost" onClick={prevStep}>{t('wp.card.back')}</button>
        {selected && (
          <button className="wp-btn wp-btn--primary" onClick={nextStep}>{t('wp.card.next')}</button>
        )}
      </div>
    </div>
  );
}
