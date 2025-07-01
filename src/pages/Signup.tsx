import { Container, Signup as SignupForm } from "@/components";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
    document.title = "Project | Signup";
  }, []);
  return (
    <Container className="h-full flex items-center justify-center p-0">
      <SignupForm />
    </Container>
  );
}

export default Signup;
