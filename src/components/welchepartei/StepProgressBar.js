import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';

export default function StepProgressBar() {
  const { step, TOTAL_VALUES_STEPS, totalBlindSteps } = useWelchePartei();
  const { t } = useI18n();

  // step layout: 0=landing, 1=pre-party, 2-9=values, 10+=blind questions
  const valuesStart = 2;
  const valuesEnd = valuesStart + TOTAL_VALUES_STEPS;
  const blindEnd = valuesEnd + totalBlindSteps;
  const total = blindEnd + 2;

  let label = '';
  const progressStep = step;
  const progressTotal = total - 1;

  if (step === 0) return null;
  if (step === 1) {
    label = t('wp.progress.preParty') || 'Wahlabsicht';
  } else if (step >= valuesStart && step < valuesEnd) {
    label = t('wp.progress.values', { step: step - valuesStart + 1, total: TOTAL_VALUES_STEPS });
  } else if (step >= valuesEnd && step < blindEnd) {
    label = t('wp.progress.question', { step: step - valuesEnd + 1, total: totalBlindSteps });
  } else if (step === blindEnd) {
    label = t('wp.progress.gegencheck');
  } else {
    label = t('wp.progress.atlas');
  }

  const pct = Math.round((progressStep / progressTotal) * 100);

  return (
    <div className="wp-progress">
      <div className="wp-progress__bar" style={{ width: `${pct}%` }} />
      <span className="wp-progress__label">{label}</span>
    </div>
  );
}
