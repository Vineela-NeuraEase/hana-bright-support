
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CaregiverLink } from '@/types/caregiver';
import { toast } from 'sonner';

// Fetch caregiver links
export const useCaregiverLinks = (userId?: string) => {
  return useQuery({
    queryKey: ['caregiver-links', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('caregiver_links')
        .select(`
          id,
          caregiver_id,
          user_id,
          created_at,
          user_profile:profiles!user_id(id, role)
        `)
        .eq('caregiver_id', userId);

      if (error) {
        console.error('Error fetching caregiver links:', error);
        throw error;
      }

      return data as CaregiverLink[];
    },
    enabled: !!userId,
  });
};

// Add a caregiver link with a link code
export const useAddCaregiverLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ linkCode, caregiverId }: { linkCode: string; caregiverId: string }) => {
      // First, find the user with this link code
      const { data: linkData, error: linkError } = await supabase
        .from('user_links')
        .select('user_id')
        .eq('link_code', linkCode)
        .single();

      if (linkError) {
        console.error('Error finding user by link code:', linkError);
        throw new Error('Invalid link code');
      }

      const userId = linkData.user_id;

      // Then, create the caregiver link
      const { data, error } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: caregiverId,
          user_id: userId,
        })
        .select();

      if (error) {
        // Check if it's a unique constraint error (already linked)
        if (error.code === '23505') { // PostgreSQL unique violation code
          throw new Error('You are already linked to this user');
        }
        console.error('Error creating caregiver link:', error);
        throw error;
      }

      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-links', variables.caregiverId] });
      toast.success('Successfully linked to user');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create link');
    }
  });
};

// Get the current user's link code
export const useUserLinkCode = (userId?: string) => {
  return useQuery({
    queryKey: ['user-link-code', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_links')
        .select('link_code')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null; // No link code yet
        }
        console.error('Error fetching link code:', error);
        throw error;
      }

      return data.link_code;
    },
    enabled: !!userId
  });
};

// Remove a caregiver link
export const useRemoveCaregiverLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ linkId, caregiverId }: { linkId: string; caregiverId: string }) => {
      const { error } = await supabase
        .from('caregiver_links')
        .delete()
        .eq('id', linkId);

      if (error) {
        console.error('Error removing caregiver link:', error);
        throw error;
      }

      return { id: linkId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caregiver-links', variables.caregiverId] });
      toast.success('Link removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove link');
    }
  });
};
