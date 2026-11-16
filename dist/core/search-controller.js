import { searchCountries } from './api.js';
import { classifyError, shouldShowError } from './classify-error.js';
import { mapCountryDetails } from './mapper.js';
export function createSearchController(onState) {
    let current = null;
    let lastQuery = '';
    function cancel() {
        current?.abort();
        current = null;
    }
    async function run(query) {
        cancel();
        lastQuery = query;
        if (query.trim() === '') {
            onState({ status: 'idle' });
            return;
        }
        const controller = new AbortController();
        current = controller;
        onState({ status: 'loading', query: query });
        try {
            const raw = await searchCountries(query, controller.signal);
            if (controller.signal.aborted)
                return;
            const countries = raw.map(mapCountryDetails);
            onState(countries.length === 0 ? { status: 'empty', query } : { status: 'success', query, countries });
        }
        catch (error) {
            const kind = classifyError(error);
            if (shouldShowError(kind)) {
                onState({ status: 'error', query, kind });
            }
        }
    }
    async function retry() {
        await run(lastQuery);
    }
    return { cancel, run, retry };
}
//# sourceMappingURL=search-controller.js.map