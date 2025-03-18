
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
};

export const useProfile = () => {
  const { session, userRole } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Create a mock profile using the user's role from AuthProvider
      setProfile({
        id: session.user.id,
        role: userRole
      });
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [session, userRole]);

  return { profile, loading };
};
