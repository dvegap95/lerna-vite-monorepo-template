import { debug } from 'vitest-preview';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { vi } from 'vitest';

export type TestObjectContext = typeof screen;
export type DebugOptions = { delay?: number };

export const partialClassSelector = (className: string) =>
  `[class*="-${className}"]`;

export const partialComponentNameSelector = (componentName: string) =>
  `[class*="---styled${componentName}-"]`;

let useFakeTimers = false;
let debounceAllEvents: number | null = null;

export type CustomEventOptions = { debounceTime?: number };
export type ClickOptions = Parameters<typeof userEvent.click>[1] &
  CustomEventOptions;
export type HoverOptions = Parameters<typeof userEvent.hover>[1] &
  CustomEventOptions;
export type KeyboardOptions = Parameters<typeof userEvent.keyboard>[1] &
  CustomEventOptions;
export type TypeOptions = Parameters<typeof userEvent.type>[2] &
  CustomEventOptions;

export default class ComponentTestObject<T extends HTMLElement = HTMLElement> {
  protected _context: TestObjectContext | null;
  protected _root: T | null;

  constructor(root?: T | null | undefined) {
    if (root === undefined) {
      this._context = screen;
      this._root = document.body as T;
    } else if (root === null) {
      this._context = null;
      this._root = null;
    } else {
      this._context = within(root) as TestObjectContext;
      this._root = root;
    }
  }

  get root(): T | null {
    return this._root;
  }

  get context(): TestObjectContext {
    if (!this._context) {
      throw new Error(
        `Element of type ${
          this.constructor.name
        } is not a valid testObject, it's root node doesn't exist in the DOM.`,
      );
    }
    return this._context;
  }

  static async debounce(time: number = 1000) {
    if (useFakeTimers) {
      await act(() => {
        vi.advanceTimersByTime(time);
      });
    }
  }

  static async click(target: HTMLElement | null, options?: ClickOptions) {
    const debounceAfter =
      useFakeTimers && (options?.debounceTime || debounceAllEvents);
    await userEvent.click(target!, options);
    debounceAfter && (await this.debounce(debounceAfter));
  }

  static async hover(target: HTMLElement | null, options?: HoverOptions) {
    const debounceAfter =
      useFakeTimers && (options?.debounceTime || debounceAllEvents);
    await userEvent.hover(target!, options);
    debounceAfter && (await this.debounce(debounceAfter));
  }

  debounce(time: number = 1000) {
    return ComponentTestObject.debounce(time);
  }

  async click(options?: ClickOptions) {
    return ComponentTestObject.click(this.root, options);
  }

  async hover(options?: HoverOptions) {
    return ComponentTestObject.hover(this.root, options);
  }

  async keyboard(key: string, options?: KeyboardOptions) {
    let finalOptions = options;
    const debounceAfter =
      useFakeTimers && (options?.debounceTime || debounceAllEvents);
    if (useFakeTimers) {
      if (finalOptions) finalOptions.delay = 0;
      else finalOptions = { delay: 0 };
    }
    await userEvent.keyboard(key, options || {});
    debounceAfter && (await this.debounce(debounceAfter));
  }

  async type(value: string, options?: TypeOptions) {
    let finalOptions = options;
    const debounceAfter =
      useFakeTimers && (options?.debounceTime || debounceAllEvents);
    if (useFakeTimers) {
      if (finalOptions) finalOptions.delay = 0;
      else finalOptions = { delay: 0 };
    }
    await act(
      async () => await userEvent.type(this.root!, value, finalOptions!),
    );
    debounceAfter && (await this.debounce(debounceAfter));
  }

  static useFakeTimers(options: { debounceAllEvents?: number } = {}) {
    vi.useFakeTimers();
    debounceAllEvents = options.debounceAllEvents || null;
    useFakeTimers = true;
  }

  static useRealTimers() {
    vi.useRealTimers();
    useFakeTimers = false;
    debounceAllEvents = null;
  }

  static debounceAllEvents(debounceTime: number = 1000) {
    debounceAllEvents = debounceTime;
  }

  static disableDebounceAllEvents() {
    debounceAllEvents = null;
  }

  logTestingPlaygroundUrl(target: HTMLElement | null = this.root) {
    if (target === null) throw new Error('No target element to log');
    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.logTestingPlaygroundURL(target || undefined);
  }

  async debug({ delay }: DebugOptions = {}) {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    // eslint-disable-next-line testing-library/no-debugging-utils
    debug();
  }

  queryByClass(className: string): HTMLElement | null {
    return ComponentTestObject.queryByClass(this.root, className);
  }

  static queryByClass(
    root: HTMLElement | null,
    className: string,
  ): HTMLElement | null {
    if (root) {
      return root.querySelector(partialClassSelector(className)) || null;
    }
    return null;
  }

  queryByComponentName(componentName: string): HTMLElement | null {
    return ComponentTestObject.queryByComponentName(this.root, componentName);
  }

  static queryByComponentName(
    root: HTMLElement | null,
    componentName: string,
  ): HTMLElement | null {
    if (root) {
      return (
        root.querySelector(partialComponentNameSelector(componentName)) || null
      );
    }
    return null;
  }

  queryAllByClass(className: string): HTMLElement[] {
    return ComponentTestObject.queryAllByClass(this.root, className);
  }

  static queryAllByClass(
    root: HTMLElement | null,
    className: string,
  ): HTMLElement[] {
    if (root) {
      return Array.from(
        root.querySelectorAll(partialClassSelector(className)) || [],
      );
    }
    return [];
  }

  queryAllByComponentName(componentName: string): HTMLElement[] {
    return ComponentTestObject.queryAllByComponentName(
      this.root,
      componentName,
    );
  }

  static queryAllByComponentName(
    root: HTMLElement | null,
    componentName: string,
  ): HTMLElement[] {
    if (root) {
      return Array.from(
        root.querySelectorAll(partialComponentNameSelector(componentName)) ||
          [],
      );
    }
    return [];
  }

  static findParentByClass(
    element: HTMLElement | null,
    className: string,
  ): HTMLElement | null {
    if (!element || !className) {
      return element;
    }
    return element.closest(partialClassSelector(className)); // omit the hash and css-prefix from emotion
  }
}
