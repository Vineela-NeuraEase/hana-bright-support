
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubtaskItem } from '../SubtaskItem';
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

jest.mock('../AddSubtaskForm', () => ({
  AddSubtaskForm: ({ isEditing }) => (
    <div data-testid="add-subtask-form">
      {isEditing ? 'Edit Form' : 'Add Form'}
    </div>
  ),
}));

describe('SubtaskItem', () => {
  const mockTask = {
    id: 'task-id',
    title: 'Test Task',
    user_id: 'user-id',
    status: 'pending' as const,
    priority: 'medium' as const,
    subtasks: [
      { title: 'Subtask 1', completed: false },
      { title: 'Subtask 2', completed: true }
    ]
  };
  const mockSubtask = { title: 'Subtask 1', completed: false };
  const mockIndex = 0;
  const mockRefetchTasks = jest.fn();
  const mockStartEdit = jest.fn();
  const mockCancelEdit = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('renders the subtask title', () => {
    render(
      <SubtaskItem
        task={mockTask}
        subtask={mockSubtask}
        index={mockIndex}
        refetchTasks={mockRefetchTasks}
        isEditing={false}
        onStartEdit={mockStartEdit}
        onCancelEdit={mockCancelEdit}
      />
    );
    
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
  });

  it('applies line-through style to completed subtasks', () => {
    const completedSubtask = { ...mockSubtask, completed: true };
    
    render(
      <SubtaskItem
        task={mockTask}
        subtask={completedSubtask}
        index={mockIndex}
        refetchTasks={mockRefetchTasks}
        isEditing={false}
        onStartEdit={mockStartEdit}
        onCancelEdit={mockCancelEdit}
      />
    );
    
    const label = screen.getByLabelText(/subtask 1/i);
    expect(label).toHaveClass('line-through');
  });

  it('renders edit form when isEditing is true', () => {
    render(
      <SubtaskItem
        task={mockTask}
        subtask={mockSubtask}
        index={mockIndex}
        refetchTasks={mockRefetchTasks}
        isEditing={true}
        onStartEdit={mockStartEdit}
        onCancelEdit={mockCancelEdit}
      />
    );
    
    expect(screen.getByTestId('add-subtask-form')).toBeInTheDocument();
    expect(screen.getByText('Edit Form')).toBeInTheDocument();
  });

  it('calls onStartEdit when the edit button is clicked', () => {
    render(
      <SubtaskItem
        task={mockTask}
        subtask={mockSubtask}
        index={mockIndex}
        refetchTasks={mockRefetchTasks}
        isEditing={false}
        onStartEdit={mockStartEdit}
        onCancelEdit={mockCancelEdit}
      />
    );
    
    fireEvent.click(screen.getAllByRole('button')[0]); // The edit button is the first one
    
    expect(mockStartEdit).toHaveBeenCalled();
  });

  it('updates the subtask status when checkbox is toggled', async () => {
    render(
      <SubtaskItem
        task={mockTask}
        subtask={mockSubtask}
        index={mockIndex}
        refetchTasks={mockRefetchTasks}
        isEditing={false}
        onStartEdit={mockStartEdit}
        onCancelEdit={mockCancelEdit}
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockRefetchTasks).toHaveBeenCalled();
    });
  });
});
