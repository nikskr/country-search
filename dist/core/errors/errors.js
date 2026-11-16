export class HttpError extends Error {
    status;
    constructor(status) {
        super(`Request failed with status ${status}`);
        this.name = 'HttpError';
        this.status = status;
    }
}
//# sourceMappingURL=errors.js.map