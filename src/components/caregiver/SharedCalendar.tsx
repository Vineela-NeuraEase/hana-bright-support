
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthView } from "@/components/schedule/MonthView";
import { useFetchSharedEvents } from "./calendar/useFetchSharedEvents";
import { EventsSection } from "./calendar/EventsSection";

interface SharedCalendarProps {
  userId: string;
}

export const SharedCalendar = ({ userId }: SharedCalendarProps) => {
  const { 
    events, 
    todaysEvents, 
    upcomingEvents, 
    isLoading, 
    error 
  } = useFetchSharedEvents(userId);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
            />
          )}
        </div>
        
        <div className="space-y-6">
          <EventsSection 
            title="Today's Events" 
            events={todaysEvents} 
            isLoading={isLoading} 
            emptyMessage="No events scheduled for today"
          />
          
          <EventsSection 
            title="Upcoming Events" 
            events={upcomingEvents} 
            isLoading={isLoading} 
            emptyMessage="No upcoming events in the next 7 days"
          />
        </div>
      </div>
    </div>
  );
};
