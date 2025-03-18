
import { useState } from "react";
import { Event } from "@/types/event";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventFormValues } from "./EventForm";
import { useTaskCreation } from "@/hooks/events/useTaskCreation";
import { MobileEventDialog } from "./event-dialog/MobileEventDialog";
import { DesktopEventDialog } from "./event-dialog/DesktopEventDialog";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: Event;
  onAddEvent: (event: Omit<Event, "id" | "user_id">) => Promise<any>;
  onUpdateEvent: (id: string, event: Partial<Event>) => Promise<any>;
  onDeleteEvent: (id: string) => Promise<boolean>;
}

export function EventDialog({
  isOpen,
  onClose,
  selectedDate,
  event,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: EventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tasks, refetch: refetchTasks } = useTasks();
  const isMobile = useIsMobile();
  const { createTask } = useTaskCreation(refetchTasks);
  
  const handleSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const startDateTime = new Date(values.startDate);
      const [startHours, startMinutes] = values.startTime.split(":").map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(values.endDate);
      const [endHours, endMinutes] = values.endTime.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes);
      
      // If creating new task was selected
      let linkedTaskId = values.linkedTaskId;
      if (values.createNewTask) {
        const newTaskId = await createTask(
          values.title, 
          values.description || "", 
          startDateTime
        );
        if (newTaskId) {
          linkedTaskId = newTaskId;
        }
      } else if (linkedTaskId && linkedTaskId.trim() === "") {
        linkedTaskId = undefined;
      }
      
      const eventData = {
        title: values.title,
        description: values.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        linkedTaskId,
        reminders: values.reminders,
        color: linkedTaskId ? "#0EA5E9" : "#F2FCE2", // Blue for task-linked events, green for regular
      };

      console.log("Event data being submitted:", eventData);

      if (event) {
        await onUpdateEvent(event.id, eventData);
      } else {
        await onAddEvent(eventData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    
    setIsSubmitting(true);
    try {
      const success = await onDeleteEvent(event.id);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different dialog based on device type
  return isMobile ? (
    <MobileEventDialog
      isOpen={isOpen}
      onClose={onClose}
      selectedDate={selectedDate}
      event={event}
      tasks={tasks}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  ) : (
    <DesktopEventDialog
      isOpen={isOpen}
      onClose={onClose}
      selectedDate={selectedDate}
      event={event}
      tasks={tasks}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
