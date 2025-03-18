
export type TaskStatus = 'pending' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string; // Already defined here, but the database might not have this column
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  spiciness?: number;
  subtasks?: { title: string; completed: boolean }[];
  created_at?: string;
  updated_at?: string;
}
