// TODO unify this utility in an external library for use in different projects
/**
 * A utility for mocking and handling HTTP requests in vi tests.
 * This utility allows you to register mock response handlers for specific HTTP requests and test
 * your code's interactions with external APIs or services without making actual network requests.
 */

import type { Mocked, Mock } from 'vitest';

export type MethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';

type DataType<T extends object = object> = T | T[];

export type RequestInfo<T extends DataType = object> = Partial<{
  body: T;
  headers: Headers;
  method: MethodType;
}>;

export type ResponseInfo<T = object> = Partial<{
  body: T | string;
  headers: Headers;
  status: number;
}>;

function isResponseInfo(
  response: ResponseInfo | Response | object | object[],
): response is ResponseInfo {
  return (
    (response as ResponseInfo).body !== undefined ||
    (response as ResponseInfo).headers !== undefined
  );
}

type CustomRequest = Request &
  (
    | {
        body: string;
      }
    | { body: Request['body'] }
  );

export type MockedCallbackFn<
  T extends DataType = object,
  RequestObj extends DataType = T,
> = (
  url: string,
  requestInfo?: RequestInfo<RequestObj>,
) => Response | ResponseInfo<T> | T | Promise<Response | ResponseInfo<T> | T>;

type MockedCallback<T extends DataType = object> =
  | MockedCallbackFn<T>
  | Mocked<MockedCallbackFn<T>>;

type Callback<T extends DataType = object> = {
  count: number;
  length?: number;
  mockedCallback: MockedCallback<T>;
  url: string | RegExp;
};

// Storage for registered callbacks
const callbacks: Record<MethodType, Callback[]> = {} as Record<
  MethodType,
  Callback[]
>;
let verbose = false;
let isMocked = false;

async function unwrapRequestInfo(
  req: string | CustomRequest,
  options?: RequestInfo,
): Promise<ResponseInfo & { method: MethodType; url: string }> {
  let url = req as string;
  let method = (options?.method?.toLowerCase() as MethodType) || 'get';
  let body: object =
    typeof options?.body === 'string'
      ? JSON.parse(options?.body)
      : options?.body || undefined;
  let headers = options?.headers || undefined;

  if (req instanceof Request) {
    url = req.url;
    method = req.method.toLowerCase() as MethodType;
    try {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      }
    } finally {
      if (req.body instanceof ReadableStream) {
        body = JSON.parse(await req.text());
      }
    }
    headers = req.headers;
  }
  return { url, method, body, headers };
}

/**
 * Default request handler for mocking HTTP requests.
 */
const defaultHandler = async (
  req: string | CustomRequest,
  options: RequestInfo,
) => {
  const { url, method, body, headers } = await unwrapRequestInfo(req, options);

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(method.toUpperCase(), url, { body, headers });
  }

  const cb = callbacks[method] || [];
  for (let i = cb.length - 1; i >= 0; i -= 1) {
    const callbackInfo = cb[i];
    if (
      callbackInfo.url === url ||
      (callbackInfo.url instanceof RegExp && callbackInfo.url.test(url))
    ) {
      const handler = callbackInfo.mockedCallback;
      if (
        callbackInfo.count &&
        callbackInfo.count !== -1 &&
        --callbackInfo.count === 0
      ) {
        // Delete the callback when count reaches 0
        cb.splice(i, 1);
      }

      // Call the handler in the fetch traditional way
      const result = await handler(url, {
        method,
        body,
        headers,
      } as RequestInfo);

      // eslint-disable-next-line no-console
      if (verbose) console.log('Handler found', result);

      if (result instanceof Response) {
        return result;
      } else if (isResponseInfo(result)) {
        return new Response(result.body ? JSON.stringify(result.body) : '', {
          ...result,
        });
      } else {
        return new Response(JSON.stringify(result), { status: 200 });
      }
    }
  }
  // Return a Promise that never resolves (simulates no matching callback)
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('no handler found, falling back to indefinite promise');
  }
  return new Promise(() => {});
};

/**
 * Clear registered callbacks for a specific HTTP method and URL pattern, or all if no arguments provided.
 */
function clear(
  method: MethodType | null = null,
  url: string | RegExp | null = null,
) {
  if (method && url) {
    callbacks[method] = callbacks[method].filter(
      (callbackInfo) => callbackInfo.url !== url,
    );
  } else if (method) {
    callbacks[method] = [];
  } else {
    Object.keys(callbacks).forEach((key) => {
      callbacks[key as MethodType] = [];
    });
  }
}

/**
 * Clear registered callbacks after each test.
 */
if (process.env.NODE_ENV === 'test') {
  afterEach(() => {
    clear();
  });
}

export const actualFetch = window.fetch;

/**
 * Initialize the utility by spying on the global `fetch` function and setting up the default request handler.
 */
const initialize = () => {
  isMocked = true;
  window.fetch = defaultHandler as typeof window.fetch;
};

// Initialize the utility for test mode
// Needs to be ran manually in browser environments
if (process.env.NODE_ENV === 'test') {
  initialize();
}

const setVerbose = (v: boolean) => {
  verbose = v;
};

export default class ApiTestObject<D extends object> {
  // For testing environments, redefine as a spy in the test setup file
  // ApiTestObject.createCallback = vi.fn
  // ApiTestObject.createCallback = jest.fn
  // this will allow you to treat the request handler as a spy and run assertions on it
  // If left as is, the utility can be used on regular browser environments
  static createCallback: <T extends DataType, R extends DataType = T>(
    fn: MockedCallbackFn<T, R>,
  ) => MockedCallbackFn<T, R> = (fn) => fn;

