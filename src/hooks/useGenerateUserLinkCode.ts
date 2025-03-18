
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGenerateUserLinkCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      // First, check if a link code already exists
      const { data: existingLink, error: checkError } = await supabase
        .from('user_links')
        .select('link_code')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking for existing link code:', checkError);
        throw checkError;
      }
      
      // If there's already a link code, return it
      if (existingLink?.link_code) {
        return existingLink.link_code;
      }
      
      // Generate a random link code (8 characters)
      function generateRandomCode(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }
      
      const newLinkCode = generateRandomCode();
      
      // Insert the new link code
      const { data, error } = await supabase
        .from('user_links')
        .insert({
          user_id: userId,
          link_code: newLinkCode,
        })
        .select('link_code')
        .single();
      
      if (error) {
        console.error('Error generating link code:', error);
        throw error;
      }
      
      return data.link_code;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user-link-code', userId] });
      toast.success('New link code generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate link code');
    },
  });
};
