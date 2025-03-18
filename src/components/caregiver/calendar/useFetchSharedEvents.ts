
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { isToday, parseISO } from "date-fns";

export const useFetchSharedEvents = (userId: string) => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
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
        .eq("user_id", userId)
        .order("start_time", { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match our Event interface
      const transformedEvents: Event[] = data?.map(event => ({
        id: event.id,
        user_id: event.user_id,
        title: event.title,
        description: event.description,
        startTime: event.start_time,
        endTime: event.end_time,
        linkedTaskId: event.linked_task_id,
        linkedTask: event.linkedTask,
        reminders: event.reminders,
        color: event.color,
        created_at: event.created_at,
        updated_at: event.updated_at
      })) || [];

      setEvents(transformedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get events for today
  const todaysEvents = events?.filter(event => {
    const eventDate = typeof event.startTime === 'string' 
      ? parseISO(event.startTime) 
      : event.startTime;
    return isToday(eventDate);
  }) || [];

  // Get events for the next 7 days
  const upcomingEvents = events?.filter(event => {
    const eventDate = typeof event.startTime === 'string'
      ? parseISO(event.startTime)
      : event.startTime;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return eventDate > today && eventDate <= nextWeek;
  }) || [];

  return {
    events,
    todaysEvents,
    upcomingEvents,
    isLoading,
    error,
    fetchEvents
  };
};
