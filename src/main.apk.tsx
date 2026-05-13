import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createRootRouteWithContext, createRoute, Outlet } from "@tanstack/react-router";
import { Route as IndexRouteComponent } from "./routes/index";
import { useKioskMode } from "@/lib/useKioskMode";
import { registerKioskSW } from "@/lib/pwa";

// Minimal Root for SPA
const queryClient = new QueryClient();

function Root() {
  useKioskMode();
  useEffect(() => {
    registerKioskSW();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRouteComponent.options.component,
});

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({
  routeTree,
  context: { queryClient },
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
