
import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EventForm, EventFormValues } from "./EventForm";
import { Task } from "@/types/task";

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
  const { toast } = useToast();
  
  const createTask = async (title: string, description: string, dueDate: Date) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          status: "pending",
          priority: "medium",
          due_date: dueDate.toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        variant: "destructive",
        title: "Error creating task",
        description: "Failed to create a task from this event."
      });
      return null;
    }
  };
  
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
          refetchTasks();
          toast({
            title: "Task created",
            description: "A new task has been created from this event."
          });
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

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{event ? "Edit Event" : "New Event"}</DrawerTitle>
            <DrawerDescription>
              {event ? "Update the details of your event." : "Add a new event to your schedule."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <EventForm
              event={event}
              selectedDate={selectedDate}
              tasks={tasks || []}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onClose={onClose}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update the details of your event." : "Add a new event to your schedule."}
          </DialogDescription>
        </DialogHeader>

        <EventForm
          event={event}
          selectedDate={selectedDate}
          tasks={tasks || []}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
