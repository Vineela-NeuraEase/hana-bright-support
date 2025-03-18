
export type TaskStatus = 'pending' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  spiciness?: number;
  subtasks?: { title: string; completed: boolean }[];
  created_at?: string;
  updated_at?: string;
}
