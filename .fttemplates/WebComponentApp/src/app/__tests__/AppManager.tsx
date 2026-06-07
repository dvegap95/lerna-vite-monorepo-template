import { vi } from 'vitest';
import BaseAppManager, {
  mockAppLayout,
  mockStore,
} from '@monorepo/common-lib/__tests__/BaseAppManager.js';

import App from '@/app/App';
import { createNewStore } from '@/store';

vi.mock('@/store', async () => {
  return mockStore(await vi.importActual('@/store'));
});

vi.mock('@/app/AppLayout', async () => {
  return mockAppLayout(await vi.importActual('@/app/AppLayout'));
});

export default class AppManager extends BaseAppManager<
  typeof App,
  typeof createNewStore
> {
  constructor() {
    super(App, createNewStore);
  }
}