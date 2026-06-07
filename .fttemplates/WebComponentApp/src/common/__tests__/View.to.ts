import ComponentTestObject from '@monorepo/common-lib/__tests__/Component.to';
import { screen } from '@testing-library/react';
import { declareClassMatchers } from '@monorepo/common-lib/__tests__/NestedMatchersHandler';
import ToastTestObject from '@monorepo/common-lib/components/ToastContainer/__tests__/Toast.to';

import AppManager from '@/app/__tests__/AppManager';

export default class ViewTestObject extends ComponentTestObject {
  app: AppManager = new AppManager();
  // add api to the view, e.g.:
  // labelApi = new LabelApi();
  getToast = (message: string | RegExp) => ToastTestObject.byMessage(message);
}

declareClassMatchers(ViewTestObject, {
  async toHaveTooltip(_view: ViewTestObject, title: string | RegExp) {
    const target = await screen.findByRole('tooltip', { name: title });
    if (target === null) {
      return {
        pass: false,
        message: () => `Tooltip with title "${title}" not found`,
      };
    }
    if (this.isNot) {
      expect(target).not.toBeInTheDocument();
    } else {
      expect(target).toBeInTheDocument();
    }
    return { pass: true, message: () => '' };
  },
  toHaveToastWithMessage(view: ViewTestObject, message: string | RegExp) {
    const { isNot } = this;
    const toast = view.getToast(message);
    if (isNot) {
      expect(toast).not.toBeInTheDocument();
    } else {
      expect(toast).toBeInTheDocument();
    }
    return { pass: true, message: () => '' };
  },
});
