
import { useState } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { SubtaskItem } from "./SubtaskItem";
import { AddSubtaskForm } from "./AddSubtaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FallbackAlert } from "./FallbackAlert";

interface SubtasksManagerProps {
  task: Task;
  refetchTasks: () => void;
}

export const SubtasksManager = ({ task, refetchTasks }: SubtasksManagerProps) => {
  const [showSuggestionInput, setShowSuggestionInput] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!task.subtasks) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Subtasks:</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setEditingIndex(null);
            setShowSuggestionInput(true);
          }}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add step
        </Button>
      </div>

      {fallbackMode && apiError && (
        <FallbackAlert error={apiError} />
      )}

      {showSuggestionInput && editingIndex === null && (
        <AddSubtaskForm
          task={task} 
          refetchTasks={refetchTasks}
          onCancel={() => setShowSuggestionInput(false)}
          insertAtIndex={null}
        />
      )}
      
      {task.subtasks.map((subtask, index) => (
        <SubtaskItem
          key={index}
          task={task}
          subtask={subtask}
          index={index}
          refetchTasks={refetchTasks}
          isEditing={editingIndex === index}
          onStartEdit={() => {
            setEditingIndex(index);
            setShowSuggestionInput(false);
          }}
          onCancelEdit={() => {
            setEditingIndex(null);
          }}
        />
      ))}
      
      <div className="mt-4 text-xs text-muted-foreground">
        Completed: {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length}
      </div>
    </div>
  );
};
