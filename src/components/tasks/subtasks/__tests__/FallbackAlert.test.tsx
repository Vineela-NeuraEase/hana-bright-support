
import { render, screen } from '@testing-library/react';
import { FallbackAlert } from '../FallbackAlert';

describe('FallbackAlert', () => {
  it('renders the alert with the correct error message', () => {
    const errorMessage = 'Test error message';
    render(<FallbackAlert error={errorMessage} />);
    
    expect(screen.getByText('AI Service Limited')).toBeInTheDocument();
    expect(screen.getByText(`Using simplified breakdown due to AI service limitation: ${errorMessage}`)).toBeInTheDocument();
  });
  
  it('renders with the destructive variant', () => {
    render(<FallbackAlert error="Error" />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('destructive');
  });
});
