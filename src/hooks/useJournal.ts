
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry, JournalFormData } from "@/types/journal";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newEntry: JournalFormData) => {
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .insert([
          {
            ...newEntry,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating journal entry: ${error.message}`);
      }

      return data as JournalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      toast({
        title: "Journal entry created",
        description: "Your new journal entry has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: JournalEntry) => {
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("journal_entries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating journal entry: ${error.message}`);
      }

      return data as JournalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      toast({
        title: "Journal entry updated",
        description: "Your journal entry has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) {
        throw new Error(`Error deleting journal entry: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      toast({
        title: "Journal entry deleted",
        description: "Your journal entry has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
};

export const useJournalEntries = (specificUserId?: string) => {
  const { session } = useAuth();
  const userId = specificUserId || (session?.user?.id ?? "");

  return useQuery({
    queryKey: ["journal-entries", userId],
    queryFn: async (): Promise<JournalEntry[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) {
        throw new Error(`Error fetching journal entries: ${error.message}`);
      }

      return data as JournalEntry[];
    },
    enabled: !!userId,
  });
};
