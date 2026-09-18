/**
 * Runs before every Jest test file (wired up by react-scripts). Adds the
 * jest-dom matchers and installs browser APIs that jsdom leaves out so
 * components can render without guarding every call.
 */
import '@testing-library/jest-dom';
import { installDomMocks, resetDomMocks } from './test-utils/dom';

installDomMocks();

beforeEach(() => {
  resetDomMocks();
  sessionStorage.clear();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});
