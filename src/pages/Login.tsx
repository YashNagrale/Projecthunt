import { Container, Login as LoginForm } from "@/components";
import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.title = "ProjectHunt | Login";
  }, []);
  return (
    <Container className="h-full flex items-center justify-center">
      <LoginForm />
    </Container>
  );
}

export default Login;
