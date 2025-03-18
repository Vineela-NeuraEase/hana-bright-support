
import React from "react";
import { parseISO } from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { HourRow } from "./day";

interface DayViewProps {
  events: Event[];
  selectedDate: Date;
  onAddEvent: (date: Date) => void;
  isLoading: boolean;
}

export const DayView = ({
  events,
  selectedDate,
  onAddEvent,
  isLoading,
}: DayViewProps) => {
  // Generate hours for the day (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = typeof event.startTime === 'string' 
        ? parseISO(event.startTime) 
        : event.startTime;
      
      return eventStart.getHours() === hour;
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 divide-y">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <HourRow 
              key={hour} 
              hour={hour} 
              events={hourEvents} 
              selectedDate={selectedDate} 
              onAddEvent={onAddEvent}
            />
          );
        })}
      </div>
    </div>
  );
};
