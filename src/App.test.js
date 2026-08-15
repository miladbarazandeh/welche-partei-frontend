import { getCountryConfig, getPartyLabel } from './config/gameConfig';
import { generateProfile } from './components/welchepartei/generateProfile';

test('exposes country config for Germany and the US', () => {
  expect(getCountryConfig('de')?.partyOrder).toContain('SPD');
  expect(getCountryConfig('us')?.partyOrder).toContain('Democratic');
  expect(getPartyLabel('us', 'Republican', 'de')).toBe('Republikaner');
});

test('generates a values profile in the selected language', () => {
  const answers = {
    'solidarity-vs-market': 'a',
    'central-vs-local': 'a',
    'efficiency-vs-inclusion': 'a',
  };

  expect(generateProfile(answers, 'de')).toContain('Du setzt auf Solidarität');
  expect(generateProfile(answers, 'en')).toContain('You favour solidarity');
});
