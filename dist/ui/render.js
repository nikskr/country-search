import { el } from './dom.js';
const ERROR_MESSAGES = {
    aborted: '',
    timeout: 'The server took too long to respond.',
    http: 'The server returned an error.',
    other: 'Something went wrong. Check your internet connection.',
};
const numberFormat = new Intl.NumberFormat('ru-RU');
function fact(label, value) {
    return [el('dt', { textContent: label }), el('dd', { textContent: value })];
}
function renderFlag(country) {
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
export function renderCard(country) {
    return el('li', { className: 'card' }, renderFlag(country), el('h2', { className: 'card__name', textContent: country.name }), el('dl', { className: 'card__facts' }, ...fact('Capital', country.capital ?? '—'), ...fact('Region', country.region), ...fact('Population', numberFormat.format(country.population))));
}
export function renderResults(state) {
    if (state.status !== 'success')
        return [];
    return state.countries.map(renderCard);
}
export function renderStatus(state, onRetry) {
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
//# sourceMappingURL=render.js.map