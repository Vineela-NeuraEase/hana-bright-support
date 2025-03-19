
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Profile, LinkedUser } from './types';
import { fetchProfileData } from './fetchProfileData';
import { fetchLinkedUsers } from './fetchLinkedUsers';
import { fetchLinkedCaregivers } from './fetchLinkedCaregivers';

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
        // Get the user profile data
        const profileData = await fetchProfileData(session.user.id);
        setProfile(profileData);

        // If the user is a caregiver, fetch linked users
        if (profileData.role === 'caregiver') {
          fetchUserLinks(session.user.id);
        } else if (profileData.role === 'autistic') {
          // If the user is autistic, fetch linked caregivers
          fetchCaregiverLinks(session.user.id);
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

  const fetchUserLinks = async (caregiverId: string) => {
    setLinkedUsersLoading(true);
    setError(null);
    
    try {
      const linkedUsersList = await fetchLinkedUsers(caregiverId);
      setLinkedUsers(linkedUsersList);
    } catch (error: any) {
      console.error('Error fetching linked users:', error);
      setError(error.message || 'Failed to load linked users');
    } finally {
      setLinkedUsersLoading(false);
    }
  };

  const fetchCaregiverLinks = async (userId: string) => {
    setCaregiversLoading(true);
    setError(null);
    
    try {
      const caregiversList = await fetchLinkedCaregivers(userId);
      setCaregivers(caregiversList);
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
    refetchLinkedUsers: () => profile?.role === 'caregiver' && profile.id ? fetchUserLinks(profile.id) : null,
    refetchLinkedCaregivers: () => profile?.role === 'autistic' && profile.id ? fetchCaregiverLinks(profile.id) : null
  };
};
