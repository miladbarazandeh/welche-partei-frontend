// Generates a unique 3-sentence profile paragraph from the 8 values-card answers.
//
// The 8 cards are grouped into 3 thematic clusters:
//   A (Staat & Wirtschaft):  solidarity-vs-market (3) + central-vs-local (7)    → 4 combos
//   B (Werte & Zeit):        efficiency-vs-inclusion (1) + stability-vs-change (4) + present-vs-future (6) → 8 combos
//   C (Rechte & Wohnen):     individual-vs-order (2) + security-vs-liberty (5) + speed-vs-protection (8) → 8 combos
//
// Total: 4 × 8 × 8 = 256 unique paragraphs.

// ─── Card IDs (must match VALUES_CARDS in ValuesCard.js) ─────────────────────
const E = 'efficiency-vs-inclusion';   // Group B
const I = 'individual-vs-order';       // Group C
const S = 'solidarity-vs-market';      // Group A
const ST = 'stability-vs-change';      // Group B
const SEC = 'security-vs-liberty';     // Group C
const P = 'present-vs-future';         // Group B
const C = 'central-vs-local';          // Group A
const SP = 'speed-vs-protection';      // Group C

// ─── Group A: Staat & Wirtschaft (S × C) ─────────────────────────────────────
// key: `${s}${c}` where s and c are 'a' or 'b'
const GROUP_A = {
  aa: 'Du setzt auf Solidarität und einheitliche Standards — Staat und Gesellschaft sollen gemeinsam für Chancengleichheit sorgen.',
  ab: 'Solidarität ja, aber lokal organisiert: du vertraust auf Gemeinschaften, die füreinander einstehen, ohne dass alles zentral geregelt wird.',
  ba: 'Du glaubst an klare Spielregeln und verbindliche Rahmenbedingungen — innerhalb derer der Markt dann selbst entscheiden soll.',
  bb: 'Freiheit und Eigenverantwortung ziehen sich durch deine Haltung: weder der Staat noch der Markt, sondern lokale Akteure sollen den Ton angeben.',
};

// ─── Group B: Werte & Zeit (E × ST × P) ─────────────────────────────────────
// key: `${e}${st}${p}`
const GROUP_B = {
  aaa: 'Du schätzt Verlässlichkeit und pragmatisches Handeln — bewährte Strukturen, die heute wirken, sind dir lieber als ungewisse Experimente.',
  aab: 'Du willst schnell und bedächtig zugleich handeln: solide Methoden jetzt, aber mit dem Blick auf das, was langfristig trägt.',
  aba: 'Du bist ein pragmatischer Innovator: neue Wege gern, aber bitte zügig und ohne endlose Diskussionen.',
  abb: 'Fortschritt durch Taten — du kombinierst Offenheit für Neues mit dem Willen, heute zu investieren, auch wenn der Ertrag auf sich warten lässt.',
  baa: 'Mitbestimmung ist dir wichtig, aber du hast keine Geduld für ferne Versprechen — du willst, dass Menschen jetzt gehört werden und jetzt etwas spüren.',
  bab: 'Du nimmst dir Zeit: für Beteiligung, für bewährte Wege und für Investitionen, die langfristig tragen — auch wenn das heute Geduld kostet.',
  bba: 'Veränderung ja, aber gemeinsam: du willst Wandel nicht von oben verordnen, sondern ihn getragen wissen — und das möglichst bald.',
  bbb: 'Du verbindest demokratische Beteiligung mit einer Bereitschaft, in die Zukunft zu investieren — Wandel soll nicht verordnet, sondern gemeinsam gestaltet sein.',
};

// ─── Group C: Rechte & Wohnen (I × SEC × SP) ────────────────────────────────
// key: `${i}${sec}${sp}`
const GROUP_C = {
  aaa: 'Im Alltag willst du Flexibilität statt starrer Regeln, nimmst für mehr Sicherheit im öffentlichen Raum auch Kompromisse bei Bürgerrechten in Kauf — und beim Wohnen zählt für dich, dass schnell mehr entsteht.',
  aab: 'Du willst individuelle Spielräume und bist bereit, für Sicherheit mehr zuzulassen — aber bestehende Mieter:innen sollen dabei nicht auf der Strecke bleiben.',
  aba: 'Flexibilität im Alltag und Freiheitsrechte in der Verfassung: du lehnst pauschale Überwachung ab, setzt beim Wohnen aber auf mehr Angebot statt auf Schutzregeln.',
  abb: 'Freiheit ist für dich kein Schlagwort — du willst selbst entscheiden, kontrollierbare Institutionen und Schutz für die, die schon lange da sind.',
  baa: 'Klare Regeln und Sicherheit geben dir Stabilität — du schätzt Verbindlichkeit, nimmst mehr Überwachung in Kauf und willst, dass die Stadt schnell wächst.',
  bab: 'Du lebst gern nach verbindlichen Regeln und akzeptierst Überwachung, wenn sie das Miteinander sicherer macht — aber Bestandsmieter:innen sollen dabei geschützt bleiben.',
  bba: 'Regelorientiert, aber mit Prinzipien: du schätzt Ordnung, ohne auf Bürgerrechte zu verzichten, und willst, dass Bauen schneller vorangeht.',
  bbb: 'Du stehst für eine ordentliche, rechtsstaatliche Stadt: klare Regeln, kontrollierbare Behörden und Schutz für Mieter:innen, die schon lange da sind.',
};

