
import { supabase } from '@/integrations/supabase/client';
import { LinkedUser } from './types';

export const fetchLinkedCaregivers = async (userId: string): Promise<LinkedUser[]> => {
  // Get the linked caregiver IDs from caregiver_links
  const { data: linksData, error: linksError } = await supabase
    .from('caregiver_links')
    .select('caregiver_id')
    .eq('user_id', userId);
  
  if (linksError) {
    throw linksError;
  }

  if (!linksData || linksData.length === 0) {
    return [];
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
  return profilesData.map(profile => {
    const linkCodeData = linkCodesData.find(lc => lc.user_id === profile.id);
    return {
      ...profile,
      link_code: linkCodeData?.link_code
    };
  });
};
