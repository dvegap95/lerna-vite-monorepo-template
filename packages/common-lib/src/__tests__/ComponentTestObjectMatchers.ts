import * as testingLibraryMatchers from '@testing-library/jest-dom/matchers';

import ComponentTestObject from './Component.to';
import { declareClassMatchers } from './NestedMatchersHandler';

type TestingLibraryMatchers = typeof testingLibraryMatchers;
type InferValuesType<T extends { [key: string]: unknown }> = T[keyof T];
type TestingLibraryMatcher = InferValuesType<TestingLibraryMatchers>;

const testObjectMatchersArray = Object.keys(testingLibraryMatchers).map(
  (matcherName) => {
    return [
      matcherName,
      function (
        this:
          | (ThisParameterType<TestingLibraryMatcher> & {
              baseMatcher: TestingLibraryMatcher;
            })
          | undefined,
        element: ComponentTestObject,
        ...args: Parameters<TestingLibraryMatcher>
      ) {
        if (!this?.baseMatcher) {
          throw new Error(`There is no base matcher '${matcherName} defined`);
        }
        return this?.baseMatcher?.call(this, element.root, ...args);
      },
    ];
  },
);

const testObjectMatchers = Object.fromEntries(testObjectMatchersArray);
export default testObjectMatchers;

export function extendComponentTestObjectMatchers() {
  declareClassMatchers(ComponentTestObject, testObjectMatchers);
}
