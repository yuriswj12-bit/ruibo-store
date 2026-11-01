import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal")({
  beforeLoad: ({ location }) => {
    const rest = location.pathname.replace(/^\/portal\/?/, "");
    throw redirect({ href: rest ? `/houtai/${rest}` : "/houtai" });
  },
});
