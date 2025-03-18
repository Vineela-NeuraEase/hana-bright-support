
import { createContext } from "react";
import { Session } from "@supabase/supabase-js";

// Define the auth context type
export type UserRole = 'autistic' | 'caregiver' | 'clinician';

export type AuthContextType = {
  session: Session | null;
  loading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
};

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  userRole: 'autistic',
  signOut: async () => {}
});
