import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Filters from './Filters';

// Mock the necessary dependencies
jest.mock('../apis/filters', () => ({
  GetQuickSearchFilterResults: jest.fn(() => Promise.resolve({ data: { movies: [], artists: [] } })),
}));

jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Filters Component', () => {
  it('renders Filters component', () => {
    render(<Filters filters={{}} setFilters={() => {}} />);
    // You can add more specific assertions based on your component structure
    expect(screen.getByPlaceholderText('Search Movies / Artists')).toBeInTheDocument();
    expect(screen.getByText('Select Language')).toBeInTheDocument();
    expect(screen.getByText('Select Genre')).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    const mockGetQuickSearchFilterResults = jest.fn(() =>
      Promise.resolve({
        data: {
          movies: [
            {
              _id: '1',
              name: 'Movie 1',
              posters: ['poster1'],
            },
          ],
          artists: [
            {
              _id: '2',
              name: 'Artist 1',
              images: ['image1'],
            },
          ],
        },
      })
    );

    jest.mock('../apis/filters', () => ({
      GetQuickSearchFilterResults: mockGetQuickSearchFilterResults,
    }));

    render(<Filters filters={{ search: 'test' }} setFilters={() => {}} />);
    await act(async () => {
      // Wait for debouncing
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    // You can add more specific assertions based on your component structure
    expect(mockGetQuickSearchFilterResults).toHaveBeenCalledWith({ search: 'test' });
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Artist 1')).toBeInTheDocument();
  });

  // Add more tests based on your component's behavior
});
