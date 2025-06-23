import { Header, PostCard, ThemeProvider } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        swipeDirections={["top", "right", "left"]}
      />
      <Header />
      <PostCard />
      {/* <main className="w-full h-full"> */}
      <Outlet />
      {/* </main> */}
    </ThemeProvider>
  );
}

export default App;
