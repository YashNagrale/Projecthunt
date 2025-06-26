import { Header, ThemeProvider } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";
import { Post } from "@/pages";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        swipeDirections={["top", "right", "left"]}
      />
      <Header />
      <Post />
      {/* <main className="w-full h-full"> */}
      <Outlet />
      {/* </main> */}
    </ThemeProvider>
  );
}

export default App;
