
import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TaskStatusBadge from "./TaskStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import SubtasksList from "./SubtasksList";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TasksListProps {
  tasks?: Task[];
  isLoading?: boolean;
  onStatusUpdate: (taskId: string, currentStatus: TaskStatus) => void;
  refetchTasks: () => void;
}

const TasksList = ({ tasks, isLoading, onStatusUpdate, refetchTasks }: TasksListProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No tasks found. Create your first task to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 mr-2 h-8 w-8"
                onClick={() => toggleExpand(task.id)}
              >
                {expandedTasks[task.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
              <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusUpdate(task.id, task.status)}
            >
              <TaskStatusBadge status={task.status} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="capitalize">Priority: {task.priority}</span>
              {task.spiciness && <span>Spiciness: {task.spiciness}</span>}
            </div>
            
            {expandedTasks[task.id] && (
              <SubtasksList task={task} refetchTasks={refetchTasks} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TasksList;
