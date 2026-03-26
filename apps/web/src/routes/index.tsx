import { createFileRoute } from "@tanstack/react-router";
import { DrawerLayout, Flex, Page, ThemeSwitcher } from "ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <DrawerLayout>
      <DrawerLayout.Aside>
        {Array.from({ length: 100 }).map((_, index) => (
          <Flex key={index}>
            <h1>Hello</h1>
            <h1>Sidebar</h1>
          </Flex>
        ))}
      </DrawerLayout.Aside>
      <DrawerLayout.Main>
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
      </DrawerLayout.Main>
    </DrawerLayout>
  );
}