  /**
   * Register a handler for a given HTTP method and URL pattern.
   */
  registerHandler<
    ResponseData extends DataType = DataType<D>,
    RequestData extends DataType = ResponseData,
  >(
    method: MethodType,
    url: string | RegExp,
    callback: MockedCallbackFn<ResponseData, RequestData> = () =>
      new Promise(() => {}),
    count = -1,
  ) {
    const m = method.toLowerCase() as MethodType;
    const mockedCallback = ApiTestObject.createCallback<
      ResponseData,
      RequestData
    >(callback) as unknown as MockedCallbackFn<object, object>;
    if (!callbacks[m]) {
      callbacks[m] = [];
    }
    callbacks[m].push({ url, mockedCallback, count });
    return mockedCallback;
  }

  registerManualReturnValue<
    ResponseData extends DataType = DataType<D>,
    RequestData extends ResponseData = ResponseData,
  >(
    method: MethodType,
    url: string | RegExp,
    mapResponse?: (
      url: string | CustomRequest,
      requestInfo?: RequestInfo,
    ) => ResponseInfo<ResponseData>,
    count?: number,
  ) {
    const resolverObj: {
      resolve?: (value?: ResponseInfo<ResponseData>) => void;
    } = {}; // Create an object to hold the resolve function
    const callback: MockedCallbackFn<ResponseData, RequestData> = async (
      url,
      requestInfo,
    ) => {
      const { body } = await unwrapRequestInfo(url, requestInfo);
      let defaultResponse: ResponseInfo<ResponseData> = {
        body: body as RequestData,
        status: 201,
      };
      if (mapResponse) {
        defaultResponse = mapResponse(url, requestInfo);
      }
      return new Promise<ResponseInfo<ResponseData>>((resolve) => {
        resolverObj.resolve = (d = defaultResponse) => resolve(d);
      });
    };
    const spy = this.registerHandler<ResponseData, RequestData>(
      method,
      url,
      callback,
      count,
    );
    return [
      spy,
      (value?: ResponseInfo<ResponseData>) => {
        if (resolverObj.resolve) {
          return resolverObj.resolve(value);
        }
        throw new Error('The spy has not been called yet');
      },
    ] as [typeof spy, (value?: ResponseInfo<ResponseData>) => void];
  }

  /**
   * Register a handler for a given HTTP method and URL pattern, to be called only once.
   */
  registerHandlerOnce<
    ResponseData extends DataType = DataType<D>,
    RequestData extends DataType = ResponseData,
  >(
    method: MethodType,
    url: string | RegExp,
    callback: MockedCallbackFn<ResponseData, RequestData>,
  ) {
    return this.registerHandler<ResponseData, RequestData>(
      method,
      url,
      callback,
      1,
    );
  }

  /**
   * Register a callback to return a specific value for a given HTTP method and URL pattern.
   */
  registerResolveValue<
    ResponseData extends DataType = DataType<D>,
    RequestData extends DataType = ResponseData,
  >(
    method: MethodType,
    url: string | RegExp,
    val: ResponseInfo<ResponseData> | ResponseData,
    count = -1,
  ) {
    return this.registerHandler<ResponseData, RequestData>(
      method,
      url,
      () => val,
      count,
    );
  }

  /**
   * Register a callback to return a specific value for a given HTTP method and URL pattern, to be called only once.
   */
  registerResolveValueOnce<
    ResponseData extends DataType = DataType<D>,
    RequestData extends DataType = ResponseData,
  >(
    method: MethodType,
    url: string | RegExp,
    val: ResponseInfo<ResponseData> | ResponseData,
  ) {
    return this.registerResolveValue<ResponseData, RequestData>(
      method,
      url,
      val,
      1,
    );
  }
  static clear = clear;
  static setVerbose = setVerbose;
  static initialize = initialize;
  static actualFetch = actualFetch;
  static isMocked = () => isMocked;
  static unwrapRequestInfo = unwrapRequestInfo;
}

if (process.env.NODE_ENV === 'test') {
  expect.extend({
    toHaveBeenCalledWithBodyContaining(
      spy: Mock,
      body: object,
    ): { message: () => string; pass: boolean } {
      const base = this.isNot ? expect(spy).not : expect(spy);
      base.toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.objectContaining(body),
        }),
      );
      return { pass: true, message: () => '' };
    },
    toHaveBeenLastCalledWithHeaders(
      spy: Mock,
      headers: object,
    ): { message: () => string; pass: boolean } {
      const { isNot, utils } = this;

      const lastCall = spy.mock.calls[spy.mock.calls.length - 1];
      const headersParam = lastCall[1].headers as Headers;
      const headersObj = Object.fromEntries(headersParam.entries());

      const pass = Object.entries(headers).every(
        ([key, value]) => headersObj[key] === value,
      );

      const message = () => {
        const matcherHint = utils.matcherHint(
          isNot
            ? '.not.toHaveBeenLastCalledWithHeadersContaining'
            : '.toHaveBeenLastCalledWithHeadersContaining',
        );

        const expectedString = utils.printExpected(headers);
        const receivedString = utils.printReceived(headersObj);

        return (
          `${matcherHint}\n\n` +
          `Expected headers:\n  ${expectedString}\n` +
          `Received headers:\n  ${receivedString}`
        );
      };

      return { pass: pass, message };
    },
  });
}
