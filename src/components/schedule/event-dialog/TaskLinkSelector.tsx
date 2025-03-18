
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Task } from "@/types/task";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventFormValues } from "../EventForm";

interface TaskLinkSelectorProps {
  tasks: Task[];
  form: UseFormReturn<EventFormValues>;
}

export const TaskLinkSelector = ({ tasks, form }: TaskLinkSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="linkedTaskId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Link to Task (Optional)</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value === "no-task" ? "" : value);
            }}
            value={field.value || "no-task"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="no-task">None</SelectItem>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
