import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddMovie from '../src/components/AddMovie/AddMovie';
import { server } from './mocks/server';
import 'whatwg-fetch';
import { expect } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AddMovie', () => {
    
    it('shows success message after adding a movie', async () => {
        render(<AddMovie />);
        fireEvent.change(screen.getByPlaceholderText('Title'), { 
            target: { value: 'The group 6 movie' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Production Year'), { 
            target: { value: '2023' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Description'), { 
            target: { value: 'The group 6 movie description' } 
        });
        fireEvent.change(screen.getByPlaceholderText('Director'), { 
            target: { value: 'John Doe' } 
        });
        fireEvent.click(screen.getByRole('button', { name: /add movie/i }));
        await waitFor(() => {
            expect(screen.getByText('Movie added successfully', { selector: 'p' })).toBeInTheDocument();
        });
    });
});