import { render } from '@testing-library/react';

import MyButtonTestObject from './MyButton.to';
import MyButton from '..';

describe('<MyButton> unit tests', () => {
  it('should work', () => {
    render(<MyButton />);

    const exampleComponent = MyButtonTestObject.getInstance();

    expect(exampleComponent).toBeInTheDocument();
  });
});
