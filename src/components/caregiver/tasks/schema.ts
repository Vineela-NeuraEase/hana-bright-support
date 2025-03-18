
import { z } from "zod";

// Define the form validation schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"] as const),
  spiciness: z.number().min(1).max(5).optional(),
  due_date: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
