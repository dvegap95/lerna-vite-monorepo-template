import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LabelObj } from '@monorepo/design-hub/common/classes/Label';
import type { PaginatedData } from '@monorepo/common-lib/hooks/useCursorPaginatedQuery';
import { urlWithParams } from '@monorepo/common-lib/utils/urlParams';

import { API_BASE_URL, ITEM_LIST_ENDPOINT } from '../config/endpoints';

type LabelUrlParams = {
  businessId?: string;
  currentCursor?: string;
  multiStoreId?: string;
  storeId?: string;
  userId?: string;
};
// replace with the actual API definition
export const labelApi = createApi({
  reducerPath: 'labelApi',
  tagTypes: ['LabelList', 'label'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}${ITEM_LIST_ENDPOINT}`,
  }),
  endpoints: (builder) => ({
    getLabels: builder.query<PaginatedData<LabelObj>, LabelUrlParams>({
      query: ({ businessId, multiStoreId, currentCursor: cursor }) =>
        urlWithParams('', { businessId, multiStoreId, cursor }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      serializeQueryArgs: ({ queryArgs: { currentCursor, ...args } }) => args,
      merge(oldData, newData) {
        // append new data to the end of the list
        if (
          oldData.pagination.nextCursor &&
          oldData.pagination.nextCursor === newData.pagination.currentCursor
        ) {
          return {
            pagination: {
              currentCursor: newData.pagination.currentCursor,
              hasMorePages: oldData.pagination.hasMorePages,
              nextCursor: oldData.pagination.nextCursor,
              previousCursor: newData.pagination.previousCursor,
            },
            data: [...oldData.data, ...newData.data],
          };
        }
        return newData;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.currentCursor !== previousArg?.currentCursor;
      },
      providesTags: ['LabelList'],
    }),
    getLabel: builder.query<LabelObj, LabelObj['id']>({
      query: (id) => `${id}`,
      providesTags: (_result, _error, id) => [{ type: 'LabelList', id }],
    }),
    createLabel: builder.mutation<LabelObj, LabelUrlParams & LabelObj>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result) => [
        'LabelList',
        { type: 'LabelList', id: result?.id },
      ],
    }),
    updateLabel: builder.mutation<LabelObj, LabelUrlParams & LabelObj>({
      query: (label) => ({
        url: `${label.id}`,
        method: 'PUT',
        body: label,
      }),
      invalidatesTags: (result) => [
        'LabelList',
        { type: 'LabelList', id: result?.id },
      ],
    }),
    deleteLabel: builder.mutation<{ id: LabelObj['id'] }, LabelObj['id']>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LabelList'],
    }),
  }),
});

export const {
  useGetLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useGetLabelQuery,
  useDeleteLabelMutation,
} = labelApi;
