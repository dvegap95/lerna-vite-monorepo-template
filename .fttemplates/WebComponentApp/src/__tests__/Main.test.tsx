import { waitFor } from '@testing-library/react';

import ___FTName|pascalcase___ElementElement from '../main';
describe('___FTName|sentencecase___ app', () => {
  it('should render as html element', async () => {
    expect(customElements.get('___FTName___')).toBeDefined();
    const element = new ___FTName|pascalcase___ElementElement(false);
    element.setAttribute('base-path', '/');
    document.body.appendChild(element);
    // Wait for the component to render content
    // eslint-disable-next-line testing-library/no-node-access
    await waitFor(() => expect(element.firstChild).toBeInTheDocument());
  });
});
