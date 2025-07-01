import { Container, Login as LoginForm } from "@/components";
import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.title = "ProjectHunt | Login";
  }, []);
  return (
    <Container>
      <LoginForm />
    </Container>
  );
}

export default Login;
