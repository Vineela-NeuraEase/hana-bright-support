
import React from "react";
import { format, addHours } from "date-fns";

interface TimeColumnProps {
  hour: number;
}

export const TimeColumn = ({ hour }: TimeColumnProps) => {
  return (
    <div className="p-1 text-xs text-right pr-2 bg-muted/20">
      {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), "h a")}
    </div>
  );
};
