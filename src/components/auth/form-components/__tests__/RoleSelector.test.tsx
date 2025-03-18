
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RoleSelector from '../RoleSelector';
import { Form } from '@/components/ui/form';

// Create a simple schema for testing
const testSchema = z.object({
  role: z.enum(["autistic", "caregiver", "clinician"] as const)
});

const TestWrapper = () => {
  const form = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      role: "autistic"
    }
  });

  return (
    <Form {...form}>
      <form>
        <RoleSelector control={form.control} name="role" />
      </form>
    </Form>
  );
};

describe('RoleSelector Component', () => {
  it('renders all role options', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/neurodivergent individual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/caregiver/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clinician/i)).toBeInTheDocument();
  });

  it('selects the default option', () => {
    render(<TestWrapper />);
    
    // The "autistic" option should be selected by default
    expect(screen.getByLabelText(/neurodivergent individual/i).closest('div')).toContainElement(
      screen.getByRole('radio', { checked: true })
    );
  });

  it('allows selecting a different option', () => {
    render(<TestWrapper />);
    
    // Initially autistic is selected
    expect(screen.getByLabelText(/neurodivergent individual/i).closest('div')).toContainElement(
      screen.getByRole('radio', { checked: true })
    );
    
    // Click the caregiver option
    fireEvent.click(screen.getByLabelText(/caregiver/i));
    
    // Now caregiver should be selected
    expect(screen.getByLabelText(/caregiver/i).closest('div')).toContainElement(
      screen.getByRole('radio', { checked: true })
    );
  });
});
