export interface RawLanguage {
  name: string;
}

export interface RawCurrency {
  code: string;
  name: string;
  symbol?: string;
}

export interface RawCountry {
  name: string;
  alpha3Code: string;
  flag?: string;
  flags?: { svg?: string; png?: string };
  capital?: string;
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  borders?: string[];
  languages?: RawLanguage[];
  currencies?: RawCurrency[];
  nativeName?: string;
}

export interface CountryCard {
  name: string;
  flag: string;
  capital: string | null;
  region: string;
  population: number;
  languages: string[];
}
