import { render } from '@testing-library/react';

import ___FTName___TestObject from './___FTName___.to';
import ___FTName___ from '..';

describe('<___FTName___>', () => {
  it('should work', async () => {
    render(<___FTName___ />);
    const view = new ___FTName___TestObject();
    await view.render();
    expect(view).toBeInTheDocument();
  });
});
