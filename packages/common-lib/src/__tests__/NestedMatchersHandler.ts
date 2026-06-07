// This module provides a singleton with utilities that allow to keep a record of the extended matchers
// and nest several matchers for different classes.
// It also provides a function to apply the matchers to expect through expect.extend
import * as testingLibraryMatchers from '@testing-library/jest-dom/matchers';
import type { ExpectStatic } from 'vitest';

type TestingLibraryMatchers = typeof testingLibraryMatchers;
// TODO: review this typing
type InferValuesType<T extends { [key: string]: unknown }> = T[keyof T];
type TestingLibraryMatcher = InferValuesType<TestingLibraryMatchers>;
type CurrentMatchersRef = {
  current: Record<string, { [key: string]: TestingLibraryMatcher }>;
};

type ExtraContext = {
  baseMatcher: TestingLibraryMatcher;
  // calls expect or expect.not based on the matcher context
  expectWithNot: typeof expect;
};

const currentMatchersRef: CurrentMatchersRef = { current: {} };
const extendedMatcherFlags: Record<string, boolean> = {};

export function getBaseMatchers(): TestingLibraryMatchers {
  return testingLibraryMatchers;
}

export function getMatchersForClass(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementClass: any,
): Partial<TestingLibraryMatchers> {
  return {
    ...getBaseMatchers(),
    ...currentMatchersRef.current[elementClass?.name]?.matchers,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function declareClassMatchers<T extends new (...args: any[]) => any>(
  elementClass: T,
  newMatchers: Record<
    string,
    (
      this: jest.MatcherContext & ExtraContext,
      target: InstanceType<T>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) => Promise<jest.CustomMatcherResult> | jest.CustomMatcherResult
  >,
) {
  if (!currentMatchersRef.current[elementClass.name]) {
    currentMatchersRef.current[elementClass.name] = {
      elementClass,
      matchers: newMatchers,
    };
  } else {
    const previousMatchers =
      currentMatchersRef.current[elementClass.name].matchers;
    currentMatchersRef.current[elementClass.name].matchers = {
      ...previousMatchers,
      ...newMatchers,
    };
  }

  const newMatchersObj: Record<string, TestingLibraryMatcher> = {};
  Object.keys(newMatchers).forEach((matcherName: string) => {
    if (!extendedMatcherFlags[matcherName]) {
      newMatchersObj[matcherName] = resolveMatcher(matcherName);
      extendedMatcherFlags[matcherName] = true;
    }
  });
  applyMatchers(undefined, newMatchersObj);
}

function resolveMatcher(
  matcherName: string,
  baseMatchers = testingLibraryMatchers,
) {
  const baseMatcher = baseMatchers[matcherName];
  return function (
    this: ThisParameterType<TestingLibraryMatcher>,
    element: { constructor: { name: string } },
    ...args: Parameters<TestingLibraryMatcher>
  ) {
    if (element?.constructor) {
      let specificMatcher =
        currentMatchersRef.current[element.constructor.name]?.matchers[
          matcherName
        ];
      if (!specificMatcher) {
        // if not specific matcher, cover the case of matchers defined for base classes(which are listed last)
        const reversedClassesWithMatchersArr = Object.values(
          currentMatchersRef.current,
        ).reverse();
        for (const value of reversedClassesWithMatchersArr) {
          if (element instanceof value.elementClass) {
            specificMatcher = value.matchers[matcherName];
            if (specificMatcher) break;
          }
        }
      }
      if (specificMatcher) {
        const expectWithNot = (...args: Parameters<typeof expect>) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any).isNot ? expect(...args).not : expect(...args);
        const context = this
          ? { ...this, baseMatcher, expectWithNot }
          : { baseMatcher, expectWithNot };
        return specificMatcher.call(context, element, ...args);
      }
    }
    if (baseMatcher) {
      return baseMatcher.call(this, element, ...args);
    }
    throw new Error(`Matcher ${matcherName} not found`);
  };
}

export function applyMatchers(
  targetExpect: typeof expect | ExpectStatic = expect, // ExpectStatic adds the support for vitest
  newMatchers: Record<
    string,
    TestingLibraryMatcher
  > = currentMatchersRef.current,
) {
  targetExpect.extend(newMatchers);
}
