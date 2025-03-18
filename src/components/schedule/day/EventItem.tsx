
import React from "react";
import { format, parseISO } from "date-fns";
import { Event } from "@/types/event";

interface EventItemProps {
  event: Event;
}

export const EventItem = ({ event }: EventItemProps) => {
  return (
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
  );
};
