const words = [
  // variable names
  'treegrid',
  'grecaptcha',
  'recaptcha',
  'Monorepo',
  'captcha',
  'Shopify',
  'Cutton',
  'Defs',
  'Qrcode',
  'aggrid',
  'Calibiri',
  'Arial',
  'Amatic',
  'Comfortaa',
  'Garamond',
  'Lato',
  'Lexend',
  'Merriweather',
  'Nunito',
  'Pacifico',
  'Playfair',
  'Roboto',
  'Saira',
  'Staalith',
  'Trebuchet',
  'Verdana',
  'Noto',
  'Staatliches',
  'styleable', // that can be styled
  'resize',
  'unmock',
  'spinbutton',
  'drillminus',

  // technical terms
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'serializable',
  'nullable',
  'Rect',
  'hrtime',
  'queueMicrotask',
  'Microtask',
  'classnames',
  'mousedown',
  'Dropzone',
  'jsdom',
  'csv',
  'cognito',
  'perf',
  'matcher',
  'matchers',
  'gre',
  'automock',
  'cobertura',
  'globals',
  'mjs',
  'cjs',
  'enum',
  'Serializers',
  'unmocked',
  'keyframes', // css
  'webpack',
  'webkit',
  'unhover', // method of useEvent of react-testing-library
  'redux',
  'renderer',
  'frontend',
  'cors', // request mode
  'tooltip',
  'href',
  'ecma',
  'airbnb',
  'commonjs',
  'prettierrc',
  'viewports',
  'figma',
  'scroller',
  'iframe',
  'onboarding',
  'strapi',
  'linkedin',
  'toastify', // library
  'utf8',
  'droppable',
  'presigned',
  'graphql',
  'debounce',
  'debounced',
  'uuid',
  'uuidv4',
  'unregister',
  'combobox',
  'dropdown',
  'nullable',
  'clearable',
  'searchable',
  'formatter',
  'persistency',
  'collaterals',
  'continuous',
  'vite',
  'vitest',
  'minify',
  'javascript',
  'lerna',
  'monorepo',
  'autodocs',
  'middlewares',
  'bluetooth',
  'avery',
  'memoized',
  'memoize',
  'customizable',
  'selectable',
  'closable',
  'checkboxes',
  'labelled',
  'subtractive',
  'unmount',
  'aws',

  // html
  'dom',
  'menuitem',
  'fieldset',
  'textarea',
  'keyup',
  'calibri',
  'thead',
  'tbody',

  // two words in one
  'checkbox', // role name for html dom element
  'pathname',
  'testid', // prop name for test-propose identification
  'readonly', // wildly used prop name
  'textbox', // role name for html dom element
  'menuitem', // role name for html dom element
  'linebreak', // character representing the end of a line
  'hardcoded', // hard coded
  'textfield', // text + field (as name of component in a snake-case word)
  'strikethrough', // strike through
  'fieldset',
  'scrollbar',
  'deepmerge',
  'gridcell',
  'plusplus', // plus plus
  'signout', // sign out
  'tabindex', // tab index
  'localhost',
  'somepassword',
  'signup',
  'dragenter',
  'subheader',
  'backoffice',
  'multistore',
  'progressbar',
  'valuenow',
  'beforeunload',
  'onopen',
  'evenodd',
  'ecommerce',
  'discountable',
  'uncheck',
  'transitionend',
  'timestamps',
  'rollup',
  'callout',
  'poppins',
  'barcode',
  'unlink',
  'nowrap',
  'autofocus',
  'labelledby',
  'keydown',
  'breakpoint',

  // common abbreviations
  'utils', // utilities
  'str', // string
  'arr', // array
  'idx', // index
  'num', // number | numeric
  'mins', // minutes
  'rgb', // red-green-blue color denomination
  'curr', // current
  'cpy', // copy
  'rmv', // remove
  'txt', // text
  'sso', // Single Sign-On
  'mmb', // Minnesota Management and Budget (MMB)
  'msg', // message
  'ava', // available
  'btn', // button
  'btns', // buttons
  'suff', // suffix
  'pref', // prefix
  'calc', // calculation | calculator
  'esc', // escape
  'impl', // implementation
  'acc', // accumulator
  'cur', // current
  'lang', // language
  'sms',
  'payg', // Pay as you go plan type
  'faq', // Frequently asked questions
  'cvc',
  'bool', // Short for boolean
  'func', // Short for function
  'sid', // Short for session id
  'dnd', // Short for drag and drop
  'ack', // Short for acknowledge
  'rrp', // Short for recommended retail price
  'sku', // Short for stock keeping unit
  'rtk', // Short for redux toolkit
  'utf', // Short for Unicode Transformation Format
  'argv', // Short for argument vector
  'npx', // Short for Node Package Execute
  'cmd', // Short for command
  'ctx', // Short for context
  'mui', // Short for Material-UI
  'pdf', // Portable Document Format
  'cra', // Create React App

  // file extensions
  'jsx',
  'scss',
  'svg',
  'ico',
  'tsx',
  'xlsx',
  'mts',

  // Time format
  'h:mm aaa',

  // names
  'Philchard',
  'Dymo',
];

const regularExpressions = [
  'http://[^s]*', // url
  '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$', // email addresses
  '^/\\w+$', // "/something" typical url endpoint name
  // eslint rule names
  'function-paren-newline',
  'no-undef',
  'no-noninteractive-tabindex',
  'no-noninteractive-element-interactions',
  'jest-dom/prefer-to-have-style',
  'max-len',
  '#[0-9a-f]{3,6}', // hexadecimal values for colors
];

const wordRegularExpressions = [
  '^foobar.*$',
  '^[0-9]+\\w{1,3}$', // measurement units (3px 2vh)
  '^re\\w+$', // "re" prefix allowed to be fixed together with the words
];

module.exports = { words, regularExpressions, wordRegularExpressions };
