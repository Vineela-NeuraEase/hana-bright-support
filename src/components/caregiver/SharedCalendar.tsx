
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { format, isToday, parseISO } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MonthView } from "@/components/schedule/MonthView";

interface SharedCalendarProps {
  userId: string;
}

export const SharedCalendar = ({ userId }: SharedCalendarProps) => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const EventItem = ({ event }: { event: Event }) => {
    const startTime = typeof event.startTime === 'string'
      ? parseISO(event.startTime)
      : event.startTime;
    
    const endTime = typeof event.endTime === 'string'
      ? parseISO(event.endTime)
      : event.endTime;
    
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
              </div>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(startTime, "MMM d, yyyy")}
              </div>
            </div>
          </div>
          
          {event.linkedTask && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Linked to Task: {event.linkedTask.title}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shared Schedule</h1>
        <p className="text-muted-foreground">
          View this user's schedule and upcoming events
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isLoading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : (
            <MonthView 
              events={events || []} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onAddEvent={() => {}}
              isLoading={isLoading}
              readOnly
            />
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : todaysEvents.length > 0 ? (
                todaysEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <p className="text-muted-foreground text-center">No events scheduled for today</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <p className="text-muted-foreground text-center">No upcoming events in the next 7 days</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
