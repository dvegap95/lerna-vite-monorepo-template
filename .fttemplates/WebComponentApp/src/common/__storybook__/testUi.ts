import { createContext } from 'react';

import useSafeContext from '@/hooks/useSafeContext';

export type TestUiData = {
  //TODO: add properties here
  someFlag?: boolean;
};

export const TestUiContext = createContext<TestUiData>({});

export const useTestUi = () => useSafeContext(TestUiContext) || {};
