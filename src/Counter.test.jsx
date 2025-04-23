
//Vi importerar render för att montera komponenten i en falsk DOM, skärm för att söka i DOM och fireEvent för att simulera klick
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './components/Counter';

// Grupperar relaterade tester under ett namn (Counter).
describe('Counter', () => {
  
  //Första testet kontrollerar om komponenten visar 0
    it('shows 0 at start', () => {
    render(<Counter />);
   expect(screen.getByTestId("count-value")).toHaveTextContent(
     "Current count: 0"
   );

  });
  //Det andra testet simulerar ett knapptryck och bekräftar att antalet nu är 1.
  it('increases count on click', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /öka/i }));// Klicka på knappen som heter "öka"
    expect(screen.getByTestId("count-value")).toHaveTextContent(
      "Current count: 1"
    );

  });
});
