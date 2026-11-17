import { describe, expect, it } from 'vitest';
import { mapCountryDetails, mapCountryResponse } from '../src/core/mapper.js';
import type { RawCountry } from '../src/core/types/types.js';
import countries from './fixtures/countries-ger.json' with { type: 'json' };

const rawGermany = (countries as RawCountry[]).find((c) => c.alpha3Code === 'DEU')!;

describe('mapCountryResponse', () => {
  it('maps an API object to card data', () => {
    expect(mapCountryResponse(rawGermany)).toEqual({
      name: 'Germany',
      flag: 'https://flagcdn.com/de.svg',
      capital: 'Berlin',
      region: 'Europe',
      population: 83240525,
      languages: ['German'],
    });
  });

  it('returns null capital when the country has none', () => {
    const { capital: _capital, ...withoutCapital } = rawGermany;
    expect(mapCountryResponse(withoutCapital).capital).toBeNull();
  });

  it('returns empty array when languages are missing', () => {
    const { languages: _languages, ...withouthLanguages } = rawGermany;
    expect(mapCountryResponse(withouthLanguages).languages).toEqual([]);
  });

  it('returns string array of several languages', () => {
    const raw = { ...rawGermany, languages: [{ name: 'French' }, { name: 'German' }] };
    expect(mapCountryResponse(raw).languages).toEqual(['French', 'German']);
  });

  it('falls back to the png flag when svg is missing', () => {
    const raw = { ...rawGermany, flags: { png: 'https://flagcdn.com/w320/de.png' } };

    expect(mapCountryResponse(raw).flag).toBe('https://flagcdn.com/w320/de.png');
  });

  it('does not mutate the input', () => {
    const copy = structuredClone(rawGermany);

    mapCountryResponse(rawGermany);

    expect(rawGermany).toEqual(copy);
  });
});

describe('mapCountryDetails', () => {
  it('maps an API object to detail data', () => {
    expect(mapCountryDetails(rawGermany)).toEqual({
      name: 'Germany',
      flag: 'https://flagcdn.com/de.svg',
      capital: 'Berlin',
      region: 'Europe',
      population: 83240525,
      languages: ['German'],
      subregion: 'Central Europe',
      area: 357114,
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      currencies: ['Euro (€)'],
      description: 'Germany (Deutschland) is a country in Central Europe, Europe.',
    });
  });

  it('keeps an area of 0 instead of turning it into null', () => {
    expect(mapCountryDetails({ ...rawGermany, area: 0 }).area).toBe(0);
  });
});
