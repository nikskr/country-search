import { describe, expect, it } from 'vitest';
import { HttpError } from '../src/core/errors/errors.js';

describe('HttpError', () => {
  it('is an Error with name, status and readable message', () => {
    const error = new HttpError(503);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('HttpError');
    expect(error.status).toBe(503);
    expect(error.message).toContain('503');
  });
});
