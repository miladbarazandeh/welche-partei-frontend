import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnalytics, fetchQuizData } from '../lib/welcheparteiApi';
import { useI18n } from '../context/AppContext';
import BuyMeCoffee from '../components/welchepartei/BuyMeCoffee';
import '../welchepartei.css';

const VALUES_LABELS = {
  'efficiency-vs-inclusion': { dim: 'Effizienz ↔ Partizipation',    a: 'Schnell umsetzen',       b: 'Nachbarschaft einbeziehen' },
  'individual-vs-order':     { dim: 'Autonomie ↔ Soziale Ordnung',  a: 'Ausnahmen erlauben',      b: 'Einheitliche Regeln' },
  'solidarity-vs-market':    { dim: 'Solidarität ↔ Wettbewerb',     a: 'Lokale Läden fördern',    b: 'Markt entscheiden lassen' },
  'stability-vs-change':     { dim: 'Tradition ↔ Wandel',           a: 'Bewährte Methoden',       b: 'Innovative Ansätze' },
  'security-vs-liberty':     { dim: 'Sicherheit ↔ Bürgerrechte',    a: 'Mehr Sicherheit',         b: 'Kontrollmechanismen' },
  'present-vs-future':       { dim: 'Gegenwart ↔ Zukunft',          a: 'Jetzt helfen',            b: 'In Zukunft investieren' },
  'central-vs-local':        { dim: 'Zentralisierung ↔ Lokalität',  a: 'Einheitliche Standards',  b: 'Lokale Freiheit' },
  'speed-vs-protection':     { dim: 'Effizienz ↔ Schutz',           a: 'Bauen beschleunigen',     b: 'Mieter:innen schützen' },
};

function OptionBar({ label, pct, color, bg }) {
  return (
    <div className="wp-stats__opt-row">
      <span className="wp-stats__opt-label">{label}</span>
      <div className="wp-stats__opt-track">
        <div
          className="wp-stats__opt-fill"
          style={{ width: `${pct}%`, background: color, boxShadow: pct > 0 ? `0 0 8px ${bg}` : 'none' }}
        />
      </div>
      <span className="wp-stats__opt-pct">{pct}%</span>
    </div>
  );
}

