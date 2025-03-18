
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  transformClientEventToDb, 
  transformClientUpdatesToDb, 
  transformDbEventToClient 
} from "./eventTransformers";
import { AddEventParams, UpdateEventParams } from "./types";

export const useEventOperations = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const addEvent = useCallback(
    async (event: AddEventParams) => {
      if (!session?.user) return null;

      try {
        const dbEvent = transformClientEventToDb(event, session.user.id);

        const { data, error } = await supabase
          .from("events")
          .insert(dbEvent)
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
        return transformDbEventToClient(data);
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
    async (id: string, updates: UpdateEventParams) => {
      if (!session?.user) return null;

      try {
        const dbUpdates = transformClientUpdatesToDb(updates);

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
        return transformDbEventToClient(data);
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
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
