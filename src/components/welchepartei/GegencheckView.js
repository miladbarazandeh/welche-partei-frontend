import { useMemo } from 'react';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';
import { generateProfile } from './generateProfile';
import MatchScoreBar from './MatchScoreBar';
import BuyMeCoffee from './BuyMeCoffee';
import PartyPicker from './PartyPicker';

// Below this many comparable answers, a percentage is noise: with 1 or 2
// items, a single answer swings the score by 50-100%. RESEARCH.md §D:
// "Do not calculate a candidate rank below a pre-published coverage
// threshold; show the profile and unanswered items instead." This is that
// threshold, published here rather than left implicit.
const MIN_COMPARABLE_ANSWERS = 3;

function computeScores(parties, positions, blindAnswers, weights, issuesByKey, isEn) {
  const totalComparable = Object.keys(blindAnswers).filter((k) => (weights[k] ?? 1) !== 0).length;

  return parties.map((party) => {
    let score = 0;
    let maxScore = 0;
    let koFail = false;
    let comparableCount = 0;
    const missingDecisive = [];

    Object.keys(blindAnswers).forEach((questionKey) => {
      const userSlot = blindAnswers[questionKey];
      const weight = weights[questionKey] ?? 1;
      if (weight === 0) return;

      const pos = positions.find(
        (p) => p.party_id === party.id && p.issue && p.issue.question_key === questionKey
      );

      if (!pos) {
        // No documented position: excluded from both sides of the score, never
        // scored as agreement or disagreement (see RESEARCH.md §D). Flag it
        // separately when it's on an issue the user marked as a dealbreaker,
        // so "no data" is never visually indistinguishable from "disagrees".
        if (weight === 3) {
          const issue = issuesByKey[questionKey];
          const label = issue ? (isEn ? issue.label_en : issue.label_de) || issue.label_de : questionKey;
          missingDecisive.push(label);
        }
        return;
      }

      comparableCount += 1;
      maxScore += weight;
      const partySlot = pos.answer_slot;

      if (partySlot === userSlot) {
        score += weight;
      } else if (partySlot === 2 || userSlot === 2) {
        score += weight * 0.5;
      }

      if (weight === 3 && partySlot !== userSlot && userSlot !== 2 && partySlot !== 2) {
        koFail = true;
      }
    });

    const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const lowCoverage = comparableCount < MIN_COMPARABLE_ANSWERS;
    return { party, pct, koFail, lowCoverage, score, maxScore, comparableCount, totalComparable, missingDecisive };
  });
}

function ValuesProfile({ valuesAnswers }) {
  const { locale, t } = useI18n();
  const profile = generateProfile(valuesAnswers, locale);

  return (
    <div className="wp-values-profile">
      <p className="wp-values-profile__title">{t('wp.gegencheck.profile.title')}</p>
      {profile ? (
        <p className="wp-values-profile__text">{profile}</p>
      ) : (
        <p className="wp-values-profile__empty">
          {t('wp.gegencheck.profile.empty')}
        </p>
      )}
    </div>
  );
}

