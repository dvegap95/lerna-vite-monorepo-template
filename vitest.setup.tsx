/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { vi } from 'vitest';
import { config } from 'react-transition-group';
import { DynamicConfigContext } from 'packages/common-lib/src/utils/dynamicConfig';

import { extendComponentTestObjectMatchers } from './packages/common-lib/src/__tests__/ComponentTestObjectMatchers';
import ApiTestObject from './packages/common-lib/src/__tests__/Api.to';

config.disabled = true;
console.warn = vi.fn();
const originalError = console.error;
console.error = vi.fn((...args) => {
  if (
    args.some((arg) => typeof arg === 'string' && arg.includes('act(() =>'))
  ) {
    return;
  } else {
    originalError(...args);
  }
});

const mockedDynamicConfig = {
  app: {
    backendBaseUrl: 'http://localhost:3000',
  },
};
vi.mock('@monorepo/common-lib/utils/dynamicConfig', async () => {
  const { ...actualModule } = await vi.importActual(
    '@monorepo/common-lib/utils/dynamicConfig',
  );
  return {
    ...actualModule,
    getDynamicConfig: () => mockedDynamicConfig,
    default: (props: { children: React.ReactNode }) => {
      return (
        <DynamicConfigContext.Provider value={mockedDynamicConfig}>
          {props.children}
        </DynamicConfigContext.Provider>
      );
    },
  };
});

ApiTestObject.createCallback = vi.fn;

HTMLCanvasElement.prototype.getContext = (() => ({
  measureText: () => ({ width: 0 }),
  save: () => vi.fn(),
  restore: () => vi.fn(),
  clearRect: () => vi.fn(),
  fillRect: () => vi.fn(),
  translate: () => vi.fn(),
})) as any;
HTMLCanvasElement.prototype.toDataURL = () => '';

extendComponentTestObjectMatchers();
