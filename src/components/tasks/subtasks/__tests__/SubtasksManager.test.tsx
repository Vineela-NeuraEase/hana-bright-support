
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubtasksManager } from '../SubtasksManager';
import { Task } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({ error: null }),
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn()
  })
}));

jest.mock('../SubtaskItem', () => ({
  SubtaskItem: ({ task, subtask, index }) => (
    <div data-testid={`subtask-item-${index}`}>
      {subtask.title} - {String(subtask.completed)}
    </div>
  )
}));

jest.mock('../AddSubtaskForm', () => ({
  AddSubtaskForm: () => <div data-testid="add-subtask-form">Add Subtask Form</div>
}));

describe('SubtasksManager', () => {
  const mockTask: Task = {
    id: 'task-id',
    title: 'Test Task',
    user_id: 'user-id',
    status: 'pending',
    priority: 'medium',
    subtasks: [
      { title: 'Subtask 1', completed: false },
      { title: 'Subtask 2', completed: true }
    ]
  };
  const mockRefetchTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct number of subtasks', () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByTestId('subtask-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('subtask-item-1')).toBeInTheDocument();
    expect(screen.getByText('Completed: 1 / 2')).toBeInTheDocument();
  });

  it('does not render the add subtask form initially', () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.queryByTestId('add-subtask-form')).not.toBeInTheDocument();
  });

  it('renders the "Add step" button', () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByText('Add step')).toBeInTheDocument();
  });

  it('renders the "Complete all" button', () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByText('Complete all')).toBeInTheDocument();
  });

  it('renders the "Clear completed" button', () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  it('handles the "Complete all" button click', async () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Complete all'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(supabase.update).toHaveBeenCalledWith({ 
        subtasks: [
          { title: 'Subtask 1', completed: true },
          { title: 'Subtask 2', completed: true }
        ] 
      });
      expect(mockRefetchTasks).toHaveBeenCalled();
    });
  });

  it('handles the "Clear completed" button click', async () => {
    render(<SubtasksManager task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Clear completed'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(supabase.update).toHaveBeenCalledWith({ 
        subtasks: [
          { title: 'Subtask 1', completed: false }
        ] 
      });
      expect(mockRefetchTasks).toHaveBeenCalled();
    });
  });

  it('handles when task has no subtasks', () => {
    const taskWithoutSubtasks: Task = {
      ...mockTask,
      subtasks: undefined
    };
    
    const { container } = render(
      <SubtasksManager task={taskWithoutSubtasks} refetchTasks={mockRefetchTasks} />
    );
    
    expect(container).toBeEmptyDOMElement();
  });
});
