import { afterEach, beforeEach, describe, vi, it, expect } from 'vitest';
import { REQUEST_TIMEOUT_MS, searchCountries } from '../src/core/api.js';
import { HttpError } from '../src/core/errors/errors.js';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function hangingFetch() {
  return vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      }),
  );
}

describe('searchCountries', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns the parsed array on 200', async () => {
    const data = [{ name: 'Germany' }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(data)));

    const result = await searchCountries('ger', new AbortController().signal);

    expect(result).toEqual(data);
  });

  it('rejects with AbortError when the user aborts', async () => {
    vi.stubGlobal('fetch', hangingFetch());
    const controller = new AbortController();

    const promise = searchCountries('ger', controller.signal);
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects with TimeoutError when the request takes too long', async () => {
    vi.stubGlobal('fetch', hangingFetch());

    const promise = searchCountries('ger', new AbortController().signal);

    vi.advanceTimersByTime(REQUEST_TIMEOUT_MS);

    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });

  it('calls fetch with the encoded URL and a signal', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])));

    await searchCountries('united states', new AbortController().signal);

    expect(fetch).toHaveBeenCalledWith(
      'https://countries.dev/name/united%20states',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('returns [] on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'Not Found' }, 404)));

    const result = await searchCountries('qqqqqqqq', new AbortController().signal);

    expect(result).toEqual([]);
  });

  it('rejects with HttpError carrying the status on 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'Server error' }, 500)));

    const promise = searchCountries('ger', new AbortController().signal);

    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(promise).rejects.toMatchObject({ status: 500 });
  });

  it('clears the timeout timer after the request settles', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])));

    await searchCountries('ger', new AbortController().signal);

    expect(vi.getTimerCount()).toBe(0);
  });
});
