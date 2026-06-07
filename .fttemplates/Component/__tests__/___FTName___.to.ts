import ComponentTestObject from '@monorepo/common-lib/__tests__/Component.to';

export default class ___FTName___TestObject extends ComponentTestObject<___DOMNodeType___> {
  static get COMPONENT_NAME() {
    return '___FTName___';
  }

  static getInstance(
    root: ComponentTestObject = new ComponentTestObject(),
  ) {
    const rootNode = root.queryByComponentName(___FTName___TestObject.COMPONENT_NAME);
    return new ___FTName___TestObject(rootNode as ___DOMNodeType___);
  }
}
