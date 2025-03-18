
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddSubtaskForm } from '../AddSubtaskForm';
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
  useToast: jest.fn(),
}));

describe('AddSubtaskForm', () => {
  const mockTask = {
    id: 'task-id',
    title: 'Test Task',
    user_id: 'user-id',
    status: 'pending' as const,
    priority: 'medium' as const,
    subtasks: [
      { title: 'Existing Subtask', completed: false },
    ]
  };
  const mockRefetchTasks = jest.fn();
  const mockOnCancel = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('renders the form with textarea and buttons', () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        insertAtIndex={null}
      />
    );
    
    expect(screen.getByPlaceholderText('Enter a new step to add to the breakdown...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add Step')).toBeInTheDocument();
  });

  it('disables the add button when textarea is empty', () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        insertAtIndex={null}
      />
    );
    
    expect(screen.getByText('Add Step')).toHaveAttribute('disabled');
  });

  it('enables the add button when text is entered', () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        insertAtIndex={null}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter a new step to add to the breakdown...');
    fireEvent.change(textarea, { target: { value: 'New step' } });
    
    expect(screen.getByText('Add Step')).not.toHaveAttribute('disabled');
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        insertAtIndex={null}
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('adds a new subtask when form is submitted', async () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        insertAtIndex={null}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter a new step to add to the breakdown...');
    fireEvent.change(textarea, { target: { value: 'New step' } });
    fireEvent.click(screen.getByText('Add Step'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockRefetchTasks).toHaveBeenCalled();
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  it('handles edit mode correctly with initial value', () => {
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        initialValue="Step to edit"
        insertAtIndex={0}
        isEditing={true}
      />
    );
    
    expect(screen.getByDisplayValue('Step to edit')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('shows delete button when in edit mode', () => {
    const mockOnDelete = jest.fn();
    
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        initialValue="Step to edit"
        insertAtIndex={0}
        isEditing={true}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    
    render(
      <AddSubtaskForm 
        task={mockTask}
        refetchTasks={mockRefetchTasks}
        onCancel={mockOnCancel}
        initialValue="Step to edit"
        insertAtIndex={0}
        isEditing={true}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockOnDelete).toHaveBeenCalled();
  });
});
