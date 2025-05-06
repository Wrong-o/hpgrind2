import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { SoundProvider } from './contexts/SoundContext';
import { DatabaseProvider } from './contexts/DatabaseContext';

// Mock the auth store
jest.mock('./store/authStore', () => ({
  __esModule: true,
  default: () => false, // Assuming not logged in for the test
}));

// Mock all the page components for simplicity
jest.mock('./pages/LoginPage', () => ({
  LoginPage: () => <div>Login Page</div>,
}));
jest.mock('./pages/RegisterForm', () => ({
  __esModule: true,
  default: () => <div>Register Form</div>,
}));
// Add more mocks as needed for other components...

describe('App routing', () => {
  test('renders 404 page for invalid routes', () => {
    render(
      <DatabaseProvider>
        <SoundProvider>
          <MemoryRouter initialEntries={['/invalid-route']}>
            <App />
          </MemoryRouter>
        </SoundProvider>
      </DatabaseProvider>
    );
    
    // Check that the 404 page is rendered
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/Sidan hittades inte/i)).toBeInTheDocument();
    expect(screen.getByText(/Tillbaka till startsidan/i)).toBeInTheDocument();
  });
}); 