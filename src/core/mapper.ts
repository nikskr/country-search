import type { CountryCard, CountryDetails, RawCountry, RawCurrency } from './types/types.js';

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

export function mapCountryDetails(raw: RawCountry): CountryDetails {
  return {
    ...mapCountryResponse(raw),
    subregion: raw.subregion ?? null,
    area: raw.area ?? null,
    borders: raw.borders ?? [],
    currencies: raw.currencies?.map(formatCurrency) ?? [],
    description: buildDescription(raw),
  };
}

function formatCurrency(currency: RawCurrency): string {
  return currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name;
}

function buildDescription(raw: RawCountry): string {
  const native = raw.nativeName && raw.nativeName !== raw.name ? ` (${raw.nativeName})` : '';
  const location = raw.subregion ? `${raw.subregion}, ${raw.region}` : raw.region;
  return `${raw.name}${native} is a country in ${location}.`;
}
