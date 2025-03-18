
import React from "react";
import { format, parseISO } from "date-fns";
import { Event } from "@/types/event";

interface HourCellProps {
  events: Event[];
  onAddEvent: () => void;
}

export const HourCell = ({ events, onAddEvent }: HourCellProps) => {
  return (
    <div 
      className="p-1 h-16 overflow-y-auto relative"
      onClick={onAddEvent}
    >
      {events.map((event) => (
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
};
