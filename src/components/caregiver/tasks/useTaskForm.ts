
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { taskFormSchema, TaskFormData } from "./schema";

interface UseTaskFormProps {
  onTaskAdded: () => void;
  userId: string;
  onClose: () => void;
}

export const useTaskForm = ({ onTaskAdded, userId, onClose }: UseTaskFormProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const { profile } = useProfile(session);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      spiciness: 3,
      due_date: "",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Ensure data has a non-empty title
      if (!data.title.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Task title is required.",
        });
        return;
      }

      const currentUser = await supabase.auth.getUser();
      const { error } = await supabase
        .from("tasks")
        .insert({
          title: data.title + " (Added by Caregiver)",
          description: data.description,
          priority: data.priority,
          spiciness: data.spiciness,
          due_date: data.due_date || null,
          status: 'pending',
          user_id: userId, // Use the passed userId (the linked user)
          created_by: currentUser.data.user?.id, // The caregiver who created this task
          created_by_role: profile?.role,
          subtasks: []
        });
      
      if (error) throw error;

      toast({
        title: "Task created",
        description: "Task has been added to the user's list.",
      });
      onClose();
      form.reset();
      onTaskAdded();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again.",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};
