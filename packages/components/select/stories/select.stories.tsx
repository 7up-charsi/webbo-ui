import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input, select } from "@gist-ui/theme";

import {
  Select,
  SelectProps,
  MultipleSelect,
  MultipleSelectProps,
} from "../src";

const meta: Meta<SelectProps> = {
  title: "Components/Select",
  component: Select,
  args: { ...select.defaultVariants, fullWidth: false },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: Object.keys(input.variants.variant),
    },
    color: {
      control: { type: "select" },
      options: Object.keys(input.variants.color),
    },
    shadow: {
      control: { type: "select" },
      options: Object.keys(select.variants.shadow),
    },
    rounded: {
      control: { type: "select" },
      options: Object.keys(input.variants.rounded),
      if: { arg: "rounded", exists: true },
    },
    size: {
      control: { type: "select" },
      options: Object.keys(input.variants.size),
    },
    fullWidth: {
      control: { type: "boolean" },
      name: "full width",
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
      typeof option === "string"
        ? false
        : option.value === "option 1" ||
          option.value === "option 15" ||
          option.value === "option 10"
    }
    defaultValue={options[2]}
  />
);

export const Default: StoryObj<SelectProps> = {
  render: DefaultTemplate,
};

const CustomOptionTemplate = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === "string"
        ? false
        : option.value === "option 1" ||
          option.value === "option 15" ||
          option.value === "option 10"
    }
    defaultValue={options[2]}
    renderOption={({ option, state }) => {
      return (
        <div>
          <input type="checkbox" checked={state.isSelected} readOnly />
          <span className="ml-2 truncate">{option.label}</span>
        </div>
      );
    }}
  />
);

export const CustomOption: StoryObj<SelectProps> = {
  render: CustomOptionTemplate,
};

const MultipleSelectTemplate = (args: MultipleSelectProps) => (
  <MultipleSelect
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === "string"
        ? false
        : option.value === "option 1" ||
          option.value === "option 15" ||
          option.value === "option 10"
    }
    defaultValue={[options[2]]}
    renderOption={({ option, state }) => {
      return (
        <div>
          <input type="checkbox" checked={state.isSelected} readOnly />
          <span className="ml-2 truncate">{option.label}</span>
        </div>
      );
    }}
  />
);

export const Multiple: StoryObj<MultipleSelectProps> = {
  render: MultipleSelectTemplate,
};
