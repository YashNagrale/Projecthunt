import { Container, Signup as SignupForm } from "@/components";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
    document.title = "Project | Signup";
  }, []);
  return (
    <Container>
      <SignupForm />
    </Container>
  );
}

export default Signup;
