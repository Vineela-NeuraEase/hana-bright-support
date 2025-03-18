
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { Task, TaskStatus } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export const useFirebaseTasks = (specificUserId?: string) => {
  const { toast } = useToast();
  const { user } = useFirebaseAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user && !specificUserId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const userId = specificUserId || user?.uid;
    if (!userId) return;

    setIsLoading(true);
    
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("user_id", "==", userId));
    
    // Set up real-time listener for tasks
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          tasksData.push({
            id: doc.id,
            ...doc.data(),
          } as Task);
        });
        setTasks(tasksData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tasks. Please try again.",
        });
        setIsLoading(false);
      }
    );
    
    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [user, specificUserId, toast]);

  const refetch = () => {
    // This is a no-op in Firebase because we're using real-time listeners
    // The data will automatically update when changes occur
    console.log("Refetch called but not needed with Firebase real-time listeners");
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: newStatus,
        updated_at: new Date()
      });
      
      toast({
        title: "Task updated",
        description: `Task has been moved to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
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
    if (!tasks.length) return;
    
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
