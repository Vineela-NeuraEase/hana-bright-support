
import React from "react";
import { Event } from "@/types/event";
import { TimeLabel } from "./TimeLabel";
import { EventItem } from "./EventItem";

interface HourRowProps {
  hour: number;
  events: Event[];
  selectedDate: Date;
  onAddEvent: (date: Date) => void;
}

export const HourRow = ({ hour, events, selectedDate, onAddEvent }: HourRowProps) => {
  const handleClick = () => {
    const dateWithHour = new Date(selectedDate);
    dateWithHour.setHours(hour);
    onAddEvent(dateWithHour);
  };

  return (
    <div 
      key={hour} 
      className="p-2 min-h-16 hover:bg-muted/10 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex">
        <TimeLabel hour={hour} />
        
        <div className="flex-1">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};
