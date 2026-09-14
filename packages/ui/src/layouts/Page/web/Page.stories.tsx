import { type Meta, type StoryObj } from "@storybook/react";

import { Page } from "./Page";

const meta = {
  title: "Layouts/Page",
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Page>
      <Page.Header>Page header</Page.Header>
      <Page.Body>Page body content</Page.Body>
    </Page>
  ),
};
