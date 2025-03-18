
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthContent from "@/components/auth/AuthContent";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already logged in
  if (session) {
    navigate("/dashboard");
    return null;
  }

  return <AuthContent />;
};

export default Auth;
