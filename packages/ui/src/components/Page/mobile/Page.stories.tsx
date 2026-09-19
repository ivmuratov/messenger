import { type Meta, type StoryObj } from "@storybook/react";
import { Text } from "react-native";

import { Page } from "./Page";

const meta = {
  title: "Mobile/Page",
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Page>
      <Page.Header>
        <Text>Page header</Text>
      </Page.Header>
      <Page.Body>
        <Text>Page body content</Text>
      </Page.Body>
    </Page>
  ),
};
