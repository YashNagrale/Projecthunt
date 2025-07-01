import { Signup as SignupForm } from "@/components";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
    document.title = "Project | Signup";
  }, []);
  return (
    <div>
      <SignupForm />
    </div>
  );
}

export default Signup;
