import { readLocal, readSession, writeLocal, writeSession } from './storage';

describe('session storage helpers', () => {
  it('round-trips JSON values', () => {
    writeSession('key', { a: 1, b: [true] });
    expect(readSession<{ a: number; b: boolean[] }>('key')).toEqual({ a: 1, b: [true] });
  });

  it('returns null for a missing key', () => {
    expect(readSession('missing')).toBeNull();
  });

  it('returns null for a value that is not JSON', () => {
    sessionStorage.setItem('broken', '{not json');
    expect(readSession('broken')).toBeNull();
  });

  it('ignores write failures', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeSession('key', 1)).not.toThrow();
  });

  it('treats a throwing store as empty', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readSession('key')).toBeNull();
  });
});

describe('local storage helpers', () => {
  it('round-trips strings', () => {
    writeLocal('theme', 'dark');
    expect(readLocal('theme')).toBe('dark');
  });

  it('returns null for a missing key', () => {
    expect(readLocal('missing')).toBeNull();
  });

  it('ignores write failures', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeLocal('theme', 'dark')).not.toThrow();
  });

  it('treats a throwing store as empty', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readLocal('theme')).toBeNull();
  });
});
