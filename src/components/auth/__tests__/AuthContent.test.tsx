
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthContent from '../AuthContent';

// Mock the child components to simplify testing
jest.mock('../AuthHeader', () => () => <div data-testid="auth-header">Auth Header</div>);
jest.mock('../LoginForm', () => ({ onFirebase }: { onFirebase: boolean }) => (
  <div data-testid="login-form">Login Form (Firebase: {String(onFirebase)})</div>
));
jest.mock('../SignupForm', () => ({ onFirebase }: { onFirebase: boolean }) => (
  <div data-testid="signup-form">Signup Form (Firebase: {String(onFirebase)})</div>
));

describe('AuthContent Component', () => {
  it('renders the auth header and default login tab', () => {
    render(
      <BrowserRouter>
        <AuthContent />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('switches between login and signup tabs', () => {
    render(
      <BrowserRouter>
        <AuthContent />
      </BrowserRouter>
    );
    
    // Initially shows login form
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    
    // Click the signup tab
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));
    
    // Now shows signup form
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    
    // Click the login tab again
    fireEvent.click(screen.getByRole('tab', { name: /log in/i }));
    
    // Shows login form again
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('passes correct onFirebase prop to forms', () => {
    render(
      <BrowserRouter>
        <AuthContent onFirebase={true} />
      </BrowserRouter>
    );
    
    // Check login form has onFirebase=true
    expect(screen.getByText(/Login Form \(Firebase: true\)/i)).toBeInTheDocument();
    
    // Switch to signup tab
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));
    
    // Check signup form has onFirebase=true
    expect(screen.getByText(/Signup Form \(Firebase: true\)/i)).toBeInTheDocument();
  });
});
