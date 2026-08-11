import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./pages/Layout";
import { Home } from "./pages/home";

export default function AppRouter() {
  const root = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [{ path: "/", element: <Home /> }],
    },
  ]);

  return <RouterProvider router={root} />;
}
