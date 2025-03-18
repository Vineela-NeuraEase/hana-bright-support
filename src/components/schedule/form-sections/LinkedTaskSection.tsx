
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Task } from "@/types/task";
import { EventFormValues } from "./FormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskLinkSelector } from "../event-dialog/TaskLinkSelector";

interface LinkedTaskSectionProps {
  tasks: Task[];
  form: UseFormReturn<EventFormValues>;
  createNewTask: boolean;
  onCreateNewTaskChange: (checked: boolean) => void;
}

export const LinkedTaskSection = ({ 
  tasks, 
  form, 
  createNewTask, 
  onCreateNewTaskChange 
}: LinkedTaskSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="createNewTask"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
            <FormControl>
              <Checkbox
                checked={createNewTask}
                onCheckedChange={onCreateNewTaskChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Create a new task for this event
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      {!createNewTask && (
        <TaskLinkSelector tasks={tasks} form={form} />
      )}
    </div>
  );
};
