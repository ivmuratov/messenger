import { createFileRoute } from "@tanstack/react-router";
import { Button } from "ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1>Hello Web App!</h1>
      <Button>Click me</Button>
    </div>
  );
}
