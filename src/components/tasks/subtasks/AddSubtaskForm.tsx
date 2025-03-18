import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AddSubtaskFormProps {
  task: Task;
  refetchTasks: () => void;
  onCancel: () => void;
  initialValue?: string;
  insertAtIndex: number | null;
  isEditing?: boolean;
  onDelete?: () => void;
}

export const AddSubtaskForm = ({ 
  task, 
  refetchTasks, 
  onCancel, 
  initialValue = "",
  insertAtIndex,
  isEditing = false,
  onDelete
}: AddSubtaskFormProps) => {
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState(initialValue);
  const [addingSuggestion, setAddingSuggestion] = useState(false);

  const handleAddStep = async () => {
    if (!suggestion.trim() || !task.subtasks) return;
    
    setAddingSuggestion(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      
      if (isEditing && insertAtIndex !== null) {
        // If editing, remove the old subtask first
        updatedSubtasks.splice(insertAtIndex, 1);
      }
      
      // If an index is provided, insert at that position
      // Otherwise, add to the end
      if (insertAtIndex !== null) {
        updatedSubtasks.splice(insertAtIndex, 0, { 
          title: suggestion.trim(),
          completed: false
        });
      } else {
        updatedSubtasks.push({ 
          title: suggestion.trim(),
          completed: false
        });
      }

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: isEditing ? "Step updated" : "Step added",
        description: isEditing 
          ? "Your step has been updated."
          : "Your step has been added to the task breakdown.",
      });
      
      setSuggestion("");
      onCancel();
      refetchTasks();
    } catch (error) {
      console.error("Error adding/updating step:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isEditing 
          ? "Failed to update your step. Please try again."
          : "Failed to add your step. Please try again.",
      });
    } finally {
      setAddingSuggestion(false);
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <Textarea
        placeholder="Enter a new step to add to the breakdown..."
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        className="w-full text-sm"
      />
      <div className="flex space-x-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        {isEditing && onDelete && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleAddStep}
          disabled={!suggestion.trim() || addingSuggestion}
        >
          {addingSuggestion ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update" : "Add Step"
          )}
        </Button>
      </div>
    </div>
  );
};
