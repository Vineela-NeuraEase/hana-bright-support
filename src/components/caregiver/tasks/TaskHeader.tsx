
import TaskForm from "../CaregiverTaskForm";

interface TaskHeaderProps {
  userId: string;
  onTaskAdded: () => void;
}

export const TaskHeader = ({ userId, onTaskAdded }: TaskHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Task Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and manage tasks for this user
        </p>
      </div>
      <TaskForm onTaskAdded={onTaskAdded} userId={userId} />
    </div>
  );
};
