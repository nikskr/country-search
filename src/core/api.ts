import { HttpError } from './errors/errors.js';
import type { RawCountry } from './types/types.js';

export const API_BASE = 'https://countries.dev';
export const REQUEST_TIMEOUT_MS = 8000;

export async function searchCountries(query: string, signal: AbortSignal): Promise<RawCountry[]> {
  const timeoutController = new AbortController();
  const timerId = setTimeout(() => {
    timeoutController.abort(new DOMException('Request timed out', 'TimeoutError'));
  }, REQUEST_TIMEOUT_MS);

  const combinedSignal = AbortSignal.any([signal, timeoutController.signal]);

  try {
    const url = `${API_BASE}/name/${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal: combinedSignal });

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new HttpError(response.status);
    }

    return (await response.json()) as RawCountry[];
  } finally {
    clearTimeout(timerId);
  }
}
