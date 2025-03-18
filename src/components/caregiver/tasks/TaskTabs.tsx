
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskTabContent } from "./TaskTabContent";
import { Task, TaskStatus } from "@/types/task";

interface TaskTabsProps {
  pendingTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
  isLoading: boolean;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void;
  refetchTasks: () => void;
}

export const TaskTabs = ({
  pendingTasks,
  inProgressTasks,
  doneTasks,
  isLoading,
  onStatusUpdate,
  refetchTasks
}: TaskTabsProps) => {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
        <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
        <TabsTrigger value="done">Completed ({doneTasks.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <TaskTabContent 
          tasks={pendingTasks} 
          isLoading={isLoading} 
          onStatusUpdate={onStatusUpdate} 
          refetchTasks={refetchTasks} 
        />
      </TabsContent>
      
      <TabsContent value="in-progress">
        <TaskTabContent 
          tasks={inProgressTasks} 
          isLoading={isLoading} 
          onStatusUpdate={onStatusUpdate} 
          refetchTasks={refetchTasks} 
        />
      </TabsContent>
      
      <TabsContent value="done">
        <TaskTabContent 
          tasks={doneTasks} 
          isLoading={isLoading} 
          onStatusUpdate={onStatusUpdate} 
          refetchTasks={refetchTasks} 
        />
      </TabsContent>
    </Tabs>
  );
};
