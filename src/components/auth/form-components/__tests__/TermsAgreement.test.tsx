
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TermsAgreement from '../TermsAgreement';
import { Form } from '@/components/ui/form';

// Create a simple schema for testing
const testSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
});

const TestWrapper = () => {
  const form = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      acceptTerms: false
    }
  });

  return (
    <Form {...form}>
      <form>
        <TermsAgreement control={form.control} name="acceptTerms" />
      </form>
    </Form>
  );
};

describe('TermsAgreement Component', () => {
  it('renders the checkbox and terms text', () => {
    render(<TestWrapper />);
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(/i accept the terms of service and privacy policy/i)).toBeInTheDocument();
  });

  it('checkbox is initially unchecked', () => {
    render(<TestWrapper />);
    
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('allows checking the terms agreement', () => {
    render(<TestWrapper />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
