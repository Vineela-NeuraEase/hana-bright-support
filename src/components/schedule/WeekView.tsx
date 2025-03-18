
import React from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
  getHours,
} from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { WeekHeader } from "./week/WeekHeader";
import { HourCell } from "./week/HourCell";
import { TimeColumn } from "./week/TimeColumn";

interface WeekViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAddEvent: (date: Date) => void;
  isLoading: boolean;
}

export const WeekView = ({
  events,
  selectedDate,
  onDateSelect,
  onAddEvent,
  isLoading,
}: WeekViewProps) => {
  // Get days of the week
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Generate hours for the day (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Filter events for this week
  const weekEvents = events.filter(event => {
    const eventDate = typeof event.startTime === 'string' 
      ? parseISO(event.startTime) 
      : event.startTime;
    return (
      !isBefore(eventDate, weekStart) && 
      !isAfter(eventDate, endOfWeek(weekEnd))
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const getEventsForHourAndDay = (day: Date, hour: number) => {
    return weekEvents.filter(event => {
      const eventStart = typeof event.startTime === 'string' 
        ? parseISO(event.startTime) 
        : event.startTime;
      
      return (
        isSameDay(eventStart, day) &&
        getHours(eventStart) === hour
      );
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <WeekHeader days={days} selectedDate={selectedDate} onDateSelect={onDateSelect} />
      
      {/* Time grid */}
      <div className="grid grid-cols-8 divide-x divide-y">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time column */}
            <TimeColumn hour={hour} />
            
            {/* Event cells for each day */}
            {days.map((day, dayIndex) => {
              const hourEvents = getEventsForHourAndDay(day, hour);
              const dateWithHour = new Date(day);
              dateWithHour.setHours(hour);
              
              return (
                <HourCell 
                  key={dayIndex} 
                  events={hourEvents}
                  onAddEvent={() => onAddEvent(dateWithHour)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
