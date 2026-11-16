import { el } from './dom.js';
const numberFormat = new Intl.NumberFormat('en-US');
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
//# sourceMappingURL=render.js.map