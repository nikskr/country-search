import type { ErrorKind } from './classify-error.js';
import type { CountryCard } from './types/types.js';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; query: string; countries: CountryCard[] }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; kind: ErrorKind };

export interface SearchController {
  cancel(): void;
  run(query: string): Promise<void>;
  retry(): Promise<void>;
}

export function createSearchController(_onState: (state: SearchState) => void): SearchController {
  throw new Error('Not implemented');
}
