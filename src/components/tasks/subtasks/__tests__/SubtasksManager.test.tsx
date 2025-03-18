
import { render, screen } from '@testing-library/react';
import { SubtasksManager } from '../SubtasksManager';
import { Task } from '@/types/task';

// Mock dependencies
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
