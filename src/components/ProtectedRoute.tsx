import { useAppSelector } from "@/hooks/useStore";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  authentication: boolean;
}

function ProtectedRoute({
  children,
  authentication = true,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { status, userData } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (authentication && status !== authentication) {
      navigate("/login");
    } else if (!authentication && status !== authentication) {
      navigate(`/@${userData?.name}`);
    } else {
      console.log("Error on protected route");
    }
  }, [status, authentication, navigate, userData]);

  return <>{children}</>;
}

export default ProtectedRoute;