function IssueCard({ issue, answers, weights }) {
  const { locale, t } = useI18n();
  const isEn = locale === 'en';
  const total = (answers.yes || 0) + (answers.no || 0) + (answers.neutral || 0);
  if (total === 0) return null;
  const yesPct  = Math.round((answers.yes     / total) * 100);
  const noPct   = Math.round((answers.no      / total) * 100);
  const neuPct  = 100 - yesPct - noPct;

  const weightTotal = weights ? Object.values(weights).reduce((s, n) => s + n, 0) : 0;

  const weightMeta = [
    { key: '3', label: t('wp.stats.weight.ko'),          color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { key: '2', label: t('wp.stats.weight.important'),   color: '#7c5cfc', bg: 'rgba(124,92,252,0.12)' },
    { key: '1', label: t('wp.stats.weight.relevant'),    color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
    { key: '0', label: t('wp.stats.weight.unimportant'), color: '#374151', bg: 'rgba(55,65,81,0.12)' },
  ];

  return (
    <div className="wp-stats__card">
      <div className="wp-stats__card-label">{(isEn ? issue.label_en : '') || issue.label_de}</div>
      <div className="wp-stats__card-bars">
        <OptionBar label={(isEn ? issue.yes_label_en : '') || issue.yes_label_de || t('wp.answer.yes')}             pct={yesPct}  color="#22c55e" bg="rgba(34,197,94,0.3)" />
        <OptionBar label={(isEn ? issue.no_label_en : '') || issue.no_label_de || t('wp.answer.no')}                pct={noPct}   color="#ef4444" bg="rgba(239,68,68,0.3)" />
        <OptionBar label={(isEn ? issue.neutral_label_en : '') || issue.neutral_label_de || t('wp.answer.neutralShort')} pct={neuPct} color="#4b5563" bg="rgba(75,85,99,0.3)" />
      </div>
      {weightTotal > 0 && (
        <div className="wp-stats__card-weights">
          {weightMeta.map(({ key, label, color, bg }) => {
            const n = weights?.[key] || 0;
            if (n === 0) return null;
            const pct = Math.round((n / weightTotal) * 100);
            return (
              <span key={key} className="wp-stats__weight-chip" style={{ color, background: bg, border: `1px solid ${color}33` }}>
                {label} {pct}%
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ValuesCard({ meta, a, b }) {
  const total = a + b;
  if (total === 0) return null;
  const aPct = Math.round((a / total) * 100);
  const bPct = 100 - aPct;
  const aWins = aPct >= bPct;

  return (
    <div className="wp-stats__card">
      <div className="wp-stats__card-label">{meta.dim}</div>
      <div className="wp-stats__vs-bar">
        <div className="wp-stats__vs-side wp-stats__vs-side--a" style={{ flex: aPct }}>
          <span className="wp-stats__vs-pct" style={{ color: aWins ? '#c4b5fd' : 'var(--text-muted)' }}>{aPct}%</span>
          <span className="wp-stats__vs-name">{meta.a}</span>
        </div>
        <div className="wp-stats__vs-divider" />
        <div className="wp-stats__vs-side wp-stats__vs-side--b" style={{ flex: bPct }}>
          <span className="wp-stats__vs-name">{meta.b}</span>
          <span className="wp-stats__vs-pct" style={{ color: !aWins ? '#c4b5fd' : 'var(--text-muted)' }}>{bPct}%</span>
        </div>
      </div>
      <div className="wp-stats__vs-track">
        <div className="wp-stats__vs-fill" style={{ width: `${aPct}%` }} />
      </div>
    </div>
  );
}

export default function WpStatsPage() {
  const { locale, t } = useI18n();
  const [stats, setStats]     = useState(null);
  const [issues, setIssues]   = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchQuizData()])
      .then(([analytics, data]) => {
        setStats(analytics);
        setIssues(data.issues || []);
        setParties(data.parties || []);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="wp-page wp-page--loading">
        <div className="wp-spinner" />
        <p>{t('wp.stats.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wp-page wp-page--error">
        <p>{t('wp.stats.error', { error })}</p>
        <Link to="/" className="wp-btn wp-btn--ghost wp-btn--sm">{t('wp.stats.back')}</Link>
      </div>
    );
  }

  const total = stats?.total_sessions ?? 0;
  const issueRows = issues.filter((iss) => stats?.issues?.[iss.question_key]);
  const valuesRows = Object.entries(VALUES_LABELS).filter(([id]) => stats?.values?.[id]);

  const issueLabel = (iss) => (locale === 'en' ? iss.label_en : '') || iss.label_de;

  const topIssue = issueRows.reduce((best, iss) => {
    const d = stats.issues[iss.question_key];
    const t2 = d.yes + d.no + d.neutral;
    const top = t2 > 0 ? Math.round((Math.max(d.yes, d.no, d.neutral) / t2) * 100) : 0;
    return top > (best?.pct ?? 0) ? { label: issueLabel(iss), pct: top } : best;
  }, null);

  const splitIssue = issueRows.reduce((best, iss) => {
    const d = stats.issues[iss.question_key];
    const t2 = d.yes + d.no;
    if (t2 === 0) return best;
    const diff = Math.abs(Math.round((d.yes / t2) * 100) - 50);
    return diff < (best?.diff ?? 999) ? { label: issueLabel(iss), diff } : best;
  }, null);

  const subtitleKey = total === 1 ? 'wp.stats.subtitle.one' : 'wp.stats.subtitle.many';

  return (
    <div className="wp-page wp-stats-page">
      <div className="wp-stats__inner">

        <div className="wp-stats__nav">
          <Link to="/" className="wp-btn wp-btn--ghost wp-btn--sm">{t('wp.stats.back')}</Link>
        </div>

        <header className="wp-stats__header">
          <span className="wp-stats__eyebrow">{t('wp.stats.eyebrow')}</span>
          <h1 className="wp-stats__title">{t('wp.stats.title')}</h1>
          <p className="wp-stats__subtitle">
            {t(subtitleKey, { total: total.toLocaleString('de-DE') })}
          </p>
        </header>

        {total === 0 ? (
          <div className="wp-stats__empty">
            <p>{t('wp.stats.empty')}</p>
            <Link to="/" className="wp-btn wp-btn--primary">{t('wp.stats.join')}</Link>
          </div>
        ) : (
          <>

            {issueRows.length > 0 && (
              <section className="wp-stats__section">
                <h2 className="wp-stats__section-title">{t('wp.stats.section.positions')}</h2>
                <div className="wp-stats__grid">
                  {issueRows.map((iss) => (
                    <IssueCard
                      key={iss.id}
                      issue={iss}
                      answers={stats.issues[iss.question_key]}
                      weights={stats.weights?.[iss.question_key]}
                    />
                  ))}
                </div>
              </section>
            )}

            {valuesRows.length > 0 && (
              <section className="wp-stats__section">
                <h2 className="wp-stats__section-title">{t('wp.stats.section.values')}</h2>
                <div className="wp-stats__grid">
                  {valuesRows.map(([id, meta]) => (
                    <ValuesCard
                      key={id}
                      meta={meta}
                      a={stats.values[id].a}
                      b={stats.values[id].b}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Vote intention bar chart ── */}
            {stats?.post_vote && Object.keys(stats.post_vote).length > 0 && (() => {
              const partyMap = Object.fromEntries(parties.map((p) => [p.id, p]));
              const total2 = Object.values(stats.post_vote).reduce((s, n) => s + n, 0);
              const rows = Object.entries(stats.post_vote)
                .sort(([, a], [, b]) => b - a)
                .map(([id, count]) => ({
                  party: partyMap[id],
                  count,
                  pct: total2 > 0 ? Math.round((count / total2) * 100) : 0,
                }))
                .filter((r) => r.party);
              if (rows.length === 0) return null;
              return (
                <section className="wp-stats__section">
                  <h2 className="wp-stats__section-title">
                    {t('wp.stats.section.postVote')}
                  </h2>
                  <div className="wp-stats__card">
                    <div className="wp-vote-bar-list">
                      {rows.map(({ party, count, pct }) => (
                        <div key={party.id} className="wp-vote-bar-row">
                          <span className="wp-vote-bar-row__name">{party.short_name}</span>
                          <div className="wp-vote-bar-row__track">
                            <div
                              className="wp-vote-bar-row__fill"
                              style={{ width: `${pct}%`, background: party.color_hex || '#6b7280' }}
                            />
                          </div>
                          <span className="wp-vote-bar-row__pct">{pct}%</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 12, marginBottom: 0 }}>
                      {t('wp.stats.postVote.note', { total: total2 })}
                    </p>
                  </div>
                </section>
              );
            })()}

            {/* ── Confusion matrix: pre → post ── */}
            {stats?.vote_shift && Object.keys(stats.vote_shift).length > 0 && (() => {
              const partyMap = Object.fromEntries(parties.map((p) => [p.id, p]));
              const preIds = Object.keys(stats.vote_shift);
              const postIds = [...new Set(preIds.flatMap((pre) => Object.keys(stats.vote_shift[pre])))];
              const allIds = [...new Set([...preIds, ...postIds])].filter((id) => partyMap[id]);
              if (allIds.length === 0) return null;
              const maxVal = Math.max(
                1,
                ...preIds.flatMap((pre) => Object.values(stats.vote_shift[pre]))
              );
              return (
                <section className="wp-stats__section">
                  <h2 className="wp-stats__section-title">
                    {t('wp.stats.section.voteShift')}
                  </h2>
                  <div className="wp-stats__card">
                    <div className="wp-confusion">
                      <table className="wp-confusion__table">
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left' }}>
                              <span className="wp-confusion__label-pre">{t('wp.stats.voteShift.axis')}</span>
                            </th>
                            {allIds.map((id) => (
                              <th key={id} style={{ color: partyMap[id]?.color_hex }}>
                                {partyMap[id]?.short_name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allIds.filter((pre) => stats.vote_shift[pre]).map((pre) => (
                            <tr key={pre}>
                              <td className="wp-confusion__row-header" style={{ color: partyMap[pre]?.color_hex }}>
                                {partyMap[pre]?.short_name}
                              </td>
                              {allIds.map((post) => {
                                const val = stats.vote_shift[pre]?.[post] || 0;
                                const isDiag = pre === post;
                                const opacity = val > 0 ? 0.15 + 0.75 * (val / maxVal) : 0;
                                return (
                                  <td
                                    key={post}
                                    className={isDiag ? 'wp-confusion__cell--diagonal' : (val > 0 ? 'wp-confusion__cell--shift' : '')}
                                    style={val > 0 && !isDiag ? { background: `rgba(124,92,252,${opacity})` } : {}}
                                  >
                                    {val > 0 ? val : '—'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="wp-confusion__legend">
                      <span>{t('wp.stats.voteShift.legendDiag')}</span>
                      <span>{t('wp.stats.voteShift.legendOff')}</span>
                    </div>
                  </div>
                </section>
              );
            })()}

            <BuyMeCoffee />
          </>
        )}
      </div>
    </div>
  );
}
