import { debounce } from './core/debounce.js';
import { createSearchController, type SearchState } from './core/search-controller.js';
import type { CountryDetails } from './core/types/types.js';
import { el } from './ui/dom.js';
import { renderDetails, renderResults, renderStatus } from './ui/render.js';

const SEARCH_DELAY_MS = 300;

const input = el('input', {
  className: 'main__input--search',
  type: 'search',
  id: 'search',
  placeholder: 'e.g. Germany',
  autocomplete: 'off',
});
const status = el('p', { className: 'main__status ', ariaLive: 'polite' });
const results = el('ul', { className: 'main__results' });

const dialog = el('dialog', { className: 'details' });
const dialogContent = el('div');
const closeButton = el('button', { type: 'button', className: 'details__close', textContent: 'Close' });
closeButton.addEventListener('click', () => dialog.close());
dialog.append(dialogContent, closeButton);

document.body.append(
  el(
    'main',
    { className: 'main' },
    el('h1', { className: 'main__title', textContent: 'Country Search' }),
    el('label', { className: 'input__label', htmlFor: 'search', textContent: 'Country name' }),
    input,
    status,
    results,
    dialog,
  ),
);

function openDetails(country: CountryDetails): void {
  dialogContent.replaceChildren(...renderDetails(country));
  dialog.showModal();
}

function render(state: SearchState): void {
  status.replaceChildren(...renderStatus(state, () => void controller.retry()));
  results.replaceChildren(...renderResults(state, openDetails));
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
