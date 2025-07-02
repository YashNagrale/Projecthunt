import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import {
  AddPost,
  Dashboard,
  EditPost,
  Explore,
  Feedback,
  Login,
  Post,
  Signup,
} from "@/pages";
import { ProtectedRoute } from "@/components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={"/explore"} replace />,
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute authentication={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoute authentication={false}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:username",
        element: (
          <ProtectedRoute authentication>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/add-project",
        element: (
          <ProtectedRoute authentication>
            <AddPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback",
        element: <Feedback />,
      },
      {
        path: "/edit-post/:project$Id",
        element: (
          <ProtectedRoute authentication>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <ProtectedRoute authentication>
            <Post />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
