import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE } from '../src/core/api.js';
import type { RawCountry } from '../src/core/types/types.js';
import countries from './fixtures/countries-ger.json' with { type: 'json' };
import { controllableFetch } from './helpers/fetch.js';
import { createSearchController, type SearchState } from '../src/core/search-controller.js';
import { mapCountryDetails } from '../src/core/mapper.js';

const germany = (countries as RawCountry[]).find((c) => c.alpha3Code === 'DEU')!;
const staleCountry: RawCountry = { ...germany, name: 'Stale result' };
const url = (q: string) => `${API_BASE}/name/${encodeURIComponent(q)}`;

describe('search controller: race condition', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows only the latest query result when an earlier response arrives late', async () => {
    const { fetchMock, respond } = controllableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const states: SearchState[] = [];
    const controller = createSearchController((state) => states.push(state));

    const first = controller.run('ge');
    const second = controller.run('ger');

    respond(url('ger'), [germany]);
    respond(url('ge'), [staleCountry]);
    await Promise.all([first, second]);

    const firstSignal = fetchMock.mock.calls[0]![1]?.signal;
    expect(firstSignal?.aborted).toBe(true);

    expect(states.at(-1)).toEqual({
      status: 'success',
      query: 'ger',
      countries: [mapCountryDetails(germany)],
    });

    expect(states.some((s) => s.status === 'success' && s.query === 'ge')).toBe(false);
    expect(states.some((s) => s.status === 'error')).toBe(false);
  });
});
