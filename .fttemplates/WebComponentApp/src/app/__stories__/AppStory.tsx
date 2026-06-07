import type { Store } from '@reduxjs/toolkit';
import type React from 'react';
import { createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ReactEmbedConfigContext } from 'packages/react-embed/src/ReactEmbed';

import { TestUiContext, type TestUiData } from '@/common/__storybook__/testUi';
import defaultStore from '@/store';

import App from '../App';

export type AppStoryProps = {
  children?: React.ReactNode;
  route?: string;
  store?: Store;
  testUi?: TestUiData;
};

export default function AppStory({
  store = defaultStore,
  route = '',
  testUi = {},
}: AppStoryProps = {}) {
  return (
    <TestUiContext.Provider value={testUi}>
      <ReactEmbedConfigContext.Provider value={{ styleRoot: document.head }}>
        <Provider store={store}>
          <App
            routerConfig={{ initialEntries: [`${route}`] }}
            basePath=""
            routerFactory={createMemoryRouter}
          />
        </Provider>
      </ReactEmbedConfigContext.Provider>
    </TestUiContext.Provider>
  );
}
