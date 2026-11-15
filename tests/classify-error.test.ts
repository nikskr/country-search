import { describe, expect, it } from 'vitest';
import { HttpError } from '../src/core/errors/errors.js';
import { classifyError, shouldShowError, type ErrorKind } from '../src/core/classify-error.js';

describe('classifyError', () => {
  it.each([
    [new DOMException('Aborted', 'AbortError'), 'aborted'],
    [new DOMException('Timed out', 'TimeoutError'), 'timeout'],
    [new HttpError(500), 'http'],
    [new TypeError('Failed to fetch'), 'other'],
  ])('classifies %o as %s', (error, expected) => {
    expect(classifyError(error)).toBe(expected);
  });
});

describe('shouldShowError', () => {
  it.each<ErrorKind>(['timeout', 'http', 'other'])('shows the error for %s', (errorKind) => {
    expect(shouldShowError(errorKind)).toBe(true);
  });

  it('should not show error on abort', () => {
    expect(shouldShowError('aborted')).toBe(false);
  });
});
