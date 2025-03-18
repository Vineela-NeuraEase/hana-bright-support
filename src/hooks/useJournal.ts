
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry, JournalFormData } from "@/types/journal";
import { toast } from "sonner";

export const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journalEntries'],
    queryFn: async (): Promise<JournalEntry[]> => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        toast.error("Failed to load journal entries");
        throw new Error(error.message);
      }

      return data || [];
    }
  });
};

export const useJournalEntry = (id?: string) => {
  return useQuery({
    queryKey: ['journalEntry', id],
    queryFn: async (): Promise<JournalEntry | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Failed to load journal entry");
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (journalData: JournalFormData) => {
      // Analyze sentiment (implement in a real app)
      const sentiment = determineSentiment(journalData.journal_text);

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            ...journalData,
            sentiment,
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Failed to save journal entry");
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Journal entry saved!");
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete journal entry");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Journal entry deleted!");
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
};

// Simple sentiment analysis function
// In a real app, this would be replaced with an AI-powered analysis
const determineSentiment = (text: string): string => {
  if (!text) return 'neutral';
  
  const positiveWords = ['happy', 'great', 'good', 'excellent', 'wonderful', 'amazing', 'joy', 'love'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'angry', 'frustrated', 'stress', 'anxious'];
  
  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};
