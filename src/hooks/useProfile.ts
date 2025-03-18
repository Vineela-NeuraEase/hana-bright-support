
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
  link_code?: string;
};

export const useProfile = (session: Session | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const getProfile = async () => {
      setLoading(true);
      try {
        // First, fetch the profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          throw profileError;
        }
        
        // Then, fetch the link code from user_links table
        const { data: linkData, error: linkError } = await supabase
          .from('user_links')
          .select('link_code')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (linkError && linkError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" which is fine, user might not have a link code yet
          console.error('Error fetching link code:', linkError);
        }
        
        // Combine the data
        if (profileData) {
          setProfile({
            ...profileData,
            link_code: linkData?.link_code || undefined
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session]);

  return { profile, loading };
};
