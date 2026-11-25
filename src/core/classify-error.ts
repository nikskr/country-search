import { HttpError } from './errors/errors.js';

export type ErrorKind = 'aborted' | 'timeout' | 'http' | 'other';

export function classifyError(error: unknown): ErrorKind {
  if (error instanceof HttpError) return 'http';
  if (error instanceof Error) {
    if (error.name === 'AbortError') return 'aborted';
    if (error.name === 'TimeoutError') return 'timeout';
  }
  return 'other';
}

export function shouldShowError(kind: ErrorKind): boolean {
  return kind !== 'aborted';
}
