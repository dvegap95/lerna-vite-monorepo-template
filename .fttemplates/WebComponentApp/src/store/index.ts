import { configureStore } from '@reduxjs/toolkit';

// replace with the actual API definition
import { labelApi } from '@/common/api/labelApi';

export function createNewStore({ preloadedState = {} } = {}) {
  return configureStore({
    reducer: {
      [labelApi.reducerPath]: labelApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(labelApi.middleware),
    preloadedState,
  });
}

export default createNewStore();
