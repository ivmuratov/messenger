import { createFileRoute } from "@tanstack/react-router";
import { Flex, Page, Sidebar, ThemeSwitcher } from "ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <Flex direction="row">
      <Sidebar>
        {Array.from({ length: 100 }).map((_, index) => (
          <Flex key={index}>
            <h1>Hello</h1>
            <h1>Sidebar</h1>
          </Flex>
        ))}
      </Sidebar>
      <Page>
        <Page.Header>
          <ThemeSwitcher />
        </Page.Header>
        <Page.Body>
          {Array.from({ length: 100 }).map((_, index) => (
            <Flex key={index}>
              <h1>Hello</h1>
              <h1>Web App!</h1>
            </Flex>
          ))}
        </Page.Body>
      </Page>
    </Flex>
  );
}
