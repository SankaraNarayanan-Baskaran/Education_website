import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { config } from '../App';
import { useNavigate } from 'react-router-dom';
import { customRender } from './customRender';

describe('Register Component', () => {
  let axiosMock;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios); // Create a new instance of MockAdapter before each test
  });

  afterEach(() => {
    axiosMock.restore(); // Restore mock adapter after each test
  });

  it('renders the Register component', () => {
    const { getByText, getByPlaceholderText } = customRender(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(getByText('Student Registration')).toBeInTheDocument();
    expect(getByPlaceholderText('Name of the Student')).toBeInTheDocument();
    // Add more assertions as needed based on your UI
  });

  it('handles user registration', async () => {
    const { getByText, getByPlaceholderText } = customRender(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Name of the Student'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Email-Address'), { target: { value: 'test@example.com' } });

    fireEvent.click(getByText('Register'));

    // Mock the POST request for user registration
    axiosMock.onPost(`${config.endpoint}/register`).reply(201, { message: 'Registered successfully' });

    // Add assertions if needed
  });

  test("clicking Register button navigates to login page", async () => {
    customRender(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Mocking axios post request
    axiosMock.onPost(`${config.endpoint}/register`).reply(201);

    // Filling in form data
    fireEvent.change(screen.getByPlaceholderText("Name of the Student"), {
      target: { value: "testuser" },
    });

    // Clicking the Register button
    fireEvent.click(screen.getByText("Register"));

    // Wait for the axios post request to resolve
    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});
