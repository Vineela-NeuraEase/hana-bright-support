
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
  link_code?: string;
  linkedUsers?: LinkedUser[];
};

export type LinkedUser = {
  id: string;
  role: string;
  link_code?: string;
};

export const useProfile = (session: Session | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [linkedUsersLoading, setLinkedUsersLoading] = useState(false);

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
        
        console.log("Link data from Supabase:", linkData);
        
        if (linkError && linkError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" which is fine, user might not have a link code yet
          console.error('Error fetching link code:', linkError);
        }
        
        // Combine the data
        if (profileData) {
          const combinedProfile = {
            ...profileData,
            link_code: linkData?.link_code || undefined
          };
          
          console.log("Combined profile:", combinedProfile);
          setProfile(combinedProfile);

          // If the user is a caregiver, fetch linked users
          if (profileData.role === 'caregiver') {
            fetchLinkedUsers(session.user.id);
          }
        } else {
          console.log("No profile data found for user:", session.user.id);
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session]);

  const fetchLinkedUsers = async (caregiverId: string) => {
    setLinkedUsersLoading(true);
    try {
      // Get the linked user IDs from caregiver_links
      const { data: linksData, error: linksError } = await supabase
        .from('caregiver_links')
        .select('user_id')
        .eq('caregiver_id', caregiverId);
      
      if (linksError) {
        throw linksError;
      }

      if (!linksData || linksData.length === 0) {
        setLinkedUsers([]);
        return;
      }

      // Get the profile data for each linked user
      const userIds = linksData.map(link => link.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        throw profilesError;
      }

      // Get link codes for each linked user
      const { data: linkCodesData, error: linkCodesError } = await supabase
        .from('user_links')
        .select('user_id, link_code')
        .in('user_id', userIds);
      
      if (linkCodesError) {
        throw linkCodesError;
      }

      // Combine profiles with link codes
      const linkedUsersWithLinkCodes = profilesData.map(profile => {
        const linkCodeData = linkCodesData.find(lc => lc.user_id === profile.id);
        return {
          ...profile,
          link_code: linkCodeData?.link_code
        };
      });

      setLinkedUsers(linkedUsersWithLinkCodes);
    } catch (error) {
      console.error('Error fetching linked users:', error);
    } finally {
      setLinkedUsersLoading(false);
    }
  };

  return { 
    profile, 
    loading, 
    linkedUsers, 
    linkedUsersLoading, 
    refetchLinkedUsers: () => profile?.role === 'caregiver' ? fetchLinkedUsers(profile.id) : null 
  };
};
