
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddSubtaskForm } from "./AddSubtaskForm";
import { format, addDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface SubtaskItemProps {
  task: Task;
  subtask: { title: string; completed: boolean };
  index: number;
  refetchTasks: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export const SubtaskItem = ({ 
  task,
  subtask,
  index,
  refetchTasks,
  isEditing,
  onStartEdit,
  onCancelEdit
}: SubtaskItemProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [scheduledTitle, setScheduledTitle] = useState("");

  const handleToggleSubtask = async () => {
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

  const handleDeleteStep = async () => {
    if (!task.subtasks) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks.splice(index, 1);

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "Step removed",
        description: "The step has been removed from the task breakdown.",
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error removing step:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the step. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStep = async (direction: 'up' | 'down') => {
    if (!task.subtasks) return;
    
    // Can't move up if already at the top
    if (direction === 'up' && index === 0) return;
    // Can't move down if already at the bottom
    if (direction === 'down' && index === task.subtasks.length - 1) return;
    
    setLoading(true);
    try {
      const updatedSubtasks = [...task.subtasks];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap the items
      [updatedSubtasks[index], updatedSubtasks[newIndex]] = 
      [updatedSubtasks[newIndex], updatedSubtasks[index]];

      const { error } = await supabase
        .from("tasks")
        .update({ subtasks: updatedSubtasks })
        .eq("id", task.id);

      if (error) throw error;
      
      toast({
        title: "Step moved",
        description: `The step has been moved ${direction}.`,
      });
      
      refetchTasks();
    } catch (error) {
      console.error("Error moving step:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to move the step ${direction}. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubtask = () => {
    setScheduledTitle(subtask.title);
    setShowScheduleDialog(true);
  };
  
  const createScheduledTask = async () => {
    if (!scheduledDate || !scheduledTitle) {
      toast({
        variant: "destructive", 
        title: "Error", 
        description: "Please set both title and date for the scheduled task."
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .insert({
          title: scheduledTitle,
          description: `Scheduled from task: ${task.title}`,
          status: "pending",
          priority: "medium",
          due_date: scheduledDate.toISOString(),
        });
        
      if (error) throw error;
      
      toast({ 
        title: "Task scheduled", 
        description: `Task scheduled for ${format(scheduledDate, "PPP")}.` 
      });
      setShowScheduleDialog(false);
      
    } catch (error) {
      console.error("Error scheduling task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule this task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (isEditing) {
    return (
      <AddSubtaskForm 
        task={task}
        refetchTasks={refetchTasks}
        onCancel={onCancelEdit}
        initialValue={subtask.title}
        insertAtIndex={index}
        isEditing
        onDelete={() => handleDeleteStep()}
      />
    );
  }

  return (
    <>
      <div className="group flex items-start space-x-2">
        <Checkbox
          id={`subtask-${task.id}-${index}`}
          checked={subtask.completed}
          onCheckedChange={handleToggleSubtask}
          disabled={loading}
          className="mt-1"
        />
        <label
          htmlFor={`subtask-${task.id}-${index}`}
          className={`flex-grow text-sm ${
            subtask.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {subtask.title}
        </label>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleScheduleSubtask}
          >
            <Calendar className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onStartEdit}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDeleteStep}
            disabled={loading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleMoveStep('up')}
            disabled={loading || index === 0}
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleMoveStep('down')}
            disabled={loading || index === (task.subtasks?.length || 0) - 1}
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule as a Future Task</DialogTitle>
            <DialogDescription>
              Create this step as a separate task for a future date.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-title">Task Title</Label>
              <Input 
                id="scheduled-title" 
                value={scheduledTitle} 
                onChange={(e) => setScheduledTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={createScheduledTask} 
              disabled={loading || !scheduledTitle || !scheduledDate}
            >
              Schedule Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
