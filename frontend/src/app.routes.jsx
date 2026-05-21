import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import OAuthSuccess from "./features/auth/OAuthSuccess";
import Dashboard from "./features/dashboard/Dashboard";
import { getAccessToken } from "./utils/api";

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/oauth-success",
    element: <OAuthSuccess />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);