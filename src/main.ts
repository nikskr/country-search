import { debounce } from './core/debounce.js';
import { createSearchController, type SearchState } from './core/search-controller.js';
import { el } from './ui/dom.js';

const SEARCH_DELAY_MS = 300;

const input = el('input', { type: 'search', id: 'search', placeholder: 'e.g. Germany', autocomplete: 'off' });
const status = el('p', { className: 'status', ariaLive: 'polite' });

document.body.append(
  el(
    'main',
    {},
    el('h1', { textContent: 'Country Search' }),
    el('label', { htmlFor: 'search', textContent: 'Country name' }),
    input,
    status,
  ),
);

function statusText(state: SearchState): string {
  switch (state.status) {
    case 'idle':
      return 'Start typing a country name.';
    case 'loading':
      return `Searching for “${state.query}”…`;
    case 'empty':
      return `No countries match “${state.query}”.`;
    case 'error':
      return `Error: ${state.kind}`;
    case 'success':
      return `Found: ${state.countries.map((c) => c.name).join(', ')}`;
  }
}

function render(state: SearchState): void {
  status.textContent = statusText(state);
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
