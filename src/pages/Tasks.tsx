
import TaskForm from "@/components/tasks/TaskForm";
import TasksList from "@/components/tasks/TasksList";
import { useTasks } from "@/hooks/tasks/useTasks";

const Tasks = () => {
  const { tasks, isLoading, refetch, updateTaskStatus } = useTasks();

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskForm onTaskAdded={refetch} />
      </div>

      <TasksList 
        tasks={tasks} 
        isLoading={isLoading} 
        onStatusUpdate={updateTaskStatus} 
      />
    </div>
  );
};

export default Tasks;
