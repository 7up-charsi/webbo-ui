import React from 'react';
import { Overlay, OverlayProps } from '../src';

const meta = {
  title: 'Components/Overlay',
  component: Overlay,
};

export default meta;

const Template = (args: OverlayProps) => <Overlay {...args} />;

export const Default = {
  render: Template,
};
