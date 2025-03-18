
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns"; 
import { Trash2 } from "lucide-react";
import { Event } from "@/types/event";

import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeInputs } from "./event-dialog/DateTimeInputs";
import { TaskLinkSelector } from "./event-dialog/TaskLinkSelector";
import { ReminderSelector } from "./event-dialog/ReminderSelector";
import { Task } from "@/types/task";

// Form schema for event creation/editing
const formSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.date({
    required_error: "End date is required",
  }),
  endTime: z.string().min(1, "End time is required"),
  linkedTaskId: z.string().optional(),
  reminders: z.array(z.number()).default([]),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  event?: Event;
  selectedDate: Date;
  tasks: Task[];
  isSubmitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export const EventForm = ({
  event,
  selectedDate,
  tasks,
  isSubmitting,
  onSubmit,
  onDelete,
  onClose,
}: EventFormProps) => {
  // Get default times from the selectedDate
  const defaultStartTime = React.useMemo(() => {
    return format(selectedDate, "HH:mm");
  }, [selectedDate]);
  
  const defaultEndTime = React.useMemo(() => {
    return format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "HH:mm");
  }, [selectedDate]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startDate: event ? new Date(event.startTime) : selectedDate,
      startTime: event ? format(new Date(event.startTime), "HH:mm") : defaultStartTime,
      endDate: event ? new Date(event.endTime) : selectedDate,
      endTime: event ? format(new Date(event.endTime), "HH:mm") : defaultEndTime,
      linkedTaskId: event?.linkedTaskId || "",
      reminders: event?.reminders || [],
    },
  });

  // Reset form when dialog opens or selected event changes
  React.useEffect(() => {
    if (event) {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);

      form.reset({
        title: event.title,
        description: event.description || "",
        startDate: startDate,
        startTime: format(startDate, "HH:mm"),
        endDate: endDate,
        endTime: format(endDate, "HH:mm"),
        linkedTaskId: event.linkedTaskId || "",
        reminders: event.reminders || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        startDate: selectedDate,
        startTime: defaultStartTime,
        endDate: selectedDate,
        endTime: defaultEndTime,
        linkedTaskId: "",
        reminders: [],
      });
    }
  }, [event, selectedDate, form, defaultStartTime, defaultEndTime]);

  const handleSubmit = async (values: EventFormValues) => {
    // Transform "none" value back to empty string for the API
    const modifiedValues = {
      ...values,
      linkedTaskId: values.linkedTaskId === "none" ? "" : values.linkedTaskId
    };
    await onSubmit(modifiedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add details about this event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateTimeInputs form={form} />

        <TaskLinkSelector tasks={tasks} form={form} />

        <ReminderSelector form={form} />

        <DialogFooter className="flex justify-between items-center gap-2 pt-4">
          {event && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete} 
              disabled={isSubmitting}
              className="mr-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {event ? "Save Changes" : "Create Event"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
