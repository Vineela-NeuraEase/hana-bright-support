
import React from "react";
import { Task } from "@/types/task";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface TaskLinkSelectorProps {
  tasks: Task[];
  form: UseFormReturn<any>;
}

export const TaskLinkSelector = ({ tasks, form }: TaskLinkSelectorProps) => {
  if (!tasks || tasks.length === 0) return null;
  
  return (
    <FormField
      control={form.control}
      name="linkedTaskId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Link to Task (Optional)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {tasks.map((task: Task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
