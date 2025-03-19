
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
  const [error, setError] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<LinkedUser[]>([]);
  const [caregiversLoading, setCaregiversLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const getProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, fetch the profile
        let { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          if (profileError.code === 'PGRST116') { // "No rows returned"
            // Create a default profile
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({ id: session.user.id, role: 'autistic' })
              .select()
              .single();
            
            if (insertError) {
              throw insertError;
            } else {
              profileData = newProfile;
            }
          } else {
            throw profileError;
          }
        }
        
        // Then, fetch the link code from user_links table
        const { data: linkData, error: linkError } = await supabase
          .from('user_links')
          .select('link_code')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (linkError && linkError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" which is fine, user might not have a link code yet
          throw linkError;
        }
        
        // If we still don't have a profile, create a temporary one with the session ID
        if (!profileData) {
          profileData = {
            id: session.user.id,
            role: 'autistic' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        
        // Combine the data
        const combinedProfile = {
          ...profileData,
          link_code: linkData?.link_code || undefined
        };
        
        setProfile(combinedProfile);

        // If the user is a caregiver, fetch linked users
        if (profileData.role === 'caregiver') {
          fetchLinkedUsers(session.user.id);
        } else if (profileData.role === 'autistic') {
          // If the user is autistic, fetch linked caregivers
          fetchLinkedCaregivers(session.user.id);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session]);

  const fetchLinkedUsers = async (caregiverId: string) => {
    setLinkedUsersLoading(true);
    setError(null);
    
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
    } catch (error: any) {
      console.error('Error fetching linked users:', error);
      setError(error.message || 'Failed to load linked users');
    } finally {
      setLinkedUsersLoading(false);
    }
  };

  // New function to fetch caregivers linked to an autistic user
  const fetchLinkedCaregivers = async (userId: string) => {
    setCaregiversLoading(true);
    setError(null);
    
    try {
      // Get the linked caregiver IDs from caregiver_links
      const { data: linksData, error: linksError } = await supabase
        .from('caregiver_links')
        .select('caregiver_id')
        .eq('user_id', userId);
      
      if (linksError) {
        throw linksError;
      }

      if (!linksData || linksData.length === 0) {
        setCaregivers([]);
        return;
      }

      // Get the profile data for each linked caregiver
      const caregiverIds = linksData.map(link => link.caregiver_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', caregiverIds);
      
      if (profilesError) {
        throw profilesError;
      }

      // Get link codes for each linked caregiver
      const { data: linkCodesData, error: linkCodesError } = await supabase
        .from('user_links')
        .select('user_id, link_code')
        .in('user_id', caregiverIds);
      
      if (linkCodesError) {
        throw linkCodesError;
      }

      // Combine profiles with link codes
      const caregiversWithLinkCodes = profilesData.map(profile => {
        const linkCodeData = linkCodesData.find(lc => lc.user_id === profile.id);
        return {
          ...profile,
          link_code: linkCodeData?.link_code
        };
      });

      setCaregivers(caregiversWithLinkCodes);
    } catch (error: any) {
      console.error('Error fetching linked caregivers:', error);
      setError(error.message || 'Failed to load linked caregivers');
    } finally {
      setCaregiversLoading(false);
    }
  };

  return { 
    profile, 
    loading, 
    linkedUsers, 
    linkedUsersLoading,
    caregivers,
    caregiversLoading,
    error,
    refetchLinkedUsers: () => profile?.role === 'caregiver' && profile.id ? fetchLinkedUsers(profile.id) : null,
    refetchLinkedCaregivers: () => profile?.role === 'autistic' && profile.id ? fetchLinkedCaregivers(profile.id) : null
  };
};
