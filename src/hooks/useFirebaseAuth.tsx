
import { useContext } from "react";
import { FirebaseAuthContext, FirebaseAuthContextType } from "@/contexts/auth/FirebaseAuthContext";

export const useFirebaseAuth = (): FirebaseAuthContextType => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
