
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende o expect com os matchers do testing-library
expect.extend(matchers);

// Limpa após cada teste
afterEach(() => {
  cleanup();
});
