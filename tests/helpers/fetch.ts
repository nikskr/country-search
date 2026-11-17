import { vi } from 'vitest';

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

export function hangingFetch() {
  return vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      }),
  );
}

export function controllableFetch() {
  const pending = new Map<string, (response: Response) => void>();

  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    return new Promise<Response>((resolve, reject) => {
      const signal = init?.signal;
      signal?.addEventListener('abort', () => reject(signal.reason));
      pending.set(url, resolve);
    });
  });

  function respond(url: string, body: unknown, status = 200): void {
    pending.get(url)?.(jsonResponse(body, status));
  }

  return { fetchMock, respond };
}
