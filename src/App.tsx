import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import { AuthProvider } from "./components/AuthProvider";
import PersonManagement from "./pages/PersonManagement";

// Update the routes to include the Encouragement page
import Encouragement from "./pages/Encouragement";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// Update the router configuration to include the Encouragement route
const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/people",
    element: <PersonManagement />,
  },
  {
    path: "/encouragement",
    element: <Encouragement />,
  },
]);

export default App;
