import WebComponentApp from '@monorepo/common-lib/utils/embed/WebComponentApp';

import App from './app/App';

export default class ExampleAppElement extends WebComponentApp {
  static get Component() {
    return App;
  }
}

customElements.define('example-app', ExampleAppElement);
