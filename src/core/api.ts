import type { RawCountry } from './types/types.js';

export const API_BASE = 'https://countries.dev';
export const REQUEST_TIMEOUT_MS = 8000;

export async function searchCountries(_query: string, _signal: AbortSignal): Promise<RawCountry[]> {
  throw new Error('Not implemented');
}
