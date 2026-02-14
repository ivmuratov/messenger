import { createFileRoute } from "@tanstack/react-router";
import { Button, Flex } from "ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <Flex p="2xl" pl="xs" gap="2xs">
        <h1>Hello</h1>
        <h1>Web App!</h1>
      </Flex>
      <Button>Click me</Button>
    </div>
  );
}
