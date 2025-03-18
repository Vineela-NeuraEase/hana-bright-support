
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[] | null>(null);
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
          linkedTask:linkedTaskId(
            id,
            title,
            status,
            priority
          )
        `)
        .eq("user_id", session.user.id)
        .order("startTime", { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data);
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

  const addEvent = useCallback(
    async (event: Omit<Event, "id" | "user_id">) => {
      if (!session?.user) return null;

      try {
        const { data, error } = await supabase
          .from("events")
          .insert([
            {
              ...event,
              user_id: session.user.id,
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast({
          title: "Event created",
          description: "Your event has been added to your schedule",
        });

        return data;
      } catch (error: any) {
        console.error("Error adding event:", error);
        toast({
          title: "Error creating event",
          description: error.message || "Failed to add your event",
          variant: "destructive",
        });
        return null;
      }
    },
    [session, toast]
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<Event>) => {
      if (!session?.user) return null;

      try {
        const { data, error } = await supabase
          .from("events")
          .update(updates)
          .eq("id", id)
          .eq("user_id", session.user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast({
          title: "Event updated",
          description: "Your event has been updated",
        });

        return data;
      } catch (error: any) {
        console.error("Error updating event:", error);
        toast({
          title: "Error updating event",
          description: error.message || "Failed to update your event",
          variant: "destructive",
        });
        return null;
      }
    },
    [session, toast]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      if (!session?.user) return false;

      try {
        const { error } = await supabase
          .from("events")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Event deleted",
          description: "Your event has been removed from your schedule",
        });

        return true;
      } catch (error: any) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error deleting event",
          description: error.message || "Failed to delete your event",
          variant: "destructive",
        });
        return false;
      }
    },
    [session, toast]
  );

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};
