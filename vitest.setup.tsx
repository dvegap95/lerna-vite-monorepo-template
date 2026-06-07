/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createElement, useEffect } from 'react';
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

vi.mock('ag-grid-react', async () => {
  const actualModule = await vi.importActual('ag-grid-react');
  return {
    ...actualModule,
    AgGridReact: (props: any) =>
      createElement(actualModule.AgGridReact as any, {
        ...props,
        // eslint-disable-next-line spellcheck/spell-checker
        suppressRowVirtualisation: true,
        // eslint-disable-next-line spellcheck/spell-checker
        suppressColumnVirtualisation: true,
      }),
  };
});

// MUI Dialog can hang resetting aria-hidden in jsdom
vi.mock('@mui/material/Dialog', async () => {
  const actualModule = await vi.importActual('@mui/material/Dialog');
  return {
    ...actualModule,
    default: function Dialog(props: any) {
      useEffect(() => {
        if (!props.open) {
          setTimeout(() => {
            document.body
              .querySelector('div:first-of-type')
              ?.removeAttribute('aria-hidden');
          });
        }
      }, [props.open]);

      return createElement(actualModule.default as any, props);
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
