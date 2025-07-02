import { Header, LoadingSpinner, ThemeProvider } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "./components/appwrite/auth";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import { login, logout } from "./features/authSlice";
import { toast } from "sonner";
import projectService from "./components/appwrite/projectService";
import { toggleLike } from "./features/likeSlice";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const syncLikes = async () => {
      if (!userData) return;

      const response = await projectService.listProjects(); // or only liked projects
      const likedProjects = response.documents.filter((project) =>
        project.likedBy.includes(userData.$id)
      );

      likedProjects.forEach((project) => {
        dispatch(
          toggleLike({
            projectId: project.$id,
            hasLiked: true,
            count: project.likesCount,
          })
        );
      });
    };

    syncLikes();
  }, [userData, dispatch]);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          navigate(`/@${userData.name}`);
        } else {
          dispatch(logout());
          navigate("/explore");
        }
      })
      .catch((error) => {
        toast.error("Can't find user");
        console.log("Error on getting user", error);
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
