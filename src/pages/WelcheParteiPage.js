import { useMemo } from 'react';
import '../welchepartei.css';
import BlindQuestionCard from '../components/welchepartei/BlindQuestionCard';
import GegencheckView from '../components/welchepartei/GegencheckView';
import PreQuizPartyStep from '../components/welchepartei/PreQuizPartyStep';
import QuellenatlasSteam from '../components/welchepartei/QuellenatlasSteam';
import StepProgressBar from '../components/welchepartei/StepProgressBar';
import ValuesCard from '../components/welchepartei/ValuesCard';
import WpLanding from '../components/welchepartei/WpLanding';
import WpHeader from '../components/welchepartei/WpHeader';
import { WelcheParteiProvider, useWelchePartei } from '../context/WelcheParteiContext';

function WelcheParteiInner() {
  const { data, loading, error, step, TOTAL_VALUES_STEPS } = useWelchePartei();

  // step layout: 0=landing, 1=pre-party, 2-9=values (8 cards), 10+=blind questions
  const prePartyStep = 1;
  const valuesStart = 2;
  const valuesEnd = valuesStart + TOTAL_VALUES_STEPS; // exclusive: 10

  const positionsWithIssue = useMemo(() => {
    if (!data) return [];
    const issueMap = {};
    data.issues.forEach((iss) => { issueMap[iss.id] = iss; });
    return data.positions.map((pos) => ({
      ...pos,
      issue: issueMap[pos.issue_id] || null,
    }));
  }, [data]);

  const blindEnd = data ? valuesEnd + data.issues.length : valuesEnd + 15;
  const gegencheckStep = blindEnd;
  const atlasStep = blindEnd + 1;

  if (loading) {
    return (
      <div className="wp-page wp-page--loading">
        <div className="wp-spinner" />
        <p>Daten werden geladen…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wp-page wp-page--error">
        <p>Fehler beim Laden: {error}</p>
      </div>
    );
  }

  function renderStep() {
    if (step === 0) return <WpLanding />;

    if (step === prePartyStep) return <PreQuizPartyStep />;

    if (step >= valuesStart && step < valuesEnd) {
      return <ValuesCard cardIndex={step - valuesStart} />;
    }

    if (step >= valuesEnd && step < blindEnd && data) {
      const issueIndex = step - valuesEnd;
      const issue = data.issues[issueIndex];
      if (!issue) return null;
      return <BlindQuestionCard key={issue.id} issue={issue} />;
    }

    if (step === gegencheckStep) {
      return <GegencheckView positionsWithIssue={positionsWithIssue} />;
    }

    if (step === atlasStep) {
      return <QuellenatlasSteam positionsWithIssue={positionsWithIssue} />;
    }

    return null;
  }

  return (
    <div className="wp-page">
      <WpHeader />
      <StepProgressBar />
      <div className="wp-page__content">
        {renderStep()}
      </div>
    </div>
  );
}

export default function WelcheParteiPage() {
  return (
    <WelcheParteiProvider>
      <WelcheParteiInner />
    </WelcheParteiProvider>
  );
}
