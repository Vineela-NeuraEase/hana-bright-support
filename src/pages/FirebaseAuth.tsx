
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/FirebaseAuthProvider";
import AuthContent from "@/components/auth/AuthContent";

const FirebaseAuth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return <AuthContent />;
};

export default FirebaseAuth;
