
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskForm } from "./useTaskForm";
import { TaskFormContent } from "./TaskFormContent";

interface TaskFormProps {
  onTaskAdded: () => void;
  userId: string;
}

const TaskForm = ({ onTaskAdded, userId }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit } = useTaskForm({ 
    onTaskAdded, 
    userId, 
    onClose: () => setOpen(false) 
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task for User</DialogTitle>
        </DialogHeader>
        <TaskFormContent form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
