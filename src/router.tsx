import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./pages/Layout";
import { Home } from "./pages/home";
import { Project } from "./pages/project";

export default function AppRouter() {
  const root = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/projects/:project", element: <Project /> },
      ],
    },
  ]);

  return <RouterProvider router={root} />;
}
