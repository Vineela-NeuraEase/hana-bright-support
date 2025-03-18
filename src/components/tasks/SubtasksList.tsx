
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SubtasksListProps {
  task: Task;
  refetchTasks: () => void;
}

const SubtasksList = ({ task, refetchTasks }: SubtasksListProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleGenerateSubtasks = async () => {
    setGeneratingSubtasks(true);
    setFallbackMode(false);
    setApiError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("break-down-task", {
        body: {
          task: task.title,
          spiciness: task.spiciness || 3,
        },
      });

      if (error) throw error;
      
      if (!data.steps || data.steps.length === 0) {
        throw new Error("No steps were generated. Please try again.");
      }

      // Check if fallback mode was used
      if (data.fallback) {
        setFallbackMode(true);
        if (data.error_message) {
          setApiError(data.error_message);
        }
      }

      // Update the task with subtasks
      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          subtasks: data.steps
        })
        .eq("id", task.id);

      if (updateError) throw updateError;
      
      toast({
        title: data.fallback 
          ? "Task broken down (using fallback)" 
          : "Task broken down successfully",
        description: `Generated ${data.steps.length} subtasks for this task.`,
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error generating subtasks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate subtasks. Please try again.",
      });
    } finally {
      setGeneratingSubtasks(false);
    }
  };

  const handleToggleSubtask = async (index: number) => {
    if (!task.subtasks) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        completed: !updatedSubtasks[index].completed,
      };

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      refetchTasks();
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subtask status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {!hasSubtasks && (
        <div className="flex flex-col items-center py-6">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={handleGenerateSubtasks}
            disabled={generatingSubtasks}
          >
            {generatingSubtasks ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Breaking down task...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Break down this task
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Let Hannah break this task into manageable steps based on the spiciness level.
          </p>
        </div>
      )}

      {fallbackMode && apiError && (
        <Alert variant="destructive" className="mt-3 mb-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>AI Service Limited</AlertTitle>
          <AlertDescription>
            Using simplified breakdown due to AI service limitation: {apiError}
          </AlertDescription>
        </Alert>
      )}

      {hasSubtasks && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium mb-2">Subtasks:</h3>
          {task.subtasks.map((subtask, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox
                id={`subtask-${task.id}-${index}`}
                checked={subtask.completed}
                onCheckedChange={() => handleToggleSubtask(index)}
                disabled={loading}
                className="mt-1"
              />
              <label
                htmlFor={`subtask-${task.id}-${index}`}
                className={`text-sm ${
                  subtask.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {subtask.title}
              </label>
            </div>
          ))}
          
          <div className="mt-4 text-xs text-right">
            Completed: {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtasksList;
