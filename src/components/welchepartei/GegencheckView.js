import { useMemo } from 'react';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';
import { generateProfile } from './generateProfile';
import MatchScoreBar from './MatchScoreBar';
import BuyMeCoffee from './BuyMeCoffee';
import PartyPicker from './PartyPicker';

function computeScores(parties, positions, blindAnswers, weights) {
  return parties.map((party) => {
    let score = 0;
    let maxScore = 0;
    let koFail = false;

    Object.keys(blindAnswers).forEach((questionKey) => {
      const userSlot = blindAnswers[questionKey];
      const weight = weights[questionKey] ?? 1;
      if (weight === 0) return;

      maxScore += weight;

      const pos = positions.find(
        (p) => p.party_id === party.id && p.issue && p.issue.question_key === questionKey
      );
      if (!pos) return;

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
    return { party, pct, koFail, score, maxScore };
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
  const { t } = useI18n();

  const scores = useMemo(() => {
    if (!data) return [];
    return computeScores(data.parties, positionsWithIssue, blindAnswers, weights)
      .sort((a, b) => {
        if (a.koFail !== b.koFail) return a.koFail ? 1 : -1;
        return b.pct - a.pct;
      });
  }, [data, positionsWithIssue, blindAnswers, weights]);

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
            {scores.map(({ party, pct, koFail }, idx) => {
              const fill = koFail ? 0 : Math.round(pct);
              const rank = idx + 1;
              const stripe = party.color_hex || 'transparent';
              return (
                <div
                  key={party.id}
                  className={`wp-match-item ${koFail ? 'wp-match-item--ko' : ''}`}
                  style={{ '--wp-match-stripe': stripe }}
                >
                  <div className="wp-match-item__header">
                    <span className="wp-match-item__rank">
                      {koFail ? '—' : rank}
                    </span>
                    <span
                      className="wp-match-item__dot"
                      style={{ background: stripe }}
                    />
                    <span className="wp-match-item__name">{party.short_name}</span>
                    {koFail ? (
                      <span className="wp-match-item__ko-badge">K.O.</span>
                    ) : (
                      <span className="wp-match-item__pct">{fill}%</span>
                    )}
                  </div>
                  <MatchScoreBar pct={pct} koFail={koFail} />
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
