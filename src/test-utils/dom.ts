/* eslint-disable max-classes-per-file */
/**
 * Browser APIs that jsdom does not implement, installed once for the whole
 * test run. Each mock is controllable from a test: media queries can be
 * flipped, observers can be triggered, and fetch can be scripted.
 */

type Listener = (event: MediaQueryListEvent) => void;

/** Media queries that currently match, keyed by the query string. */
const matchingQueries = new Set<string>();
/** Change listeners registered per query, so tests can fire them. */
const mediaListeners = new Map<string, Set<Listener>>();

/** Makes `matchMedia(query)` report the given result from now on. */
export const setMediaQuery = (query: string, matches: boolean): void => {
  if (matches) {
    matchingQueries.add(query);
  } else {
    matchingQueries.delete(query);
  }
};

/** Fires the change listeners registered for a query with the new result. */
export const fireMediaQueryChange = (query: string, matches: boolean): void => {
  setMediaQuery(query, matches);
  mediaListeners.get(query)?.forEach(listener => {
    listener({ matches, media: query } as MediaQueryListEvent);
  });
};

const matchMedia = (query: string): MediaQueryList => {
  const listeners = mediaListeners.get(query) ?? new Set<Listener>();
  mediaListeners.set(query, listeners);
  return {
    get matches() {
      return matchingQueries.has(query);
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: Listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: Listener) => {
      listeners.delete(listener);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
};

/** Every IntersectionObserver created since the last reset, newest last. */
export const intersectionObservers: MockIntersectionObserver[] = [];

/**
 * Records observed elements and lets a test report them as visible or not.
 * `trigger(true)` marks every observed element as intersecting.
 */
export class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;

  readonly rootMargin = '';

  readonly thresholds: readonly number[] = [];

  readonly elements = new Set<Element>();

  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    intersectionObservers.push(this);
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.disconnected = true;
    this.elements.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Reports every observed element, or the given ones, with the same visibility. */
  trigger(isIntersecting: boolean, elements: Element[] = Array.from(this.elements)): void {
    const entries = elements.map(
      target => ({ target, isIntersecting }) as unknown as IntersectionObserverEntry,
    );
    this.callback(entries, this);
  }
}

/** The observer most recently created, for tests that only render one. */
export const latestObserver = (): MockIntersectionObserver =>
  intersectionObservers[intersectionObservers.length - 1];

/** Every ResizeObserver created since the last reset, newest last. */
export const resizeObservers: MockResizeObserver[] = [];

/** Records observed elements and lets a test fire a resize. */
export class MockResizeObserver implements ResizeObserver {
  readonly elements = new Set<Element>();

  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.push(this);
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.disconnected = true;
    this.elements.clear();
  }

  /** Reports a size change on every observed element; silent once disconnected. */
  trigger(): void {
    if (this.disconnected) {
      return;
    }
    const entries = Array.from(this.elements).map(
      target => ({ target }) as unknown as ResizeObserverEntry,
    );
    this.callback(entries, this);
  }
}

/** The resize observer most recently created. */
export const latestResizeObserver = (): MockResizeObserver =>
  resizeObservers[resizeObservers.length - 1];

const define = (target: object, name: string, value: unknown) => {
  Object.defineProperty(target, name, { configurable: true, writable: true, value });
};

/** jsdom logs an error for pseudo-element queries; it supports the plain form. */
const nativeGetComputedStyle = window.getComputedStyle.bind(window);
const getComputedStyle = (element: Element): CSSStyleDeclaration => nativeGetComputedStyle(element);

/**
 * Installs fresh mocks on the global objects. Called from setupTests before
 * every test so implementations scripted by one test never leak into the next.
 */
export const installDomMocks = (): void => {
  define(window, 'matchMedia', matchMedia);
  define(window, 'IntersectionObserver', MockIntersectionObserver);
  define(window, 'ResizeObserver', MockResizeObserver);
  define(window, 'getComputedStyle', getComputedStyle);
  define(
    window,
    'fetch',
    jest.fn(() => Promise.reject(new Error('fetch not mocked'))),
  );
  define(Element.prototype, 'scrollIntoView', jest.fn());
  define(Element.prototype, 'animate', jest.fn());
  define(
    HTMLMediaElement.prototype,
    'play',
    jest.fn(() => Promise.resolve()),
  );
  define(HTMLMediaElement.prototype, 'pause', jest.fn());
  define(navigator, 'clipboard', { writeText: jest.fn(() => Promise.resolve()) });
};

/** Clears query and observer state and reinstalls the mocks between tests. */
export const resetDomMocks = (): void => {
  matchingQueries.clear();
  mediaListeners.clear();
  intersectionObservers.length = 0;
  resizeObservers.length = 0;
  installDomMocks();
};

/** Builds a Response-like object for `fetch` mocks. */
export const jsonResponse = (body: unknown, ok = true, status = ok ? 200 : 500): Response =>
  ({
    ok,
    status,
    statusText: ok ? 'OK' : 'Internal Server Error',
    json: () => Promise.resolve(body),
  }) as unknown as Response;

/** Scripts the next `fetch` call to resolve with a JSON body. */
export const mockFetchJson = (body: unknown, ok = true): jest.Mock => {
  const mock = window.fetch as jest.Mock;
  mock.mockImplementation(() => Promise.resolve(jsonResponse(body, ok)));
  return mock;
};

/** Scripts the next `fetch` call to reject, as a network failure would. */
export const mockFetchFailure = (): jest.Mock => {
  const mock = window.fetch as jest.Mock;
  mock.mockImplementation(() => Promise.reject(new Error('offline')));
  return mock;
};
