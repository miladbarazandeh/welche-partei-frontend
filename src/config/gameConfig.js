export const DEFAULT_COUNTRY = 'de';

export const COUNTRY_CONFIG = {
  de: {
    slug: 'de',
    code: 'DE',
    names: {
      de: 'Deutschland',
      en: 'Germany',
    },
    flagColors: ['#111111', '#cc0000', '#ffce00'],
    supportsSpectrum: true,
    partyOrder: ['SPD', 'CDU/CSU', 'Grüne', 'FDP', 'Die Linke', 'AfD'],
    partySlugs: {
      SPD: 'spd',
      'CDU/CSU': 'cducsu',
      'Grüne': 'gruene',
      FDP: 'fdp',
      'Die Linke': 'linke',
      AfD: 'afd',
    },
    partyLabels: {
      de: {
        SPD: 'SPD',
        'CDU/CSU': 'CDU/CSU',
        'Grüne': 'Grüne',
        FDP: 'FDP',
        'Die Linke': 'Die Linke',
        AfD: 'AfD',
      },
      en: {
        SPD: 'SPD',
        'CDU/CSU': 'CDU/CSU',
        'Grüne': 'Greens',
        FDP: 'FDP',
        'Die Linke': 'The Left',
        AfD: 'AfD',
      },
    },
    partyShortLabels: {
      de: {
        SPD: 'SPD',
        'CDU/CSU': 'CDU',
        'Grüne': 'Grüne',
        FDP: 'FDP',
        'Die Linke': 'Linke',
        AfD: 'AfD',
      },
      en: {
        SPD: 'SPD',
        'CDU/CSU': 'CDU',
        'Grüne': 'Greens',
        FDP: 'FDP',
        'Die Linke': 'Left',
        AfD: 'AfD',
      },
    },
  },
  us: {
    slug: 'us',
    code: 'US',
    names: {
      de: 'USA',
      en: 'United States',
    },
    flagColors: ['#1f3a93', '#ffffff', '#b22234'],
    supportsSpectrum: false,
    partyOrder: ['Democratic', 'Republican', 'Independent', 'Other'],
    partySlugs: {
      Democratic: 'democratic',
      Republican: 'republican',
      Independent: 'independent',
      Other: 'other',
    },
    partyLabels: {
      de: {
        Democratic: 'Demokraten',
        Republican: 'Republikaner',
        Independent: 'Unabhängig',
        Other: 'Andere',
      },
      en: {
        Democratic: 'Democratic',
        Republican: 'Republican',
        Independent: 'Independent',
        Other: 'Other',
      },
    },
    partyShortLabels: {
      de: {
        Democratic: 'Dem.',
        Republican: 'Rep.',
        Independent: 'Ind.',
        Other: 'Andere',
      },
      en: {
        Democratic: 'Dem.',
        Republican: 'GOP',
        Independent: 'Ind.',
        Other: 'Other',
      },
    },
  },
};

export const COUNTRY_LIST = Object.values(COUNTRY_CONFIG);

export function getCountryConfig(countrySlug) {
  return COUNTRY_CONFIG[(countrySlug || '').toLowerCase()] || null;
}

export function getCountryName(countrySlug, locale = 'en') {
  const config = getCountryConfig(countrySlug);
  if (!config) {
    return '';
  }
  return config.names[locale] || config.names.en;
}

export function getPartySlug(countrySlug, party) {
  const config = getCountryConfig(countrySlug);
  return config?.partySlugs?.[party] || '';
}

export function getPartyLabel(countrySlug, party, locale = 'en') {
  const config = getCountryConfig(countrySlug);
  return config?.partyLabels?.[locale]?.[party] || config?.partyLabels?.en?.[party] || party;
}

export function getPartyShortLabel(countrySlug, party, locale = 'en') {
  const config = getCountryConfig(countrySlug);
  return (
    config?.partyShortLabels?.[locale]?.[party] ||
    config?.partyShortLabels?.en?.[party] ||
    getPartyLabel(countrySlug, party, locale)
  );
}

