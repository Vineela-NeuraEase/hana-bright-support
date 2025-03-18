
import React from "react";
import { format, isSameDay } from "date-fns";

interface WeekHeaderProps {
  days: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const WeekHeader = ({ days, selectedDate, onDateSelect }: WeekHeaderProps) => {
  return (
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
  );
};
