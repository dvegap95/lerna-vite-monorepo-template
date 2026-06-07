import type { Meta, StoryObj } from '@storybook/react';

import MuiStackDemo from '../MuiStackDemo';

const meta = {
  title: 'Examples/MUI Stack/MuiStackDemo',
  component: MuiStackDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MuiStackDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
