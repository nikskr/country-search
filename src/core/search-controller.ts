import { searchCountries } from './api.js';
import { classifyError, shouldShowError, type ErrorKind } from './classify-error.js';
import { mapCountryDetails } from './mapper.js';
import type { CountryDetails } from './types/types.js';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; query: string; countries: CountryDetails[] }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; kind: ErrorKind };

export interface SearchController {
  cancel(): void;
  run(query: string): Promise<void>;
  retry(): Promise<void>;
}

export function createSearchController(onState: (state: SearchState) => void): SearchController {
  let current: AbortController | null = null;
  let lastQuery = '';

  function cancel(): void {
    current?.abort();
    current = null;
  }

  async function run(query: string): Promise<void> {
    cancel();
    lastQuery = query;

    if (query.trim() === '') {
      onState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    current = controller;
    onState({ status: 'loading', query: query });

    try {
      const raw = await searchCountries(query, controller.signal);

      if (controller.signal.aborted) return;

      const countries = raw.map(mapCountryDetails);

      onState(countries.length === 0 ? { status: 'empty', query } : { status: 'success', query, countries });
    } catch (error) {
      const kind = classifyError(error);
      if (shouldShowError(kind)) {
        onState({ status: 'error', query, kind });
      }
    }
  }

  async function retry(): Promise<void> {
    await run(lastQuery);
  }

  return { cancel, run, retry };
}
