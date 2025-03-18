
import { Event } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventItem } from "./EventItem";

interface EventsSectionProps {
  title: string;
  events: Event[];
  isLoading: boolean;
  emptyMessage?: string;
}

export const EventsSection = ({ 
  title, 
  events, 
  isLoading, 
  emptyMessage = "No events scheduled" 
}: EventsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : events.length > 0 ? (
          events.map(event => (
            <EventItem key={event.id} event={event} />
          ))
        ) : (
          <p className="text-muted-foreground text-center">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};
