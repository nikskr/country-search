import { HttpError } from './errors/errors.js';
export function classifyError(error) {
    if (error instanceof HttpError)
        return 'http';
    if (error instanceof Error) {
        if (error.name === 'AbortError')
            return 'aborted';
        if (error.name === 'TimeoutError')
            return 'timeout';
    }
    return 'other';
}
export function shouldShowError(kind) {
    return kind !== 'aborted';
}
//# sourceMappingURL=classify-error.js.map