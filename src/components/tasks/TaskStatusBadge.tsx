
import { TaskStatus } from "@/types/task";

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

export default TaskStatusBadge;
