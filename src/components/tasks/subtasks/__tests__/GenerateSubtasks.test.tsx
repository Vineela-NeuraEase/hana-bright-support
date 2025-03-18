
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GenerateSubtasks } from '../GenerateSubtasks';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('GenerateSubtasks', () => {
  const mockTask = { 
    id: 'task-id', 
    title: 'Test Task',
    user_id: 'user-id',
    status: 'pending' as const,
    priority: 'medium' as const,
    spiciness: 3
  };
  const mockRefetchTasks = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ 
      data: { steps: [{ title: 'Step 1', completed: false }], fallback: false },
      error: null
    });
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    });
  });

  it('renders the generate button', () => {
    render(<GenerateSubtasks task={mockTask} refetchTasks={mockRefetchTasks} />);
    expect(screen.getByText('Break down this task')).toBeInTheDocument();
  });

  it('shows loading state when generating subtasks', async () => {
    render(<GenerateSubtasks task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Break down this task'));
    
    expect(screen.getByText('Breaking down task...')).toBeInTheDocument();
  });

  it('calls the Supabase function with correct parameters when clicking the button', async () => {
    render(<GenerateSubtasks task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Break down this task'));
    
    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('break-down-task', {
        body: {
          task: mockTask.title,
          spiciness: mockTask.spiciness,
        },
      });
    });
  });

  it('displays fallback alert when in fallback mode', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { steps: [{ title: 'Fallback Step', completed: false }], fallback: true, error_message: 'Service unavailable' },
      error: null
    });

    render(<GenerateSubtasks task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Break down this task'));
    
    await waitFor(() => {
      expect(screen.getByText('Using simplified breakdown due to AI service limitation: Service unavailable')).toBeInTheDocument();
    });
  });

  it('shows error toast when API fails', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'API Error' }
    });

    render(<GenerateSubtasks task={mockTask} refetchTasks={mockRefetchTasks} />);
    
    fireEvent.click(screen.getByText('Break down this task'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'API Error',
      });
    });
  });
});
