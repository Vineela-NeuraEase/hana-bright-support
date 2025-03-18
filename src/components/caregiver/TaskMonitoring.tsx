
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import TasksList from "@/components/tasks/TasksList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TaskForm from "./CaregiverTaskForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TaskMonitoringProps {
  userId: string;
}

export const TaskMonitoring = ({ userId }: TaskMonitoringProps) => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [userId]);

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

  // Filter tasks by status
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress") || [];
  const doneTasks = tasks?.filter(task => task.status === "done") || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Task Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor and manage tasks for this user
          </p>
        </div>
        <TaskForm onTaskAdded={fetchTasks} userId={userId} />
      </div>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="done">Completed ({doneTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <TasksList 
                tasks={pendingTasks} 
                onStatusUpdate={updateTaskStatus} 
                refetchTasks={fetchTasks}
              />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <Card className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <TasksList 
                tasks={inProgressTasks} 
                onStatusUpdate={updateTaskStatus} 
                refetchTasks={fetchTasks}
              />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="done">
          <Card className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <TasksList 
                tasks={doneTasks} 
                onStatusUpdate={updateTaskStatus} 
                refetchTasks={fetchTasks}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
