
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAddEvent: (date: Date) => void;
  isLoading: boolean;
}

export const MonthView = ({
  events,
  selectedDate,
  onDateSelect,
  onAddEvent,
  isLoading,
}: MonthViewProps) => {
  // Get start and end dates for the month view
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Create array of dates for the month view
  const dateArray = [];
  let day = startDate;
  while (day <= endDate) {
    dateArray.push(day);
    day = addDays(day, 1);
  }

  // Group events by date for faster lookup
  const eventsByDate: Record<string, Event[]> = {};
  events.forEach((event) => {
    const eventDate = typeof event.startTime === 'string'
      ? format(parseISO(event.startTime), "yyyy-MM-dd")
      : format(event.startTime, "yyyy-MM-dd");
    
    if (!eventsByDate[eventDate]) {
      eventsByDate[eventDate] = [];
    }
    eventsByDate[eventDate].push(event);
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-center font-medium text-sm">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-y">
        {dateArray.map((day, i) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div
              key={i}
              className={`min-h-[120px] p-1 ${
                isCurrentMonth ? "bg-white" : "bg-muted/20"
              } ${isSelected ? "bg-muted" : ""}`}
              onClick={() => onDateSelect(day)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-semibold p-1 rounded-full w-6 h-6 flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
                <button
                  className="text-xs text-primary hover:text-primary/80 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(day);
                  }}
                >
                  +
                </button>
              </div>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${
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
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
