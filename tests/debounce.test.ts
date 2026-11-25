import { debounce } from '../src/core/debounce.js';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls fn once after delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call fn before the delay has passed', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls fn once with the last arguments after rapid calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced('g');
    debounced('ge');
    debounced('ger');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('ger');
  });

  it('restarts the timer on every call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('works again after it fired', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('a');

    debounced('b');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('b');
  });
});
