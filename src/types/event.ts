
import { Task } from "./task";

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  startTime: string | Date;
  endTime: string | Date;
  reminders?: number[];  // minutes before
  linkedTaskId?: string;
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
