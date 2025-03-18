
import React, { useState, useEffect } from "react";
import { 
  User,
  onAuthStateChanged, 
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";
import { FirebaseAuthContext, UserRole } from "./FirebaseAuthContext";
import { useToast } from "@/hooks/use-toast";

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('autistic');
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Try to get user role from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data()?.role) {
            const role = userDoc.data().role as UserRole;
            setUserRole(role);
            localStorage.setItem('userRole', role);
          } else {
            // If no role found in Firestore, use local storage as fallback
            const storedRole = localStorage.getItem('userRole');
            if (storedRole && ['autistic', 'caregiver', 'clinician'].includes(storedRole)) {
              setUserRole(storedRole as UserRole);
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Use localStorage as fallback
          const storedRole = localStorage.getItem('userRole');
          if (storedRole && ['autistic', 'caregiver', 'clinician'].includes(storedRole)) {
            setUserRole(storedRole as UserRole);
          }
        }
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
    <FirebaseAuthContext.Provider value={{ 
      user, 
      loading,
      userRole,
      signOut
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
