
import { useState } from "react";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { SubtaskItem } from "./SubtaskItem";
import { AddSubtaskForm } from "./AddSubtaskForm";
import { Button } from "@/components/ui/button";
import { CheckCheck, Plus, Trash } from "lucide-react";
import { FallbackAlert } from "./FallbackAlert";
import { supabase } from "@/integrations/supabase/client";

interface SubtasksManagerProps {
  task: Task;
  refetchTasks: () => void;
}

export const SubtasksManager = ({ task, refetchTasks }: SubtasksManagerProps) => {
  const [showSuggestionInput, setShowSuggestionInput] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!task.subtasks) return null;

  const handleCompleteAll = async () => {
    if (!task.subtasks || task.subtasks.length === 0) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = task.subtasks.map(subtask => ({
        ...subtask,
        completed: true,
      }));

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "All steps completed",
        description: "All steps have been marked as completed.",
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error completing all steps:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete all steps. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    if (!task.subtasks || task.subtasks.length === 0) return;
    
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed);
    if (completedSubtasks.length === 0) {
      toast({
        title: "No completed steps",
        description: "There are no completed steps to clear.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const updatedSubtasks = task.subtasks.filter(subtask => !subtask.completed);

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "Completed steps cleared",
        description: `${completedSubtasks.length} completed steps have been removed.`,
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error clearing completed steps:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear completed steps. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Subtasks:</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCompleteAll}
            disabled={loading || task.subtasks.length === 0}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Complete all
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearCompleted}
            disabled={loading || !task.subtasks.some(st => st.completed)}
            className="text-xs"
          >
            <Trash className="h-3 w-3 mr-1" />
            Clear completed
          </Button>
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
