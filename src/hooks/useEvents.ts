
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

      // Transform the data to match our Event interface (camelCase vs snake_case)
      const transformedEvents = data?.map((event) => ({
        id: event.id,
        user_id: event.user_id,
        title: event.title,
        description: event.description,
        startTime: event.start_time,
        endTime: event.end_time,
        reminders: event.reminders,
        linkedTaskId: event.linked_task_id,
        linkedTask: event.linkedTask,
        color: event.color,
        created_at: event.created_at,
        updated_at: event.updated_at,
      })) || [];

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

  const addEvent = useCallback(
    async (event: Omit<Event, "id" | "user_id">) => {
      if (!session?.user) return null;

      try {
        // Transform our camelCase properties to snake_case for the database
        const dbEvent = {
          title: event.title,
          description: event.description,
          start_time: event.startTime,
          end_time: event.endTime,
          reminders: event.reminders,
          linked_task_id: event.linkedTaskId,
          color: event.color,
        };

        const { data, error } = await supabase
          .from("events")
          .insert([
            {
              ...dbEvent,
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

        // Transform back to our Event interface format
        return {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          startTime: data.start_time,
          endTime: data.end_time,
          reminders: data.reminders,
          linkedTaskId: data.linked_task_id,
          color: data.color,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
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
        // Transform our camelCase properties to snake_case for the database
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
        if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
        if (updates.reminders !== undefined) dbUpdates.reminders = updates.reminders;
        if (updates.linkedTaskId !== undefined) dbUpdates.linked_task_id = updates.linkedTaskId;
        if (updates.color !== undefined) dbUpdates.color = updates.color;

        const { data, error } = await supabase
          .from("events")
          .update(dbUpdates)
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

        // Transform back to our Event interface format
        return {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          description: data.description,
          startTime: data.start_time,
          endTime: data.end_time,
          reminders: data.reminders,
          linkedTaskId: data.linked_task_id,
          color: data.color,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
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
