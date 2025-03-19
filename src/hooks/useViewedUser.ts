
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useViewedUser = () => {
  const location = useLocation();
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUserProfile, setViewingUserProfile] = useState<any>(null);

  // Parse the viewAs parameter from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewAsParam = searchParams.get('viewAs');
    setViewingUserId(viewAsParam);

    if (viewAsParam) {
      fetchViewingUserProfile(viewAsParam);
    } else {
      setViewingUserProfile(null);
    }
  }, [location.search]);

  // Fetch the profile of the user being viewed (if any)
  const fetchViewingUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching viewed user profile:', error);
        return;
      }

      setViewingUserProfile(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return { viewingUserId, viewingUserProfile };
};
