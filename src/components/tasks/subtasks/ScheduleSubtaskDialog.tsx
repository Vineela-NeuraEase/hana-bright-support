
import { useState } from "react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ScheduleSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  subtaskTitle: string;
  onSuccess: () => void;
}

export const ScheduleSubtaskDialog = ({ 
  open, 
  onOpenChange, 
  task, 
  subtaskTitle,
  onSuccess 
}: ScheduleSubtaskDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [scheduledTitle, setScheduledTitle] = useState(subtaskTitle);
  
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
      // Get the current user session first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from("tasks")
        .insert({
          title: scheduledTitle,
          status: "pending",
          priority: "medium",
          due_date: scheduledDate.toISOString(),
          user_id: sessionData.session.user.id
        });
        
      if (error) throw error;
      
      toast({ 
        title: "Task scheduled", 
        description: `Task scheduled for ${format(scheduledDate, "PPP")}.` 
      });
      onOpenChange(false);
      onSuccess();
      
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Calendar
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
            onClick={() => onOpenChange(false)}
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
  );
};
