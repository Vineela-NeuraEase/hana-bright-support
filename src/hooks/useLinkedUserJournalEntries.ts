
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types/journal';

export const useLinkedUserJournalEntries = (userId?: string) => {
  return useQuery({
    queryKey: ['linked-user-journal-entries', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching linked user journal entries:', error);
        throw error;
      }

      return data as JournalEntry[];
    },
    enabled: !!userId,
  });
};
