/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, useEffect } from 'react';
import { vi } from 'vitest';

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
