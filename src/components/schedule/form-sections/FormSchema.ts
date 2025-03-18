
import { z } from "zod";

// Form schema for event creation/editing
export const formSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.date({
    required_error: "End date is required",
  }),
  endTime: z.string().min(1, "End time is required"),
  linkedTaskId: z.string().optional(),
  reminders: z.array(z.number()).default([]),
  createNewTask: z.boolean().default(false),
});

export type EventFormValues = z.infer<typeof formSchema>;
