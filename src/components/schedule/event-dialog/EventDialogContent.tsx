
import { Event } from "@/types/event";
import { Task } from "@/types/task";
import { EventForm, EventFormValues } from "../EventForm";

interface EventDialogContentProps {
  event?: Event;
  selectedDate: Date;
  tasks: Task[] | null;
  isSubmitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export const EventDialogContent = ({
  event,
  selectedDate,
  tasks,
  isSubmitting,
  onSubmit,
  onDelete,
  onClose,
}: EventDialogContentProps) => {
  return (
    <EventForm
      event={event}
      selectedDate={selectedDate}
      tasks={tasks || []}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onClose={onClose}
    />
  );
};
