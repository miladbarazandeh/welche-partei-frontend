import { useMemo, useState } from 'react';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';
import SourceQuoteModal from './SourceQuoteModal';
import BuyMeCoffee from './BuyMeCoffee';

// Same threshold as the Gegencheck matching cutoff: a party missing sourced
// positions on more than this many issues reads as mostly empty columns in
// the table, so it's pushed to the end instead of breaking up the
// left-right spectrum ordering of the well-documented parties.
const MAX_MISSING_FOR_FRONT = 5;

function getCellClass(partySlot, userSlot) {
  if (userSlot == null) {
    return partySlot === 0 ? 'wp-cell--yes' : partySlot === 1 ? 'wp-cell--no' : 'wp-cell--neutral';
  }
  if (partySlot === userSlot) return 'wp-cell--match';
  if (partySlot === 2 || userSlot === 2) return 'wp-cell--neutral';
  return 'wp-cell--oppose';
}

export default function QuellenatlasSteam({ positionsWithIssue }) {
  const { data, blindAnswers, prevStep } = useWelchePartei();
  const { locale, t } = useI18n();
  const isEn = locale === 'en';
  const [modal, setModal] = useState(null);

  const { parties, issues } = data || {};

  const posMap = {};
  positionsWithIssue.forEach((pos) => {
    posMap[`${pos.party_id}::${pos.issue?.id}`] = pos;
  });

  // Stable partition, not a full re-sort: parties with enough sourced
  // positions keep their original left-right spectrum order; parties with
  // too few just move as a group to the end, still in their relative order.
  const sortedParties = useMemo(() => {
    if (!parties || !issues) return [];
    const refCount = {};
    positionsWithIssue.forEach((pos) => {
      refCount[pos.party_id] = (refCount[pos.party_id] || 0) + 1;
    });
    const wellCovered = [];
    const fewRefs = [];
    parties.forEach((p) => {
      const missing = issues.length - (refCount[p.id] || 0);
      (missing > MAX_MISSING_FOR_FRONT ? fewRefs : wellCovered).push(p);
    });
    return [...wellCovered, ...fewRefs];
  }, [parties, issues, positionsWithIssue]);

  if (!data) return null;

  const issueToUserSlot = {};
  issues.forEach((issue) => {
    const slot = blindAnswers[issue.question_key];
    if (slot != null) issueToUserSlot[issue.id] = slot;
  });

  return (
    <div className="wp-atlas">
      <span className="wp-atlas__eyebrow">{t('wp.atlas.eyebrow')}</span>
      <h2 className="wp-atlas__title">{t('wp.atlas.title')}</h2>
      <p className="wp-atlas__hint">{t('wp.atlas.hint')}</p>

      <div className="wp-atlas__scroll">
        <table className="wp-atlas__table">
          <thead>
            <tr>
              <th className="wp-atlas__th-issue" />
              {sortedParties.map((p) => (
                <th key={p.id} className="wp-atlas__th-party">
                  <span
                    className="wp-atlas__party-dot"
                    style={{ background: p.color_hex || '#888' }}
                    title={p.name}
                  />
                  <span className="wp-atlas__party-short">{p.short_name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const userSlot = issueToUserSlot[issue.id];
              return (
                <tr key={issue.id}>
                  <td className="wp-atlas__td-issue">{(isEn ? issue.label_en : '') || issue.label_de}</td>
                  {sortedParties.map((party) => {
                    const pos = posMap[`${party.id}::${issue.id}`];
                    if (!pos) {
                      return <td key={party.id} className="wp-atlas__td wp-cell--empty">–</td>;
                    }
                    const cellClass = getCellClass(pos.answer_slot, userSlot ?? null);
                    const label =
                      pos.answer_slot === 0
                        ? (isEn ? issue.yes_label_en : '') || issue.yes_label_de || t('wp.answer.yes')
                        : pos.answer_slot === 1
                        ? (isEn ? issue.no_label_en : '') || issue.no_label_de || t('wp.answer.no')
                        : (isEn ? issue.neutral_label_en : '') || issue.neutral_label_de || t('wp.answer.neutralShort');
                    return (
                      <td
                        key={party.id}
                        className={`wp-atlas__td wp-atlas__td--clickable ${cellClass}`}
                        onClick={() => setModal({ position: pos, issue, party })}
                        title={`${party.short_name}: ${label}`}
                      >
                        <span className="wp-cell__label">{label}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="wp-atlas__nav">
        <button className="wp-btn wp-btn--ghost" onClick={prevStep}>{t('wp.atlas.back')}</button>
      </div>

      <BuyMeCoffee />

      {modal && (
        <SourceQuoteModal
          position={modal.position}
          issue={modal.issue}
          party={modal.party}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
