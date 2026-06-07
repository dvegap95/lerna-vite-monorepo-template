import type { Meta, StoryObj } from '@storybook/react';

import ___FTName___ from '../___FTName___';

const meta = {
  title: 'Unsorted/Components/___FTName___', // TODO: update the title replacing Unsorted with the correct category
  component: ___FTName___,
  parameters: {
    chromatic: { disableSnapshot: true }, // disable chromatic for components (enable for views)
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ___FTName___>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
