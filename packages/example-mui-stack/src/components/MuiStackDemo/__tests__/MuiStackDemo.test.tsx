import { render, screen } from '@testing-library/react';

import MuiStackDemo from '../MuiStackDemo';

describe('<MuiStackDemo>', () => {
  it('renders title and MUI button', () => {
    render(<MuiStackDemo title="Demo" />);

    expect(screen.getByRole('heading', { name: 'Demo' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'MUI Button' }),
    ).toBeInTheDocument();
  });
});
