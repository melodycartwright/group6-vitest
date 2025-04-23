import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../src/components/Counter';

describe('Counter', () => {
  it('should display initial count of 0', () => { // Улучшенное описание теста
    render(<Counter />);
    expect(screen.getByTestId('count-value')).toHaveTextContent('Current count: 0');
  });

  it('should increment count when button is clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /öka/i });
    
    fireEvent.click(button);
    expect(screen.getByTestId('count-value')).toHaveTextContent('Current count: 1');
    
    fireEvent.click(button);
    expect(screen.getByTestId('count-value')).toHaveTextContent('Current count: 2');
  });
});