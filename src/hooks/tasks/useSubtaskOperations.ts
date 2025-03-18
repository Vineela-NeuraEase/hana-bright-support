
import { useState } from "react";
import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSubtaskOperations(task: Task, index: number, refetchTasks: () => void) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const toggleSubtask = async () => {
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

  const deleteStep = async () => {
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

  const moveStep = async (direction: 'up' | 'down') => {
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
  
  return {
    loading,
    toggleSubtask,
    deleteStep,
    moveStep
  };
}