export default function GegencheckView({ positionsWithIssue }) {
  const { data, blindAnswers, weights, valuesAnswers, nextStep, persistSession, postQuizParty, setPostQuizParty } = useWelchePartei();
  const { locale, t } = useI18n();
  const isEn = locale === 'en';

  const issuesByKey = useMemo(() => {
    const map = {};
    (data?.issues || []).forEach((iss) => { map[iss.question_key] = iss; });
    return map;
  }, [data]);

  // A party missing positions on more than 5 of all issues (not just the ones
  // this user happened to answer) has too little documented material to rank
  // meaningfully at all — computed from the data itself, no backend flag
  // needed. These parties stay visible in the source atlas, just not here.
  const MAX_MISSING_TOTAL = 5;
  const matchableParties = useMemo(() => {
    if (!data) return [];
    const totalIssues = data.issues.length;
    const answeredCountByParty = {};
    positionsWithIssue.forEach((pos) => {
      answeredCountByParty[pos.party_id] = (answeredCountByParty[pos.party_id] || 0) + 1;
    });
    return data.parties.filter((p) => {
      const missing = totalIssues - (answeredCountByParty[p.id] || 0);
      return missing <= MAX_MISSING_TOTAL;
    });
  }, [data, positionsWithIssue]);

  const scores = useMemo(() => {
    if (!data) return [];
    // Ranked normally first; parties with a known dealbreaker conflict next;
    // parties without enough documented answers to rank meaningfully last —
    // "we don't know" is sorted separately from "we know it doesn't fit".
    const group = (s) => (s.koFail ? 1 : s.lowCoverage ? 2 : 0);
    return computeScores(matchableParties, positionsWithIssue, blindAnswers, weights, issuesByKey, isEn)
      .sort((a, b) => {
        const ga = group(a);
        const gb = group(b);
        if (ga !== gb) return ga - gb;
        return b.pct - a.pct;
      });
  }, [data, matchableParties, positionsWithIssue, blindAnswers, weights, issuesByKey, isEn]);

  function handleShowAtlas() {
    persistSession();
    nextStep();
  }

  const answeredCount = Object.keys(blindAnswers).length;

  return (
    <div className="wp-gegencheck">
      <div className="wp-gegencheck__header">
        <span className="wp-gegencheck__eyebrow">{t('wp.gegencheck.eyebrow')}</span>
        <h2 className="wp-gegencheck__title">{t('wp.gegencheck.title')}</h2>
        <p className="wp-gegencheck__sub">
          {t('wp.gegencheck.answered', { answered: answeredCount, total: data?.issues?.length || 15 })}
        </p>
      </div>

      <div className="wp-gegencheck__body">
        <div className="wp-gegencheck__results">
          <div className="wp-match-list">
            {scores.map(({ party, pct, koFail, lowCoverage, comparableCount, totalComparable, missingDecisive }, idx) => {
              const fill = (koFail || lowCoverage) ? 0 : Math.round(pct);
              // Rank only counts parties we can actually compare; koFail/lowCoverage
              // never get a position number, so they can't misrepresent as "1st".
              const rankableBefore = scores.slice(0, idx).filter((s) => !s.koFail && !s.lowCoverage).length;
              const rank = rankableBefore + 1;
              const stripe = party.color_hex || 'transparent';
              const hasMissingDecisive = !koFail && missingDecisive.length > 0;
              return (
                <div
                  key={party.id}
                  className={`wp-match-item ${koFail ? 'wp-match-item--ko' : ''} ${lowCoverage && !koFail ? 'wp-match-item--low-coverage' : ''}`}
                  style={{ '--wp-match-stripe': stripe }}
                >
                  <div className="wp-match-item__header">
                    <span className="wp-match-item__rank">
                      {(koFail || lowCoverage) ? '—' : rank}
                    </span>
                    <span
                      className="wp-match-item__dot"
                      style={{ background: stripe }}
                    />
                    <span className="wp-match-item__name">{party.short_name}</span>
                    {koFail ? (
                      <span className="wp-match-item__ko-badge">K.O.</span>
                    ) : lowCoverage ? (
                      <span className="wp-match-item__nodata-badge">{t('wp.gegencheck.lowCoverageBadge')}</span>
                    ) : (
                      <span className="wp-match-item__pct">{fill}%</span>
                    )}
                  </div>
                  <MatchScoreBar pct={pct} koFail={koFail} lowCoverage={lowCoverage} />
                  <p className="wp-match-item__coverage">
                    {t('wp.gegencheck.coverage', { comparable: comparableCount, total: totalComparable })}
                  </p>
                  {hasMissingDecisive && (
                    <p
                      className="wp-match-item__no-data"
                      title={missingDecisive.join(', ')}
                    >
                      {t('wp.gegencheck.noDataDecisive', { issue: missingDecisive[0] })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="wp-gegencheck__profile">
          <ValuesProfile valuesAnswers={valuesAnswers} />
        </div>
      </div>

      {data?.parties && (
        <div className="wp-party-picker-section">
          <p className="wp-party-picker-section__title">
            {t('wp.gegencheck.postVote.title')}
          </p>
          <p className="wp-party-picker-section__hint">
            {t('wp.gegencheck.postVote.hint')}
          </p>
          <PartyPicker
            parties={data.parties}
            selected={postQuizParty}
            onSelect={setPostQuizParty}
          />
        </div>
      )}

      <div className="wp-gegencheck__actions">
        <button className="wp-btn wp-btn--primary" onClick={handleShowAtlas}>
          {t('wp.gegencheck.showAtlas')}
        </button>
      </div>

      <BuyMeCoffee />
    </div>
  );
}
