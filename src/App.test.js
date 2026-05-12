import { getCountryConfig, getPartyLabel } from './config/gameConfig';

test('exposes country config for Germany and the US', () => {
  expect(getCountryConfig('de')?.partyOrder).toContain('SPD');
  expect(getCountryConfig('us')?.partyOrder).toContain('Democratic');
  expect(getPartyLabel('us', 'Republican', 'de')).toBe('Republikaner');
});
