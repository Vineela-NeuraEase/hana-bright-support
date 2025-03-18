
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addHours,
  isBefore,
  isAfter,
  isSameHour,
  getHours,
} from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-8 bg-muted">
        {/* Empty cell for time column */}
        <div className="py-2 text-center font-medium text-sm border-r"></div>
        
        {/* Day headers */}
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`py-2 text-center font-medium text-sm cursor-pointer
              ${isSameDay(day, selectedDate) ? "bg-primary/10" : ""}
            `}
            onClick={() => onDateSelect(day)}
          >
            <div>{format(day, "EEE")}</div>
            <div className={`text-lg ${isSameDay(day, selectedDate) ? "font-bold" : ""}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="grid grid-cols-8 divide-x divide-y">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time column */}
            <div className="p-1 text-xs text-right pr-2 bg-muted/20">
              {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), "h a")}
            </div>
            
            {/* Event cells for each day */}
            {days.map((day, dayIndex) => {
              const hourEvents = getEventsForHourAndDay(day, hour);
              
              return (
                <div 
                  key={dayIndex} 
                  className="p-1 h-16 overflow-y-auto relative"
                  onClick={() => {
                    const dateWithHour = new Date(day);
                    dateWithHour.setHours(hour);
                    onAddEvent(dateWithHour);
                  }}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 mb-1 rounded truncate ${
                        event.linkedTaskId
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                      title={event.title}
                    >
                      {format(
                        typeof event.startTime === "string"
                          ? parseISO(event.startTime)
                          : event.startTime,
                        "h:mm a"
                      )}{" "}
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
