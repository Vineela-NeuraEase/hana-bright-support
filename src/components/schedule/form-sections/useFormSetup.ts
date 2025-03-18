
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { formSchema, EventFormValues } from "./FormSchema";

export const useFormSetup = (event: Event | undefined, selectedDate: Date) => {
  const [createNewTask, setCreateNewTask] = useState(false);

  // Get default times from the selectedDate
  const defaultStartTime = useMemo(() => {
    return format(selectedDate, "HH:mm");
  }, [selectedDate]);
  
  const defaultEndTime = useMemo(() => {
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
      createNewTask: false,
    },
  });

  // Reset form when dialog opens or selected event changes
  useEffect(() => {
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
        createNewTask: false,
      });
      setCreateNewTask(false);
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
        createNewTask: false,
      });
      setCreateNewTask(false);
    }
  }, [event, selectedDate, form, defaultStartTime, defaultEndTime]);

  const handleCreateNewTaskChange = (checked: boolean) => {
    setCreateNewTask(checked);
    form.setValue("createNewTask", checked);
    
    // Clear linked task selection if creating a new task
    if (checked) {
      form.setValue("linkedTaskId", "");
    }
  };

  return {
    form,
    createNewTask,
    handleCreateNewTaskChange
  };
};
