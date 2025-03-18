
import { createContext, useContext } from "react";

// Create a simplified auth context with a mock session
type AuthContextType = {
  session: { user: { id: string; email: string } } | null;
  loading: boolean;
};

// Create a mock session that's always active
const mockSession = {
  user: {
    id: "guest-user-id",
    email: "guest@example.com"
  }
};

const AuthContext = createContext<AuthContextType>({ 
  session: mockSession, 
  loading: false 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Always provide a mock session
  return (
    <AuthContext.Provider value={{ session: mockSession, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
