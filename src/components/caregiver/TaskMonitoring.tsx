
import { useTaskMonitoring } from "@/hooks/tasks/useTaskMonitoring";
import { TaskHeader } from "./tasks/TaskHeader";
import { TaskTabs } from "./tasks/TaskTabs";
import { TaskError } from "./tasks/TaskError";

interface TaskMonitoringProps {
  userId: string;
}

export const TaskMonitoring = ({ userId }: TaskMonitoringProps) => {
  const {
    pendingTasks,
    inProgressTasks,
    doneTasks,
    isLoading,
    error,
    fetchTasks,
    updateTaskStatus
  } = useTaskMonitoring(userId);

  if (error) {
    return <TaskError message={error} />;
  }

  return (
    <div className="space-y-6">
      <TaskHeader userId={userId} onTaskAdded={fetchTasks} />
      
      <TaskTabs 
        pendingTasks={pendingTasks}
        inProgressTasks={inProgressTasks}
        doneTasks={doneTasks}
        isLoading={isLoading}
        onStatusUpdate={updateTaskStatus}
        refetchTasks={fetchTasks}
      />
    </div>
  );
};
