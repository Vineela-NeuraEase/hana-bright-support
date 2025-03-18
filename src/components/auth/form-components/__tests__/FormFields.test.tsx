
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormFields from '../FormFields';
import { Form } from '@/components/ui/form';

// Create a simple schema for testing
const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
});

const TestWrapper = () => {
  const form = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  return (
    <Form {...form}>
      <form>
        <FormFields control={form.control} />
      </form>
    </Form>
  );
};

describe('FormFields Component', () => {
  it('renders email, password, and confirm password inputs', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/•••••••••/i)).toHaveLength(2);
  });

  it('has the correct input types for security', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('type', 'password');
  });
});
