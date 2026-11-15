export type ErrorKind = 'aborted' | 'timeout' | 'http' | 'other';

export function classifyError(_error: unknown): ErrorKind {
  throw new Error('Not implemented');
}

export function shouldShowError(_kind: ErrorKind): boolean {
  throw new Error('Not implemented');
}
