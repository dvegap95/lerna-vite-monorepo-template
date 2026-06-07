import ReactEmbed from '@monorepo/react-embed';

/**
 * Base class for web-component apps embedded in a host page.
 * Extend this class, set `Component`, and register the custom element.
 */
export default class WebComponentApp extends ReactEmbed {
  static get attributesMap() {
    return {
      'base-path': 'basePath',
    };
  }

  static get propertiesMap() {
    return {};
  }
}
