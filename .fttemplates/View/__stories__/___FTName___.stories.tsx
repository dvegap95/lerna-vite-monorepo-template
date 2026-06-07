import type { Meta, StoryObj } from '@storybook/react';
import {
  BackofficeDrawerDecorator,
  BackofficeTopBarDecorator,
} from '@monorepo/common-lib/utils/__storybook__/storybookUtils';

import AppStory from '@/app/__stories__/AppStory';
import { ___FTName|constantcase____PATH } from '@/common/config/routes';

const meta = {
  title: 'unsorted/Views/___FTName___', // TODO: update the title replacing Unsorted with the correct category
  component: AppStory,
  parameters: {
    chromatic: {
      disableSnapshot: true, // disable chromatic for components (enable for views)
      viewports: ['desktop'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  argTypes: {},
  decorators: [BackofficeDrawerDecorator, BackofficeTopBarDecorator],
} satisfies Meta<typeof AppStory>;

export default meta;
type Story = StoryObj<typeof AppStory>;

export const Default: Story = {
  args: {
    route: ___FTName|constantcase____PATH,
  },
};
