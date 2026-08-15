import { useState } from 'react';

const TREATS = {
  beer: '🍺',
  pretzel: '🥨',
};

export function useSupportTreat() {
  const [treat] = useState(() => (Math.random() < 0.5 ? 'beer' : 'pretzel'));
  return { treat, emoji: TREATS[treat] };
}
