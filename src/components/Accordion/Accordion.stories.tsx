import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  argTypes: {
    shouldAllowMultipleExpanded: { control: 'boolean' },
    headingLevel: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4, 5, 6],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const items = (
  <>
    <Accordion.Item id="shipping" header="Shipping & delivery">
      Standard delivery is 3–5 working days. Express delivery arrives next working day if
      you order before 3pm.
    </Accordion.Item>
    <Accordion.Item id="returns" header="Returns policy">
      You can return any item within 30 days for a full refund. The item must be in its
      original condition.
    </Accordion.Item>
    <Accordion.Item id="contact" header="Contact us">
      Reach our support team Mon–Fri, 9am to 6pm via chat or email.
    </Accordion.Item>
  </>
);

export const Default: Story = {
  args: { shouldAllowMultipleExpanded: true },
  render: (args) => <Accordion {...args}>{items}</Accordion>,
};

export const SinglePanelOnly: Story = {
  args: { shouldAllowMultipleExpanded: false },
  render: (args) => <Accordion {...args}>{items}</Accordion>,
};

export const WithDefaultExpanded: Story = {
  args: { defaultExpandedItems: ['returns'] },
  render: (args) => <Accordion {...args}>{items}</Accordion>,
};

export const WithDisabledItem: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item id="a" header="Available">
        This panel can be opened normally.
      </Accordion.Item>
      <Accordion.Item id="b" header="Disabled (coming soon)" disabled>
        You shouldn&apos;t be able to read this.
      </Accordion.Item>
      <Accordion.Item id="c" header="Available">
        And this one is back to normal.
      </Accordion.Item>
    </Accordion>
  ),
};
