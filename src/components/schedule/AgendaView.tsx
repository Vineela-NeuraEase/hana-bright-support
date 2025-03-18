
import { useState } from "react";
import {
  format,
  parseISO,
  isToday,
  isBefore,
  isSameDay,
  addDays,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Event } from "@/types/event";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AgendaViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
}

export const AgendaView = ({
  events,
  selectedDate,
  onDateSelect,
  isLoading,
}: AgendaViewProps) => {
  // Generate the next 14 days for agenda view
  const [visibleDays] = useState(() =>
    eachDayOfInterval({
      start: new Date(),
      end: addDays(new Date(), 13),
    })
  );

  // Group events by date
  const eventsByDate = visibleDays.map(day => {
    const dayEvents = events.filter(event => {
      if (!event.startTime) return false;
      const eventDate = typeof event.startTime === 'string'
        ? parseISO(event.startTime)
        : event.startTime;
      return isSameDay(eventDate, day);
    });
    
    // Sort by start time
    dayEvents.sort((a, b) => {
      const aTime = typeof a.startTime === 'string' ? parseISO(a.startTime) : a.startTime;
      const bTime = typeof b.startTime === 'string' ? parseISO(b.startTime) : b.startTime;
      return aTime.getTime() - bTime.getTime();
    });
    
    return {
      date: day,
      events: dayEvents
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateSelect(date)}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:w-2/3 space-y-4">
        {eventsByDate.map(({ date, events }) => (
          <div key={date.toISOString()} className={cn(
            "border rounded-lg p-3",
            isSameDay(date, selectedDate) && "border-primary",
            events.length === 0 && "opacity-60"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "p-1.5 rounded-full",
                isToday(date) ? "bg-primary" : "bg-muted"
              )}>
                <span className={cn(
                  "text-xs font-bold",
                  isToday(date) ? "text-primary-foreground" : ""
                )}>
                  {format(date, "dd")}
                </span>
              </div>
              <h3 className="font-medium">
                {isToday(date) ? "Today" : format(date, "EEEE, MMMM d")}
              </h3>
            </div>
            
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No events scheduled</p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => {
                  const startTime = typeof event.startTime === "string"
                    ? parseISO(event.startTime)
                    : event.startTime;
                    
                  const endTime = typeof event.endTime === "string"
                    ? parseISO(event.endTime)
                    : event.endTime;
                    
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "p-2 rounded-md",
                        event.linkedTaskId ? "bg-blue-50" : "bg-green-50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {format(startTime, "h:mm a")}
                          {" - "}
                          {format(endTime, "h:mm a")}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                      {event.linkedTaskId && (
                        <div className="text-xs mt-1 text-blue-600">
                          Linked to task
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
