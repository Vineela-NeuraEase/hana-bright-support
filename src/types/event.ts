
import { Task } from "./task";

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  startTime: string | Date;  // This maps to start_time in the database
  endTime: string | Date;    // This maps to end_time in the database
  reminders?: number[];      // minutes before
  linkedTaskId?: string;     // This maps to linked_task_id in the database
  linkedTask?: Task;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  reminders: number[];
  linkedTaskId?: string;
}
