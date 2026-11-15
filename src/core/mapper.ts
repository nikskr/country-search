import type { CountryCard, RawCountry } from './types/types.js';

export function mapCountryResponse(raw: RawCountry): CountryCard {
  return {
    name: raw.name,
    flag: raw.flags?.svg ?? raw.flags?.png ?? '',
    capital: raw.capital ?? null,
    region: raw.region,
    population: raw.population,
    languages: raw.languages?.map((lang) => lang.name) ?? [],
  };
}
