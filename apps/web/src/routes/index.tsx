import { createFileRoute } from "@tanstack/react-router";
import { Flex, ThemeSwitcher } from "ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <Flex>
        <h1>Hello</h1>
        <h1>Web App!</h1>
      </Flex>
      <ThemeSwitcher />
    </div>
  );
}
