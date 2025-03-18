
import React from "react";
import { Event } from "@/types/event";
import { Task } from "@/types/task";
import { Form } from "@/components/ui/form";
import { DateTimeInputs } from "./event-dialog/DateTimeInputs";
import { ReminderSelector } from "./event-dialog/ReminderSelector";
import { FormFields } from "./form-sections/FormFields";
import { LinkedTaskSection } from "./form-sections/LinkedTaskSection";
import { DialogActions } from "./form-sections/DialogActions";
import { useFormSetup } from "./form-sections/useFormSetup";
import { EventFormValues } from "./form-sections/FormSchema";

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
  const { form, createNewTask, handleCreateNewTaskChange } = useFormSetup(event, selectedDate);

  const handleSubmit = async (values: EventFormValues) => {
    // Empty string means no linked task
    const modifiedValues = {
      ...values,
      linkedTaskId: values.linkedTaskId === "" ? undefined : values.linkedTaskId,
      createNewTask: values.createNewTask
    };
    await onSubmit(modifiedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFields form={form} />
        <DateTimeInputs form={form} />
        <LinkedTaskSection 
          tasks={tasks} 
          form={form} 
          createNewTask={createNewTask} 
          onCreateNewTaskChange={handleCreateNewTaskChange} 
        />
        <ReminderSelector form={form} />
        <DialogActions 
          isEditing={!!event} 
          isSubmitting={isSubmitting} 
          onDelete={onDelete} 
          onClose={onClose} 
        />
      </form>
    </Form>
  );
};

// Re-export the type to maintain the same API
export type { EventFormValues } from "./form-sections/FormSchema";
