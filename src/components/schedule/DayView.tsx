
import { format, parseISO, addHours } from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

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
          const hourTime = addHours(new Date().setHours(hour, 0, 0, 0), 0);
          
          return (
            <div 
              key={hour} 
              className="p-2 min-h-16 hover:bg-muted/10 transition-colors cursor-pointer"
              onClick={() => {
                const dateWithHour = new Date(selectedDate);
                dateWithHour.setHours(hour);
                onAddEvent(dateWithHour);
              }}
            >
              <div className="flex">
                <div className="w-16 text-sm font-medium text-muted-foreground">
                  {format(hourTime, "h a")}
                </div>
                
                <div className="flex-1">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 mb-1 rounded-md text-sm ${
                        event.linkedTaskId
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">
                        {format(
                          typeof event.startTime === "string"
                            ? parseISO(event.startTime)
                            : event.startTime,
                          "h:mm a"
                        )}{" "}
                        -{" "}
                        {format(
                          typeof event.endTime === "string"
                            ? parseISO(event.endTime)
                            : event.endTime,
                          "h:mm a"
                        )}
                      </div>
                      {event.description && (
                        <div className="text-xs mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
