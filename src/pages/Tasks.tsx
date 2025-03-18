
import { useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TasksList from "@/components/tasks/TasksList";
import { useTasks } from "@/hooks/tasks/useTasks";
import { Task } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const { tasks, isLoading, refetch, updateTaskStatus } = useTasks();
  const { toast } = useToast();
  
  // Filter tasks by status
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress") || [];
  const doneTasks = tasks?.filter(task => task.status === "done") || [];
  
  // Count tasks that need attention
  const countTasksNeedingAttention = (taskList: Task[]) => {
    return taskList.filter(task => {
      if (!task.subtasks || task.subtasks.length === 0) return false;
      
      // Check if any subtasks are incomplete
      const hasIncompleteSubtasks = task.subtasks.some(subtask => !subtask.completed);
      
      if (!hasIncompleteSubtasks) return false;
      
      // Check if task is due today or overdue
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const today = new Date();
        return (
          dueDate.getDate() === today.getDate() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getFullYear() === today.getFullYear()
        ) || dueDate < today;
      }
      
      return false;
    }).length;
  };
  
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and break them down into manageable steps
          </p>
        </div>
        <TaskForm onTaskAdded={refetch} />
      </div>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="pending" className="relative">
            Pending
            {countTasksNeedingAttention(pendingTasks) > 0 && (
              <span className="absolute top-0 right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {countTasksNeedingAttention(pendingTasks)}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="relative">
            In Progress
            {countTasksNeedingAttention(inProgressTasks) > 0 && (
              <span className="absolute top-0 right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {countTasksNeedingAttention(inProgressTasks)}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="done">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card className="p-4">
            <TasksList 
              tasks={pendingTasks} 
              isLoading={isLoading} 
              onStatusUpdate={updateTaskStatus} 
              refetchTasks={refetch}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <Card className="p-4">
            <TasksList 
              tasks={inProgressTasks} 
              isLoading={isLoading} 
              onStatusUpdate={updateTaskStatus} 
              refetchTasks={refetch}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="done">
          <Card className="p-4">
            <TasksList 
              tasks={doneTasks} 
              isLoading={isLoading} 
              onStatusUpdate={updateTaskStatus} 
              refetchTasks={refetch}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
