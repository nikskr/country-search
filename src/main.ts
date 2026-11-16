import { debounce } from './core/debounce.js';
import { createSearchController, type SearchState } from './core/search-controller.js';
import { el } from './ui/dom.js';
import { renderResults, renderStatus } from './ui/render.js';

const SEARCH_DELAY_MS = 300;

const input = el('input', { type: 'search', id: 'search', placeholder: 'e.g. Germany', autocomplete: 'off' });
const status = el('p', { className: 'status', ariaLive: 'polite' });
const results = el('ul', { className: 'results' });

document.body.append(
  el(
    'main',
    {},
    el('h1', { textContent: 'Country Search' }),
    el('label', { htmlFor: 'search', textContent: 'Country name' }),
    input,
    status,
    results,
  ),
);

function render(state: SearchState): void {
  status.replaceChildren(...renderStatus(state, () => void controller.retry()));
  results.replaceChildren(...renderResults(state));
}

const controller = createSearchController(render);

const debouncedSearch = debounce(() => {
  void controller.run(input.value);
}, SEARCH_DELAY_MS);

input.addEventListener('input', () => {
  controller.cancel();

  if (input.value.trim() === '') {
    void controller.run('');
    return;
  }

  debouncedSearch();
});

render({ status: 'idle' });
