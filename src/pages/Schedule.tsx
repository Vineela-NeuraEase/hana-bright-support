
import { useEffect, useState } from "react";
import { Calendar, CalendarIcon, Clock, Plus } from "lucide-react";
import { format, startOfToday, endOfDay, startOfDay, isToday, parseISO, isWithinInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useEvents } from "@/hooks/useEvents";
import { EventDialog } from "@/components/schedule/EventDialog";
import { MonthView } from "@/components/schedule/MonthView";
import { WeekView } from "@/components/schedule/WeekView";
import { DayView } from "@/components/schedule/DayView";
import { useIsMobile } from "@/hooks/use-mobile";
import { AgendaView } from "@/components/schedule/AgendaView";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const { session } = useAuth();
  const isMobile = useIsMobile();
  const { events, isLoading, addEvent, updateEvent, deleteEvent } = useEvents();

  const todaysEvents = events?.filter(event => {
    if (!event.startTime) return false;
    const eventDate = typeof event.startTime === 'string' ? parseISO(event.startTime) : event.startTime;
    return isWithinInterval(eventDate, {
      start: startOfDay(selectedDate),
      end: endOfDay(selectedDate)
    });
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (selectedTime?: Date) => {
    if (selectedTime) {
      setSelectedTime(selectedTime);
    } else {
      // Default to current time if no time selected
      setSelectedTime(new Date());
    }
    setIsDialogOpen(true);
  };

  // Default view based on device size
  const defaultView = isMobile ? "agenda" : "month";

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Schedule</h1>
        </div>
        <Button onClick={() => handleAddEvent()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-xl">
            {isToday(selectedDate) ? "Today" : format(selectedDate, "MMMM d, yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedDate(startOfToday())}
          >
            Today
          </Button>
        </div>
      </div>

      <Tabs defaultValue={defaultView} className="space-y-4">
        <TabsList>
          {!isMobile && (
            <>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </>
          )}
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>
        
        {!isMobile && (
          <>
            <TabsContent value="month">
              <MonthView 
                events={events || []} 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onAddEvent={handleAddEvent}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeekView 
                events={events || []} 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onAddEvent={handleAddEvent}
                isLoading={isLoading}
              />
            </TabsContent>
          </>
        )}
        
        <TabsContent value="day">
          <DayView 
            events={todaysEvents || []}
            selectedDate={selectedDate} 
            onAddEvent={handleAddEvent}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="agenda">
          <AgendaView 
            events={events || []} 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <EventDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        selectedDate={selectedTime || selectedDate}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
      />
    </div>
  );
};

export default Schedule;
