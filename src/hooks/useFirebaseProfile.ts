
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/FirebaseAuthProvider';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
};

export const useProfile = () => {
  const { user, userRole } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have an authenticated user, create a profile
    if (user) {
      setProfile({
        id: user.uid,
        role: userRole
      });
    } else {
      // If no user, set profile to null
      setProfile(null);
    }
    
    setLoading(false);
  }, [user, userRole]);

  return { profile, loading };
};
