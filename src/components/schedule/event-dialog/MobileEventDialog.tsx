
import { Event } from "@/types/event";
import { Task } from "@/types/task";
import { EventFormValues } from "../EventForm";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EventDialogContent } from "./EventDialogContent";

interface MobileEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: Event;
  tasks: Task[] | null;
  isSubmitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const MobileEventDialog = ({
  isOpen,
  onClose,
  selectedDate,
  event,
  tasks,
  isSubmitting,
  onSubmit,
  onDelete,
}: MobileEventDialogProps) => {
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
          <EventDialogContent
            event={event}
            selectedDate={selectedDate}
            tasks={tasks}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onClose={onClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
