
import { useState } from "react";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { AddSubtaskForm } from "./AddSubtaskForm";
import { SubtaskActions } from "./SubtaskActions";
import { ScheduleSubtaskDialog } from "./ScheduleSubtaskDialog";
import { useSubtaskOperations } from "@/hooks/tasks/useSubtaskOperations";

interface SubtaskItemProps {
  task: Task;
  subtask: { title: string; completed: boolean };
  index: number;
  refetchTasks: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export const SubtaskItem = ({ 
  task,
  subtask,
  index,
  refetchTasks,
  isEditing,
  onStartEdit,
  onCancelEdit
}: SubtaskItemProps) => {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const { loading, toggleSubtask, deleteStep, moveStep } = useSubtaskOperations(
    task,
    index,
    refetchTasks
  );

  if (isEditing) {
    return (
      <AddSubtaskForm 
        task={task}
        refetchTasks={refetchTasks}
        onCancel={onCancelEdit}
        initialValue={subtask.title}
        insertAtIndex={index}
        isEditing
        onDelete={() => deleteStep()}
      />
    );
  }

  return (
    <>
      <div className="group flex items-start space-x-2">
        <Checkbox
          id={`subtask-${task.id}-${index}`}
          checked={subtask.completed}
          onCheckedChange={toggleSubtask}
          disabled={loading}
          className="mt-1"
        />
        <label
          htmlFor={`subtask-${task.id}-${index}`}
          className={`flex-grow text-sm ${
            subtask.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {subtask.title}
        </label>
        <SubtaskActions
          onSchedule={() => setShowScheduleDialog(true)}
          onEdit={onStartEdit}
          onDelete={deleteStep}
          onMoveUp={() => moveStep('up')}
          onMoveDown={() => moveStep('down')}
          isFirstItem={index === 0}
          isLastItem={index === (task.subtasks?.length || 0) - 1}
          loading={loading}
        />
      </div>
      
      <ScheduleSubtaskDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        task={task}
        subtaskTitle={subtask.title}
        onSuccess={refetchTasks}
      />
    </>
  );
};
