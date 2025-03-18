
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTasks = () => {
  const { toast } = useToast();
  
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
      refetch();
      
      toast({
        title: "Task updated",
        description: `Task has been moved to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status. Please try again.",
      });
    }
  };

  const calculateTaskStatus = (task: Task): TaskStatus => {
    // If no subtasks, leave status as is
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status;
    }

    // Count completed subtasks
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = task.subtasks.length;

    // If all subtasks are completed, task is done
    if (completedSubtasks === totalSubtasks && totalSubtasks > 0) {
      return "done";
    }
    // If some subtasks are completed, task is in progress
    else if (completedSubtasks > 0) {
      return "in-progress";
    }
    // If no subtasks are completed, task is pending
    else {
      return "pending";
    }
  };

  const updateTasksBasedOnSubtasks = async () => {
    if (!tasks) return;
    
    try {
      const updatedTasks = tasks.map(task => {
        const calculatedStatus = calculateTaskStatus(task);
        return { ...task, calculatedStatus };
      }).filter(task => task.status !== task.calculatedStatus);
      
      if (updatedTasks.length === 0) return;
      
      // Update each task that needs status change
      for (const task of updatedTasks) {
        await updateTaskStatus(task.id, task.calculatedStatus as TaskStatus);
      }
    } catch (error) {
      console.error("Error updating tasks based on subtasks:", error);
    }
  };

  return {
    tasks,
    isLoading,
    refetch,
    updateTaskStatus,
    calculateTaskStatus,
    updateTasksBasedOnSubtasks
  };
};
