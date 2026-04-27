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

const cardItems = (
  <>
    <Accordion.Item id="rewards" header="Membership Rewards points">
      Earn points on eligible purchases and redeem them for travel, gift cards, or
      statement credits.
    </Accordion.Item>
    <Accordion.Item id="travel" header="Travel benefits">
      Lounge access at The Centurion Lounge network and statement credits with eligible
      travel purchases.
    </Accordion.Item>
    <Accordion.Item id="protection" header="Purchase &amp; return protection">
      Eligible purchases are covered against accidental damage or theft for up to 90 days.
    </Accordion.Item>
  </>
);

export const Default: Story = {
  args: { shouldAllowMultipleExpanded: true },
  render: (args) => <Accordion {...args}>{cardItems}</Accordion>,
};

export const SinglePanelOnly: Story = {
  args: { shouldAllowMultipleExpanded: false },
  render: (args) => <Accordion {...args}>{cardItems}</Accordion>,
};

export const WithDefaultExpanded: Story = {
  args: { defaultExpandedItems: ['travel'] },
  render: (args) => <Accordion {...args}>{cardItems}</Accordion>,
};

export const WithDisabledItem: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item id="a" header="Disputing a charge">
        You can dispute a charge online for up to 60 days after the statement date.
      </Accordion.Item>
      <Accordion.Item id="b" header="Autopay (coming soon)" disabled>
        Autopay setup is temporarily unavailable in this preview build.
      </Accordion.Item>
      <Accordion.Item id="c" header="Account alerts">
        Manage push, email, and SMS alerts for charges, payments, and travel advisories.
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithInlineStyleOverrides: Story = {
  render: () => (
    <Accordion style={{ maxWidth: 720 }}>
      <Accordion.Item
        id="business"
        header="Small business cards"
        style={{ borderInlineStart: '4px solid #006FCF' }}
      >
        Tools for managing employee cards, expenses, and accounting integrations.
      </Accordion.Item>
      <Accordion.Item
        id="platinum"
        header="Platinum Card benefits"
        style={{ borderInlineStart: '4px solid #2557D6' }}
      >
        Travel credits, fine hotel and resort upgrades, and concierge service.
      </Accordion.Item>
    </Accordion>
  ),
};
