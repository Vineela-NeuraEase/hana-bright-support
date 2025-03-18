
import { Task } from "@/types/task";
import { GenerateSubtasks } from "./subtasks/GenerateSubtasks";
import { SubtasksManager } from "./subtasks/SubtasksManager";
import { FallbackAlert } from "./subtasks/FallbackAlert";

interface SubtasksListProps {
  task: Task;
  refetchTasks: () => void;
}

const SubtasksList = ({ task, refetchTasks }: SubtasksListProps) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="mt-4">
      {!hasSubtasks && (
        <GenerateSubtasks task={task} refetchTasks={refetchTasks} />
      )}

      {hasSubtasks && (
        <SubtasksManager task={task} refetchTasks={refetchTasks} />
      )}
    </div>
  );
};

export default SubtasksList;
