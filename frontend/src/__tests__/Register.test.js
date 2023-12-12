import React from
 
'react';
import { render, fireEvent, waitFor } from
 
'@testing-library/react';
import
 
'@testing-library/jest-dom';
import { BrowserRouter } from
 
'react-router-dom';
import Register from '../pages/Register';

describe('Register Component', () => {
  it('renders the Register component', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(getByText('Student Registration')).toBeInTheDocument();
    expect(getByPlaceholderText('Name of the Student')).toBeInTheDocument();
    // Add more assertions as needed based on your UI
  });

  it('handles user registration', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Name of the Student'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Email-Address'), { target: { value: 'test@example.com' } });

    fireEvent.click(getByText('Register'));

    // Simulate successful registration response
    await waitFor(() => {
      // Mock successful registration response from API
      global.fetch.mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ message: 'Registered successfully' })
      });
      expect(getByText('Registered successfully')).toBeInTheDocument();
    });
  });

  // Add more test cases as needed
});