const GROUP_A_EN = {
  aa: 'You favour solidarity and consistent standards — the state and society should work together to ensure equal opportunities.',
  ab: 'You value solidarity, but organised locally: you trust communities to support one another without everything being centrally regulated.',
  ba: 'You believe in clear rules and binding frameworks — within them, the market should be free to make its own decisions.',
  bb: 'Freedom and personal responsibility shape your outlook: neither the state nor the market, but local actors should set the tone.',
};

const GROUP_B_EN = {
  aaa: 'You value reliability and pragmatic action — proven structures that work today matter more to you than uncertain experiments.',
  aab: 'You want to act quickly and thoughtfully: solid methods now, while keeping an eye on what will last in the long term.',
  aba: 'You are a pragmatic innovator: open to new approaches, but please move quickly and avoid endless discussion.',
  abb: 'Progress through action — you combine openness to new ideas with a willingness to invest today, even when the payoff takes time.',
  baa: 'Participation matters to you, but you have little patience for distant promises — you want people to be heard and see change now.',
  bab: 'You take your time: for participation, proven approaches and long-term investment — even when that requires patience today.',
  bba: 'You support change, but together: you do not want it imposed from above, and you want it to happen soon.',
  bbb: 'You combine democratic participation with a willingness to invest in the future — change should be shared, not imposed.',
};

const GROUP_C_EN = {
  aaa: 'In daily life you prefer flexibility to rigid rules, accept trade-offs in civil liberties for greater public safety, and want housing to be built faster.',
  aab: 'You want individual freedom and are willing to allow more for safety — but existing tenants should not be left behind.',
  aba: 'You want flexibility in everyday life and civil liberties in the constitution: you reject blanket surveillance, while favouring more housing supply over protection rules.',
  abb: 'Freedom is more than a slogan to you — you want to decide for yourself, accountable institutions and protection for long-standing residents.',
  baa: 'Clear rules and safety give you stability — you value reliability, accept more surveillance and want the city to grow quickly.',
  bab: 'You prefer clear rules and accept surveillance when it makes life together safer — but existing tenants should be protected.',
  bba: 'You value rules, but with principles: you appreciate order without giving up civil liberties, and want housing construction to move faster.',
  bbb: 'You stand for an orderly city governed by the rule of law: clear rules, accountable authorities and protection for long-standing tenants.',
};

/**
 * Generates a unique profile paragraph from an answers map.
 * @param {Object} valuesAnswers - { [cardId]: 'a' | 'b' }
 * @param {'de' | 'en'} locale - language for the generated text
 * @returns {string | null} - paragraph, or null if fewer than 3 cards answered
 */
export function generateProfile(valuesAnswers, locale = 'de') {
  const s   = valuesAnswers[S]   || null;
  const c   = valuesAnswers[C]   || null;
  const e   = valuesAnswers[E]   || null;
  const st  = valuesAnswers[ST]  || null;
  const p   = valuesAnswers[P]   || null;
  const i   = valuesAnswers[I]   || null;
  const sec = valuesAnswers[SEC] || null;
  const sp  = valuesAnswers[SP]  || null;

  const answeredCount = [s, c, e, st, p, i, sec, sp].filter(Boolean).length;
  if (answeredCount < 3) return null;

  const groups = locale === 'en'
    ? { a: GROUP_A_EN, b: GROUP_B_EN, c: GROUP_C_EN }
    : { a: GROUP_A, b: GROUP_B, c: GROUP_C };

  const sentenceA = s && c       ? groups.a[`${s}${c}`]          : null;
  const sentenceB = e && st && p ? groups.b[`${e}${st}${p}`]     : null;
  const sentenceC = i && sec && sp ? groups.c[`${i}${sec}${sp}`] : null;

  const parts = [sentenceB, sentenceA, sentenceC].filter(Boolean);
  return parts.join(' ');
}
