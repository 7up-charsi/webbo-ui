import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { select } from '@gist-ui/theme';
import InputStoryMeta from '@gist-ui/input/stories/input.stories';

import { Select, SelectProps } from '../src';

const meta: Meta<SelectProps> = {
  title: 'Components/Select',
  component: Select,
  args: { ...select.defaultVariants, ...InputStoryMeta.args },
  argTypes: {
    ...InputStoryMeta.argTypes,
    shadow: {
      control: { type: 'select' },
      options: Object.keys(select.variants.shadow),
    },
  },
};

export default meta;

const options = Array.from({ length: 15 }).map((_ele, i) => ({
  label: `custom label ${i + 1}`,
  value: `option ${i + 1}`,
}));

const DefaultTemplate = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === 'string'
        ? false
        : option.value === 'option 1' ||
          option.value === 'option 15' ||
          option.value === 'option 10'
    }
    defaultValue={options[2]}
  />
);

export const Default: StoryObj<SelectProps> = {
  render: DefaultTemplate,
};
