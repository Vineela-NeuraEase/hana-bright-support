
import { createContext } from "react";
import { User } from "firebase/auth";

// Define the auth context type
export type UserRole = 'autistic' | 'caregiver' | 'clinician';

export type FirebaseAuthContextType = {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
};

// Create auth context with default values
export const FirebaseAuthContext = createContext<FirebaseAuthContextType>({ 
  user: null, 
  loading: true,
  userRole: 'autistic',
  signOut: async () => {}
});
