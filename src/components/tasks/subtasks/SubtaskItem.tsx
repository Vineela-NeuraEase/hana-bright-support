
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddSubtaskForm } from "./AddSubtaskForm";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleToggleSubtask = async () => {
    if (!task.subtasks) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        completed: !updatedSubtasks[index].completed,
      };

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      refetchTasks();
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subtask status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStep = async () => {
    if (!task.subtasks) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks.splice(index, 1);

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "Step removed",
        description: "The step has been removed from the task breakdown.",
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error removing step:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the step. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStep = async (direction: 'up' | 'down') => {
    if (!task.subtasks) return;
    
    // Can't move up if already at the top
    if (direction === 'up' && index === 0) return;
    // Can't move down if already at the bottom
    if (direction === 'down' && index === task.subtasks.length - 1) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap the items
      [updatedSubtasks[index], updatedSubtasks[newIndex]] = 
      [updatedSubtasks[newIndex], updatedSubtasks[index]];

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "Step moved",
        description: `The step has been moved ${direction}.`,
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error moving step:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to move the step ${direction}. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (isEditing) {
    return (
      <AddSubtaskForm 
        task={task}
        refetchTasks={refetchTasks}
        onCancel={onCancelEdit}
        initialValue={subtask.title}
        insertAtIndex={index}
        isEditing
        onDelete={() => handleDeleteStep()}
      />
    );
  }

  return (
    <div className="group flex items-start space-x-2">
      <Checkbox
        id={`subtask-${task.id}-${index}`}
        checked={subtask.completed}
        onCheckedChange={handleToggleSubtask}
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
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onStartEdit}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDeleteStep}
          disabled={loading}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => handleMoveStep('up')}
          disabled={loading || index === 0}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => handleMoveStep('down')}
          disabled={loading || index === (task.subtasks?.length || 0) - 1}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
