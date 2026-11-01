import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/loginloginlogin")({
  beforeLoad: () => {
    throw redirect({ to: "/houtai" });
  },
});
