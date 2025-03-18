
import { format, parseISO } from "date-fns";
import { Clock, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";

interface EventItemProps {
  event: Event;
}

export const EventItem = ({ event }: EventItemProps) => {
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
