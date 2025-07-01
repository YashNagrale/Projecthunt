import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
        path: "/login",
        element: (
          <ProtectedRoute authentication>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoute authentication>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: ":/username",
        element: (
          <ProtectedRoute authentication>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/explore",
        element: (
          <ProtectedRoute authentication={false}>
            <Explore />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-post",
        element: (
          <ProtectedRoute authentication>
            <AddPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback",
        element: (
          <ProtectedRoute authentication={false}>
            <Feedback />
          </ProtectedRoute>
        ),
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
        path: "/post/$id",
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
