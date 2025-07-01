import { Login as LoginForm } from "@/components";
import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.title = "ProjectHunt | Login";
  }, []);
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;
