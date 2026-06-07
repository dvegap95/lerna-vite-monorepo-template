import type { Meta, StoryObj } from '@storybook/react';

import MyButton from '../MyButton';

const meta = {
  title: 'Unsorted/Components/MyButton', // TODO: update the title replacing Unsorted with the correct category
  component: MyButton,
  parameters: {
    chromatic: { disableSnapshot: true }, // disable chromatic for components (enable for views)
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof MyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
