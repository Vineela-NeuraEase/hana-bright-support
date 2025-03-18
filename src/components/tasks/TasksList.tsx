import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TaskStatusBadge from "./TaskStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import SubtasksList from "./SubtasksList";
import { useState } from "react";
import { 
  AlertCircle,
  Calendar,
  ChevronDown, 
  ChevronUp,
  LinkIcon
} from "lucide-react";
import { format, isToday, isPast, parseISO } from "date-fns";

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

  // Calculate if a task needs attention (has subtasks not completed and is due today or overdue)
  const needsAttention = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) return false;
    
    // Check if any subtasks are incomplete
    const hasIncompleteSubtasks = task.subtasks.some(subtask => !subtask.completed);
    
    if (!hasIncompleteSubtasks) return false;
    
    // Check if task is due today or overdue
    if (task.due_date) {
      const dueDate = parseISO(task.due_date);
      return isToday(dueDate) || isPast(dueDate);
    }
    
    return false;
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
      {tasks.map((task) => {
        const requiresAttention = needsAttention(task);
        return (
          <Card 
            key={task.id} 
            className={`hover:shadow-md transition-shadow ${
              requiresAttention ? "border-orange-300" : ""
            }`}
          >
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
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">
                      {task.title}
                    </CardTitle>
                    {requiresAttention && (
                      <AlertCircle 
                        className="h-4 w-4 text-orange-500" 
                        aria-label="This task needs attention" 
                      />
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
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
                <span className={`capitalize ${task.priority === 'high' ? 'text-rose-500' : task.priority === 'low' ? 'text-slate-500' : ''}`}>
                  Priority: {task.priority}
                </span>
                
                {task.spiciness && 
                  <span>Complexity: {task.spiciness}</span>
                }
                
                {task.due_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) 
                      ? <span className="text-red-500">Overdue: {format(parseISO(task.due_date), "PPP")}</span>
                      : isToday(parseISO(task.due_date))
                        ? <span className="text-orange-500">Due Today</span>
                        : <span>Due: {format(parseISO(task.due_date), "PPP")}</span>
                    }
                  </span>
                )}
              </div>
              
              {task.subtasks && task.subtasks.length > 0 && !expandedTasks[task.id] && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} steps completed
                  {requiresAttention && (
                    <span className="ml-2 text-orange-500">
                      Action required! Click to expand.
                    </span>
                  )}
                </div>
              )}
              
              {expandedTasks[task.id] && (
                <SubtasksList task={task} refetchTasks={refetchTasks} />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TasksList;
