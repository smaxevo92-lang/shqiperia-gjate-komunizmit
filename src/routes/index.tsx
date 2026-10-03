import { createFileRoute } from "@tanstack/react-router";
import { Documentary } from "@/components/documentary";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Documentary />;
}
