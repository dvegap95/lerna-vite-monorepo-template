import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useMemo, useRef } from 'react';
import {
  ReactEmbedConfigContext,
  type ReactEmbedConfigContextType,
} from 'packages/react-embed/src/ReactEmbed';
import { ThemeProvider } from '@mui/material';
import MonorepoMainTheme from '@monorepo/common-lib/themes/MonorepoMainTheme';
import MonorepoMainClass from '@monorepo/common-lib/styles/MonorepoMainClass';
import useSafeContext from '@monorepo/common-lib/hooks/useSafeContext';
import ToastContainer from '@monorepo/common-lib/components/ToastContainer/ToastContainer';

import { HOME_PATH } from '@/common/config/routes';
import AppLayout from '@/app/AppLayout';

import { Container } from './styledApp';

export type AppProps = {
  basePath?: string;
  children?: React.ReactElement;
  routerConfig?: object;
  routerFactory?: typeof createBrowserRouter;
};
const routes = createRoutesFromElements(
  <Route element={<AppLayout />}>
    <Route
      path={HOME_PATH}
      element={
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          BASE PATH
        </div>
      }
    />
  </Route>,
);

function App({
  routerConfig,
  basePath = '/apps/___FTName___',
  routerFactory = createBrowserRouter,
}: AppProps = {}) {
  const router = useMemo(
    () =>
      routerFactory(routes, {
        basename: basePath,
        ...routerConfig,
      }),
    [basePath, routerConfig, routerFactory],
  );

  const cacheContainer = useSafeContext<ReactEmbedConfigContextType>(
    ReactEmbedConfigContext,
  )?.styleRoot;

  const cache = useMemo(
    () =>
      createCache({
        key: 'mui-emotion-cache',
        container: cacheContainer,
      }),
    [cacheContainer],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // TODO: move all the theme and styles logic to WebComponentApp as needed for the next modules
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={MonorepoMainTheme(containerRef.current!)}>
        <Container className={MonorepoMainClass} ref={containerRef}>
          <RouterProvider router={router} />
          <ToastContainer />
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
