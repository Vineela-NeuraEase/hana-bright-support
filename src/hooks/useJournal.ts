
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry, JournalFormData } from "@/types/journal";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

export const useJournalEntries = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['journalEntries'],
    queryFn: async (): Promise<JournalEntry[]> => {
      if (!session?.user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false });

      if (error) {
        toast.error("Failed to load journal entries");
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!session?.user?.id
  });
};

export const useJournalEntry = (id?: string) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['journalEntry', id],
    queryFn: async (): Promise<JournalEntry | null> => {
      if (!id || !session?.user?.id) return null;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load journal entry");
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id && !!session?.user?.id
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (journalData: JournalFormData) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Call the Supabase Edge Function to analyze sentiment
      let sentiment = 'neutral';
      if (journalData.journal_text) {
        try {
          // Use the functions.invoke method instead of accessing protected properties
          const { data, error } = await supabase.functions.invoke("analyze-sentiment", {
            body: JSON.stringify({ 
              text: journalData.journal_text 
            })
          });
          
          if (!error && data) {
            sentiment = data.sentiment;
          } else if (error) {
            console.error('Error analyzing sentiment:', error);
            // Fallback to determineSentiment if the edge function fails
            sentiment = determineSentiment(journalData.journal_text);
          }
        } catch (error) {
          console.error('Error analyzing sentiment:', error);
          // Fallback to determineSentiment if the edge function fails
          sentiment = determineSentiment(journalData.journal_text);
        }
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          mood_rating: journalData.mood_rating,
          journal_text: journalData.journal_text,
          factors: journalData.factors,
          sentiment: sentiment,
          user_id: session.user.id
        })
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
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

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

// Simple sentiment analysis function - used as a fallback
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
