import ComponentTestObject from '@monorepo/common-lib/__tests__/Component.to';

export default class MyButtonTestObject extends ComponentTestObject<HTMLButtonElement> {
  static get COMPONENT_NAME() {
    return 'MyButton';
  }

  static getInstance(
    root: ComponentTestObject = new ComponentTestObject(),
  ) {
    const rootNode = root.queryByComponentName(MyButtonTestObject.COMPONENT_NAME);
    return new MyButtonTestObject(rootNode as HTMLButtonElement);
  }
}
