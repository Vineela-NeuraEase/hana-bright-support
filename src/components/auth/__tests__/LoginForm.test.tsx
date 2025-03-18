
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import * as firebaseAuth from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  auth: jest.fn()
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
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockReset();
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
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ 
      user: { uid: '123' }
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
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });

  it('shows error when login fails', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue({ 
      message: 'Invalid login credentials' 
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
});
