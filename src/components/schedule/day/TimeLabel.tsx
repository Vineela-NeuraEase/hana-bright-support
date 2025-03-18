
import React from 'react';
import { format, addHours } from "date-fns";

interface TimeLabelProps {
  hour: number;
}

export const TimeLabel = ({ hour }: TimeLabelProps) => {
  const hourTime = addHours(new Date().setHours(hour, 0, 0, 0), 0);
  
  return (
    <div className="w-16 text-sm font-medium text-muted-foreground">
      {format(hourTime, "h a")}
    </div>
  );
};
