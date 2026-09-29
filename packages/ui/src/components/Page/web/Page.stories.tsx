import { type Meta, type StoryObj } from "@storybook/react";

import { Page } from "./Page";

const meta = {
  title: "Components/Page",
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Page>
      <Page.Header>
        <button type="button">Action</button>
        <span>Page header</span>
      </Page.Header>
      <Page.Body>Page body content</Page.Body>
    </Page>
  ),
};
