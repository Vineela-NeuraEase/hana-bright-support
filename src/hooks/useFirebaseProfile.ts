
import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { useToast } from '@/hooks/use-toast';

export type FirebaseProfile = {
  id: string;
  email: string;
  role: 'autistic' | 'caregiver' | 'clinician';
  displayName?: string;
  linkCode?: string;
};

export const useFirebaseProfile = () => {
  const { user, userRole } = useFirebaseAuth();
  const [profile, setProfile] = useState<FirebaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Create a profile if it doesn't exist
  const createProfile = async (userId: string, role: 'autistic' | 'caregiver' | 'clinician') => {
    try {
      await setDoc(doc(db, "users", userId), {
        id: userId,
        email: user?.email || '',
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Error creating profile:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // If we have an authenticated user, fetch profile from Firestore
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              id: user.uid,
              email: user.email || '',
              role: userData.role || userRole,
              displayName: userData.displayName || user.displayName || undefined,
              linkCode: userData.linkCode
            });
          } else {
            // Profile not found, create one
            const created = await createProfile(user.uid, userRole);
            
            if (created) {
              setProfile({
                id: user.uid,
                email: user.email || '',
                role: userRole,
                displayName: user.displayName || undefined
              });
              toast({
                title: "Profile Created",
                description: "Your profile has been created successfully.",
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to create your profile.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
          toast({
            title: "Error",
            description: "Failed to load your profile.",
            variant: "destructive",
          });
        }
      } else {
        // If no user, set profile to null
        setProfile(null);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [user, userRole, toast]);

  return { profile, loading };
};
