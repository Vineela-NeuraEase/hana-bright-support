
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseFormReturn } from "react-hook-form";

// Common reminder options
export const reminderOptions = [
  { label: "5 minutes before", value: 5 },
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before", value: 60 },
  { label: "2 hours before", value: 120 },
  { label: "1 day before", value: 1440 },
];

interface ReminderSelectorProps {
  form: UseFormReturn<any>;
}

export const ReminderSelector = ({ form }: ReminderSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="reminders"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Reminders (Optional)</FormLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {field.value.length === 0 
                  ? "No reminders set" 
                  : `${field.value.length} reminder${field.value.length > 1 ? 's' : ''} set`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {reminderOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...field.value, option.value]);
                    } else {
                      field.onChange(
                        field.value.filter((value: number) => value !== option.value)
                      );
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
