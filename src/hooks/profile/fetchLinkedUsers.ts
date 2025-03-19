
import { supabase } from '@/integrations/supabase/client';
import { LinkedUser } from './types';

export const fetchLinkedUsers = async (caregiverId: string): Promise<LinkedUser[]> => {
  // Get the linked user IDs from caregiver_links
  const { data: linksData, error: linksError } = await supabase
    .from('caregiver_links')
    .select('user_id')
    .eq('caregiver_id', caregiverId);
  
  if (linksError) {
    throw linksError;
  }

  if (!linksData || linksData.length === 0) {
    return [];
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
  return profilesData.map(profile => {
    const linkCodeData = linkCodesData.find(lc => lc.user_id === profile.id);
    return {
      ...profile,
      link_code: linkCodeData?.link_code
    };
  });
};
