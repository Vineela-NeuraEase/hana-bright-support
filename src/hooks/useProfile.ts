
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
};

export const useProfile = () => {
  const { session, userRole } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Create a profile if it doesn't exist
  const createProfile = async (userId: string, role: 'autistic' | 'caregiver' | 'clinician') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: role }]);
      
      if (error) {
        console.error("Error creating profile:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error in createProfile:", error);
      return false;
    }
  };

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
            .maybeSingle();

          if (error) {
            console.error("Error fetching profile:", error);
            // Try to create a profile if it doesn't exist
            const created = await createProfile(session.user.id, userRole);
            
            if (created) {
              setProfile({
                id: session.user.id,
                role: userRole
              });
              toast({
                title: "Profile Created",
                description: "Your profile has been created successfully.",
              });
            } else {
              // Fallback to using userRole from AuthProvider
              setProfile({
                id: session.user.id,
                role: userRole
              });
            }
          } else if (data) {
            setProfile({
              id: data.id,
              role: data.role as 'autistic' | 'caregiver' | 'clinician'
            });
          } else {
            // Profile not found, create one
            const created = await createProfile(session.user.id, userRole);
            
            if (created) {
              setProfile({
                id: session.user.id,
                role: userRole
              });
              toast({
                title: "Profile Created",
                description: "Your profile has been created successfully.",
              });
            } else {
              // Fallback to using userRole from AuthProvider
              setProfile({
                id: session.user.id,
                role: userRole
              });
            }
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
          // Fallback to using userRole from AuthProvider
          setProfile({
            id: session.user.id,
            role: userRole
          });
        }
      } else {
        // If no session, set profile to null
        setProfile(null);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [session, userRole, toast]);

  return { profile, loading };
};
