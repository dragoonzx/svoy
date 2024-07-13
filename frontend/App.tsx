import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { Feed } from "@/pages/feed";
import { Header } from "./components/Header";
import LandingPage from "./pages/landing";
import { buttonVariants } from "./components/ui/button";
import CardPage from "./pages/card";

function Layout() {
  return (
    <div className="max-w-2xl mx-auto">
      <Header />
      <Outlet />
      <footer className="mt-10 mb-10 text-center">
        <div className="flex items-center justify-center">
          <Link target="_blank" className={buttonVariants({ variant: "link" })} to="https://t.me/maxareumad">
            Telegram
          </Link>
          <Link target="_blank" className={buttonVariants({ variant: "link" })} to="https://t.me/maxareumad">
            Github
          </Link>
        </div>
      </footer>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/app",
        element: <Feed />,
      },
      {
        path: "/app/card/:cardId",
        element: <CardPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
