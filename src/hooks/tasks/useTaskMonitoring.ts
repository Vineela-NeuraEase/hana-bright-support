
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTaskMonitoring = (userId: string) => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to ensure subtasks are properly typed
      const transformedTasks = data.map(task => ({
        ...task,
        subtasks: task.subtasks ? (Array.isArray(task.subtasks) ? task.subtasks : JSON.parse(task.subtasks as string)) : []
      })) as Task[];

      setTasks(transformedTasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'done') => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
      
      fetchTasks();
      
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

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  // Filter tasks by status
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress") || [];
  const doneTasks = tasks?.filter(task => task.status === "done") || [];

  return {
    tasks,
    pendingTasks,
    inProgressTasks,
    doneTasks,
    isLoading,
    error,
    fetchTasks,
    updateTaskStatus
  };
};
