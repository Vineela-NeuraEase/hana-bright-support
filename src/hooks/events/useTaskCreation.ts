
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTaskCreation = (refetchTasks: () => void) => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const { toast } = useToast();
  
  const createTask = async (title: string, description: string, dueDate: Date) => {
    setIsCreatingTask(true);
    try {
      // Get the current user session first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          // We don't include description as it's not in the database schema
          status: "pending",
          priority: "medium",
          due_date: dueDate.toISOString(),
          user_id: sessionData.session.user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh tasks list
      refetchTasks();
      
      toast({
        title: "Task created",
        description: "A new task has been created from this event."
      });
      
      return data.id;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        variant: "destructive",
        title: "Error creating task",
        description: "Failed to create a task from this event."
      });
      return null;
    } finally {
      setIsCreatingTask(false);
    }
  };
  
  return { createTask, isCreatingTask };
};
