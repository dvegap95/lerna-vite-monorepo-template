import { act } from 'react';
import CursorPaginatedApi from '@monorepo/common-lib/__tests__/PaginatedApi.to.js';
import type { LabelObj } from '@monorepo/design-hub/common/interfaces/Label';
import { type ResponseInfo } from '@monorepo/common-lib/__tests__/Api.to';
import type { PaginatedData } from '@monorepo/common-lib/hooks/useCursorPaginatedQuery';

import LabelFactory from '@/__tests__/LabelFactory.to';

type RegisterGetAllOptions = Partial<PaginatedData['pagination']>;

export default class LabelApi extends CursorPaginatedApi<LabelObj> {
  get defaultList() {
    return LabelFactory.listDefault(6, (factory, index) => {
      return factory
        .setProps({ templateName: `Label ${index + 1}` })
        .setData({ itemNumber: `${index + 1}` });
    });
  }
  registerGetAll(
    data: LabelObj[] = this.defaultList,
    options: RegisterGetAllOptions = {},
    count?: number,
  ) {
    const { currentCursor, nextCursor, previousCursor, hasMorePages } = options;
    return this.registerPaginatedHandler(
      'get',
      /\/label/,
      () => data,
      count,
      currentCursor,
      nextCursor,
      previousCursor,
      hasMorePages,
    );
  }

  registerPost(handler?: Parameters<typeof this.registerHandler>[2]) {
    return this.registerHandler('post', /\/label/, handler);
  }

  registerManualPostReturnValue<
    T extends object = LabelObj | ResponseInfo<LabelObj>,
  >() {
    const [spy, trigger] = this.registerManualReturnValue<T>('post', /\/label/);
    return [
      spy,
      async (data?: T) => {
        await act(() => trigger(data));
      },
    ] as [typeof spy, (data?: T) => Promise<void>];
  }

  registerPut(handler?: Parameters<typeof this.registerHandler>[2]) {
    return this.registerHandler('put', /\/label/, handler);
  }

  registerGetById(data?: Parameters<typeof this.registerHandler>[2]) {
    return this.registerHandler('get', /\/label\/\w+/, data);
  }

  registerManualGetByIdReturnValue<T extends object = LabelObj>() {
    const [spy, trigger] = this.registerManualReturnValue<T>(
      'get',
      /\/label\/\w+/,
    );
    return [
      spy,
      async (data?: T) => {
        await act(() => trigger(data));
      },
    ] as [typeof spy, (data?: T) => Promise<void>];
  }

  registerDelete(handler?: Parameters<typeof this.registerHandler>[2]) {
    return this.registerHandler('delete', /\/label\/\w+/, handler);
  }
}
