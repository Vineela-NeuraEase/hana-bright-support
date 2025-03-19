
import { supabase } from '@/integrations/supabase/client';

export const fetchProfileData = async (userId: string) => {
  // Fetch the profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (profileError && profileError.code !== 'PGRST116') {
    throw profileError;
  }
  
  // Then, fetch the link code from user_links table
  const { data: linkData, error: linkError } = await supabase
    .from('user_links')
    .select('link_code')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (linkError && linkError.code !== 'PGRST116') {
    // PGRST116 is "No rows returned" which is fine, user might not have a link code yet
    throw linkError;
  }
  
  // If we don't have a profile, create a temporary one with the session ID
  if (!profileData) {
    const tempProfileData = {
      id: userId,
      role: 'autistic' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      ...tempProfileData,
      link_code: linkData?.link_code || undefined
    };
  }
  
  // Combine the data
  return {
    ...profileData,
    link_code: linkData?.link_code || undefined
  };
};
