
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { transformDbEventToClient } from "./eventTransformers";

export const useFetchEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!session?.user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          linkedTask:linked_task_id(
            id,
            title,
            status,
            priority
          )
        `)
        .eq("user_id", session.user.id)
        .order("start_time", { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match our Event interface
      const transformedEvents: Event[] = data?.map(transformDbEventToClient) || [];
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error fetching events",
        description: error.message || "Failed to load your events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    fetchEvents();

    // Set up realtime subscription for events
    if (session?.user) {
      const channel = supabase
        .channel("events-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "events",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchEvents();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, fetchEvents]);

  return {
    events,
    isLoading,
    refetch: fetchEvents
  };
};
