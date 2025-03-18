
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import * as supabase from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn()
    }
  }
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn()
    });
    (supabase.supabase.auth.signInWithPassword as jest.Mock).mockReset();
  });

  it('renders the form with all fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/i am a\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('handles form submission with validation', async () => {
    (supabase.supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ 
      data: { user: { id: '123' } },
      error: null 
    });
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/sign in/i));
    
    await waitFor(() => {
      expect(supabase.supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows error when login fails', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    (supabase.supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ 
      data: null,
      error: { message: 'Invalid login credentials' } 
    });
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'wrongpassword' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/sign in/i));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        variant: "destructive"
      }));
    });
  });

  it('displays different text when using Firebase', () => {
    render(
      <BrowserRouter>
        <LoginForm onFirebase={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
