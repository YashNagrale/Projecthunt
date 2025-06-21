import { Header, PostForm, ThemeProvider } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Header />
      <PostForm />
      {/* <main className="w-full h-full"> */}
      <Outlet />
      {/* </main> */}
      <Toaster
        position="top-center"
        swipeDirections={["top", "right", "left"]}
      />
    </ThemeProvider>
  );
}

export default App;
