
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import AuthContent from "@/components/auth/AuthContent";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return <AuthContent />;
};

export default Auth;
