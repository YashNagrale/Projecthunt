import { Header, LoadingSpinner, ThemeProvider } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "./components/appwrite/auth";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import { login, logout } from "./features/authSlice";
import projectService from "./components/appwrite/projectService";
import { setLikes } from "./features/likeSlice";

type LikeState = {
  [projectId: string]: {
    count: number;
    hasLiked: boolean;
  };
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const syncLikes = async () => {
      if (!userData) return;

      const response = await projectService.listProjects();
      const likeState: LikeState = {};

      response.documents.forEach((project) => {
        likeState[project.$id] = {
          hasLiked: project.likedBy.includes(userData.$id),
          count: project.likesCount,
        };
      });
      dispatch(setLikes(likeState));
    };

    syncLikes();
  }, [userData, dispatch]);

  //-----------------------------------------------------------
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log("Error on getting user", error);
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        swipeDirections={["top", "right", "left"]}
      />
      <Header />
      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <main className="w-full h-full">
          <Outlet />
        </main>
      )}
    </ThemeProvider>
  );
}

export default App;
