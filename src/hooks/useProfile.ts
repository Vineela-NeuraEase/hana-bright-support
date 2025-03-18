
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
};

export const useProfile = () => {
  const { session, userRole } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // If we have an authenticated session, fetch profile from Supabase
      if (session && session.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            // Fallback to using userRole from AuthProvider
            setProfile({
              id: session.user.id,
              role: userRole
            });
          } else if (data) {
            setProfile({
              id: data.id,
              role: data.role as 'autistic' | 'caregiver' | 'clinician'
            });
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
          // Fallback to using userRole from AuthProvider
          setProfile({
            id: session.user.id,
            role: userRole
          });
        }
      } else if (localStorage.getItem('userRole')) {
        // If no session (guest mode), use localStorage role
        setProfile({
          id: 'guest-user-id',
          role: userRole
        });
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [session, userRole]);

  return { profile, loading };
};
