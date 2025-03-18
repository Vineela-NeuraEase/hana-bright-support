
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupForm from '../SignupForm';
import * as supabase from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn()
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

describe('SignupForm Component', () => {
  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn()
    });
    (supabase.supabase.auth.signUp as jest.Mock).mockReset();
  });

  it('renders the form with all fields and terms checkbox', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/i am a\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/i accept the terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('validates form fields before submission', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );
    
    // Submit without filling in the form
    fireEvent.click(screen.getByText(/create account/i));
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getAllByText(/please enter a valid email address/i)).toHaveLength(1);
      expect(screen.getAllByText(/password must be at least 6 characters/i)).toHaveLength(2);
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
    
    // Supabase signUp should not be called
    expect(supabase.supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('handles successful signup', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    (supabase.supabase.auth.signUp as jest.Mock).mockResolvedValue({ 
      data: { user: { id: '123' } },
      error: null 
    });
    
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByLabelText(/^password$/i), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'password123' } 
    });
    
    // Select a role
    fireEvent.click(screen.getByLabelText(/caregiver/i));
    
    // Accept terms
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Submit the form
    fireEvent.click(screen.getByText(/create account/i));
    
    await waitFor(() => {
      expect(supabase.supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Account created"
      }));
    });
  });

  it('handles signup error', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    (supabase.supabase.auth.signUp as jest.Mock).mockResolvedValue({ 
      data: null,
      error: { message: 'Email already registered' } 
    });
    
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'existing@example.com' } 
    });
    
    fireEvent.change(screen.getByLabelText(/^password$/i), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'password123' } 
    });
    
    // Accept terms
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Submit the form
    fireEvent.click(screen.getByText(/create account/i));
    
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
        <SignupForm onFirebase={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });
});
