
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FallbackAlert } from "./FallbackAlert";

interface GenerateSubtasksProps {
  task: Task;
  refetchTasks: () => void;
}

export const GenerateSubtasks = ({ task, refetchTasks }: GenerateSubtasksProps) => {
  const { toast } = useToast();
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  return (
    <>
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

      {fallbackMode && apiError && (
        <FallbackAlert error={apiError} />
      )}
    </>
  );
};
