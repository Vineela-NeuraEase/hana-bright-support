
import { createContext, useContext, useState, useEffect } from "react";
import { 
  User,
  onAuthStateChanged, 
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { useToast } from "@/hooks/use-toast";

// Define the auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  userRole: 'autistic' | 'caregiver' | 'clinician';
  signOut: () => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  userRole: 'autistic',
  signOut: async () => {}
});

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'autistic' | 'caregiver' | 'clinician'>('autistic');
  const { toast } = useToast();

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('userRole');
      setUser(null);
      setUserRole('autistic');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
      
      if (currentUser) {
        // Try to get role from user's custom claims
        currentUser.getIdTokenResult().then((idTokenResult) => {
          const role = idTokenResult.claims.role as 'autistic' | 'caregiver' | 'clinician' | undefined;
          
          if (role && ['autistic', 'caregiver', 'clinician'].includes(role)) {
            setUserRole(role);
            localStorage.setItem('userRole', role);
          } else {
            // If no role in claims, use local storage as fallback
            const storedRole = localStorage.getItem('userRole');
            if (storedRole && ['autistic', 'caregiver', 'clinician'].includes(storedRole)) {
              setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
            }
          }
        });
      } else {
        localStorage.removeItem('userRole');
        setUserRole('autistic');
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      userRole,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
