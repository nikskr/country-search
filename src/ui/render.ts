import type { ErrorKind } from '../core/classify-error.js';
import type { SearchState } from '../core/search-controller.js';
import type { CountryCard, CountryDetails } from '../core/types/types.js';
import { el } from './dom.js';

const ERROR_MESSAGES: Record<ErrorKind, string> = {
  aborted: '',
  timeout: 'The server took too long to respond.',
  http: 'The server returned an error.',
  other: 'Something went wrong. Check your internet connection.',
};

const numberFormat = new Intl.NumberFormat('ru-RU');

function fact(label: string, value: string): Node[] {
  return [el('dt', { textContent: label }), el('dd', { textContent: value })];
}

function renderFlag(country: CountryCard): Node {
  if (!country.flag) {
    return el('span', { className: 'card__flag', textContent: '🏳️' });
  }
  return el('img', {
    className: 'card__flag',
    src: country.flag,
    alt: `Flag of ${country.name}`,
    loading: 'lazy',
  });
}

export function renderCard(country: CountryDetails, onOpen: (country: CountryDetails) => void): HTMLLIElement {
  const nameButton = el('button', { type: 'button', className: 'card__name', textContent: country.name });

  const card = el(
    'li',
    { className: 'card' },
    renderFlag(country),
    el('h2', {}, nameButton),
    el(
      'dl',
      { className: 'card__facts' },
      ...fact('Capital', country.capital ?? '—'),
      ...fact('Region', country.region),
      ...fact('Population', numberFormat.format(country.population)),
    ),
  );

  card.addEventListener('click', () => onOpen(country));
  return card;
}

export function renderResults(state: SearchState, onOpen: (country: CountryDetails) => void): Node[] {
  if (state.status !== 'success') return [];
  return state.countries.map((country) => renderCard(country, onOpen));
}

export function renderStatus(state: SearchState, onRetry: () => void): Node[] {
  switch (state.status) {
    case 'idle':
      return [el('p', { className: 'status__text', textContent: 'Start typing a country name.' })];
    case 'loading':
      return [el('p', { className: 'status__text', textContent: `Searching for “${state.query}”…` })];
    case 'empty':
      return [el('p', { className: 'status__text', textContent: `No countries match “${state.query}”.` })];
    case 'success':
      return [el('p', { className: 'status__text', textContent: `${state.countries.length} found` })];
    case 'error': {
      const retryButton = el('button', { type: 'button', className: 'status__retry', textContent: 'Retry' });
      retryButton.addEventListener('click', onRetry);
      return [
        el('p', { className: 'status__text status__text--error', textContent: ERROR_MESSAGES[state.kind] }),
        retryButton,
      ];
    }
  }
}

export function renderDetails(country: CountryDetails): Node[] {
  const list = (items: string[]): string => (items.length > 0 ? items.join(', ') : '—');

  return [
    el('h2', { className: 'details__title' }, renderFlag(country), ` ${country.name}`),
    el('p', { className: 'details__description', textContent: country.description }),
    el(
      'dl',
      { className: 'details__facts' },
      ...fact('Capital', country.capital ?? '—'),
      ...fact('Region', country.subregion ? `${country.region}, ${country.subregion}` : country.region),
      ...fact('Population', numberFormat.format(country.population)),
      ...fact('Area', country.area === null ? '—' : `${numberFormat.format(country.area)} km²`),
      ...fact('Languages', list(country.languages)),
      ...fact('Currencies', list(country.currencies)),
      ...fact('Borders', list(country.borders)),
    ),
  ];
}
