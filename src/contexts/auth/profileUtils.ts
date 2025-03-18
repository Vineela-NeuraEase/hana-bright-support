
import { supabase } from "@/integrations/supabase/client";

// Function to create a user profile if it doesn't exist
export const ensureUserProfile = async (
  userId: string, 
  role: 'autistic' | 'caregiver' | 'clinician'
): Promise<boolean> => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();
    
    // If profile doesn't exist, create it
    if (fetchError || !existingProfile) {
      console.log("Creating new profile for user:", userId);
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: role }]);
      
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
};
