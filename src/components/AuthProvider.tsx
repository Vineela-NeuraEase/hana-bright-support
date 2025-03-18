
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Define the auth context type
type AuthContextType = {
  session: Session | null;
  loading: boolean;
  userRole: 'autistic' | 'caregiver' | 'clinician';
  signOut: () => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  userRole: 'autistic',
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'autistic' | 'caregiver' | 'clinician'>('autistic');
  const { toast } = useToast();

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear role from localStorage
    localStorage.removeItem('userRole');
    setSession(null);
    setUserRole('autistic');
  };

  // Function to create a user profile if it doesn't exist
  const ensureUserProfile = async (userId: string, role: 'autistic' | 'caregiver' | 'clinician') => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();
      
      // If profile doesn't exist, create it
      if (fetchError || !existingProfile) {
        console.log("Creating new profile for user:", userId);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, role: role }]);
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
          return false;
        }
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error in ensureUserProfile:", error);
      return false;
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      // Check for stored role in localStorage (backup)
      const storedRole = localStorage.getItem('userRole');
      
      if (currentSession) {
        try {
          // Try to get role from Supabase profile
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .maybeSingle();
          
          if (data && data.role) {
            setUserRole(data.role as 'autistic' | 'caregiver' | 'clinician');
            localStorage.setItem('userRole', data.role);
          } else if (storedRole) {
            // Fallback to localStorage if profile fetch fails
            setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
            
            // Try to create the profile if it doesn't exist
            const profileCreated = await ensureUserProfile(
              currentSession.user.id, 
              storedRole as 'autistic' | 'caregiver' | 'clinician'
            );
            
            if (!profileCreated) {
              toast({
                title: "Warning",
                description: "Could not create or update user profile",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Use localStorage as fallback
          if (storedRole) {
            setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
          }
        }
      } else if (storedRole) {
        // Guest mode - use localStorage
        setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
      }
      
      setLoading(false);
    };
    
    initAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event);
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession) {
        try {
          // Get user role from profile
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', newSession.user.id)
            .maybeSingle();
          
          if (data && data.role) {
            setUserRole(data.role as 'autistic' | 'caregiver' | 'clinician');
            localStorage.setItem('userRole', data.role);
          } else {
            // If no profile exists, get the selected role from localStorage
            const storedRole = localStorage.getItem('userRole');
            if (storedRole) {
              // Create a profile with the stored role
              const profileCreated = await ensureUserProfile(
                newSession.user.id, 
                storedRole as 'autistic' | 'caregiver' | 'clinician'
              );
              
              if (profileCreated) {
                setUserRole(storedRole as 'autistic' | 'caregiver' | 'clinician');
              } else {
                toast({
                  title: "Warning",
                  description: "Could not create user profile",
                  variant: "destructive",
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user role on auth change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userRole');
        setUserRole('autistic');
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ 
      session, 
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
