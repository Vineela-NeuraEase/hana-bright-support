
import { Event } from "@/types/event";

// Transform database event to client format
export const transformDbEventToClient = (event: any): Event => ({
  id: event.id,
  user_id: event.user_id,
  title: event.title,
  description: event.description,
  startTime: event.start_time,
  endTime: event.end_time,
  reminders: event.reminders,
  linkedTaskId: event.linked_task_id,
  linkedTask: event.linkedTask,
  color: event.color,
  created_at: event.created_at,
  updated_at: event.updated_at,
});

// Transform client event to database format for insert
export const transformClientEventToDb = (event: AddEventParams, userId: string) => {
  // Convert Date objects to ISO strings for Supabase
  const startTime = event.startTime instanceof Date 
    ? event.startTime.toISOString() 
    : event.startTime;
  
  const endTime = event.endTime instanceof Date 
    ? event.endTime.toISOString() 
    : event.endTime;
  
  // Transform our camelCase properties to snake_case for the database
  return {
    title: event.title,
    description: event.description,
    start_time: startTime,
    end_time: endTime,
    reminders: event.reminders,
    linked_task_id: event.linkedTaskId,
    color: event.color,
    user_id: userId
  };
};

// Transform client updates to database format
export const transformClientUpdatesToDb = (updates: UpdateEventParams) => {
  const dbUpdates: any = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  
  if (updates.startTime !== undefined) {
    dbUpdates.start_time = updates.startTime instanceof Date 
      ? updates.startTime.toISOString() 
      : updates.startTime;
  }
  
  if (updates.endTime !== undefined) {
    dbUpdates.end_time = updates.endTime instanceof Date 
      ? updates.endTime.toISOString() 
      : updates.endTime;
  }
  
  if (updates.reminders !== undefined) dbUpdates.reminders = updates.reminders;
  if (updates.linkedTaskId !== undefined) dbUpdates.linked_task_id = updates.linkedTaskId;
  if (updates.color !== undefined) dbUpdates.color = updates.color;
  
  return dbUpdates;
};
