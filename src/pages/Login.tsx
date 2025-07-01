import { Container, Login as LoginForm } from "@/components";
import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.title = "ProjectHunt | Login";
  }, []);
  return (
    <Container className="h-full flex items-center justify-center p-2">
      <LoginForm />
    </Container>
  );
}

export default Login;
