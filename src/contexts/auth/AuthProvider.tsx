
import React from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "./useAuthState";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
