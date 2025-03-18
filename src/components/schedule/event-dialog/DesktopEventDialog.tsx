
import { Event } from "@/types/event";
import { Task } from "@/types/task";
import { EventFormValues } from "../EventForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventDialogContent } from "./EventDialogContent";

interface DesktopEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: Event;
  tasks: Task[] | null;
  isSubmitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const DesktopEventDialog = ({
  isOpen,
  onClose,
  selectedDate,
  event,
  tasks,
  isSubmitting,
  onSubmit,
  onDelete,
}: DesktopEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update the details of your event." : "Add a new event to your schedule."}
          </DialogDescription>
        </DialogHeader>
        <EventDialogContent
          event={event}
          selectedDate={selectedDate}
          tasks={tasks}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
