import React from 'react';
import axios from 'axios';
import axiosMock from 'axios'
import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import withAuthentication from '../components/HOC';
import MockAdapter from "axios-mock-adapter";
import { config } from '../App';
jest.mock('axios'); // Assuming you are using axios for API calls

const mockAxios = new MockAdapter(axios);
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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ message: 'Registered successfully' }),
      status: 201,
    });

  
  });

  test("clicking Register button navigates to login page", async () => {
    render(
      
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      
    );

    // Mocking axios post request
    axiosMock.post.mockResolvedValue({ status: 201 });

    // Filling in form data
    fireEvent.change(screen.getByPlaceholderText("Name of the Student"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email-Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "Test Address" },
    });

    // Clicking the Register button
    fireEvent.click(screen.getByText("Register"));

    // Wait for the axios post request to resolve
    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalled();
      expect(axiosMock.post).toHaveBeenCalledWith(expect.any(String), {
        username: "testuser",
        password: "testpassword",
        email: "test@example.com",
        address: "Test Address",
        icon: ""
      });
    });

    // Expect navigation to login page
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();

    // You may also add assertions related to other UI changes or notifications if needed
  });
});
