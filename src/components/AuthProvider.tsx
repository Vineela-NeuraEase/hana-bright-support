
import { createContext, useContext, useState, useEffect } from "react";

// Create a simplified auth context with a mock session
type AuthContextType = {
  session: { user: { id: string; email: string; } } | null;
  loading: boolean;
  userRole: 'autistic' | 'caregiver' | 'clinician';
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: false,
  userRole: 'autistic'
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user: { id: string; email: string; } } | null>(null);
  const [userRole, setUserRole] = useState<'autistic' | 'caregiver' | 'clinician'>('autistic');

  useEffect(() => {
    // Check if user is authenticated
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      // Create mock session with mock user
      setSession({
        user: {
          id: "guest-user-id",
          email: "guest@example.com"
        }
      });
      
      // Set user role from localStorage
      setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading,
      userRole 
    }}>
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
