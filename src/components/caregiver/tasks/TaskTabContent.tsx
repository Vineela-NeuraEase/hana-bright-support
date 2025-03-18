
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TasksList from "@/components/tasks/TasksList";
import { Task, TaskStatus } from "@/types/task";

interface TaskTabContentProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void;
  refetchTasks: () => void;
}

export const TaskTabContent = ({ 
  tasks, 
  isLoading, 
  onStatusUpdate, 
  refetchTasks 
}: TaskTabContentProps) => {
  return (
    <Card className="p-4">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <TasksList 
          tasks={tasks} 
          onStatusUpdate={onStatusUpdate} 
          refetchTasks={refetchTasks}
        />
      )}
    </Card>
  );
};
