
import { render, screen } from '@testing-library/react';
import SubtasksList from '../SubtasksList';
import { Task } from '@/types/task';

// Mock dependencies
jest.mock('../subtasks/GenerateSubtasks', () => ({
  GenerateSubtasks: ({ task }) => <div data-testid="generate-subtasks">{task.title}</div>
}));

jest.mock('../subtasks/SubtasksManager', () => ({
  SubtasksManager: ({ task }) => <div data-testid="subtasks-manager">{task.title}</div>
}));

describe('SubtasksList', () => {
  const mockTask: Task = {
    id: 'task-id',
    title: 'Test Task',
    user_id: 'user-id',
    status: 'pending',
    priority: 'medium',
  };
  
  const mockTaskWithSubtasks: Task = {
    ...mockTask,
    subtasks: [{ title: 'Subtask 1', completed: false }]
  };
  
  const mockRefetchTasks = jest.fn();

  it('renders GenerateSubtasks when task has no subtasks', () => {
    render(<SubtasksList task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByTestId('generate-subtasks')).toBeInTheDocument();
    expect(screen.queryByTestId('subtasks-manager')).not.toBeInTheDocument();
  });

  it('renders SubtasksManager when task has subtasks', () => {
    render(<SubtasksList task={mockTaskWithSubtasks} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByTestId('subtasks-manager')).toBeInTheDocument();
    expect(screen.queryByTestId('generate-subtasks')).not.toBeInTheDocument();
  });
});
