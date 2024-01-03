import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import axios from 'axios';
import withAuthentication from '../components/HOC';
jest.mock('axios'); // Assuming you are using axios for API calls

describe('Login Component', () => {
  it('renders the Login component', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Login formData={{}} setFormData={() => {}} handleLogin={() => {}} validateInput={() => true} />
      </BrowserRouter>
    );

    expect(getByText('Student Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    // Add more assertions as needed based on your UI
  });

  it('handles user login', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Login formData={{}} setFormData={() => {}} handleLogin={() => {}} validateInput={() => true} />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });

    fireEvent.click(getByText('Login'));

    // Simulate successful login response
    axios.post.mockResolvedValue({ status: 201 });

    // await waitFor(() => {
    //   expect(getByText('Login successful')).toBeInTheDocument();
    // });
  });

  it('changes password on button click', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Login formData={{}} setFormData={() => {}} handleLogin={() => {}} validateInput={() => true} />
      </BrowserRouter>
    );

    fireEvent.click(getByText('Change Password'));

    // Assert that the change password UI is rendered
    // expect(getByText('Change Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm New Password')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });

    fireEvent.click(getByText('Confirm'));

    // Simulate successful password change response
    axios.post.mockResolvedValue({ status: 201 });

    // await waitFor(() => {
    //   expect(getByText('Password Changed Successfully')).toBeInTheDocument();
    // });
  });

  it('recovers password on button click', async () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Login formData={{}} setFormData={() => {}} handleLogin={() => {}} validateInput={() => true} />
      </BrowserRouter>
    );

    fireEvent.click(getByText('Forgot Password'));

    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm New Password')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });

    fireEvent.click(getByText('Confirm'));

    // Simulate successful password recovery response
    axios.post.mockResolvedValue({ status: 201 });

    // await waitFor(() => {
    //   expect(getByText('Password Changed Successfully')).toBeInTheDocument();
    // });
  });

  // Add more test cases as needed

  test("successful login navigates to home page", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Mocking axios post request for successful login
    axios.post.mockResolvedValue({ status: 201 });

    // Filling in login form data
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpassword" },
    });

    // Clicking the Login button
    fireEvent.click(screen.getByText("Login"));

    // Wait for the axios post request to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(/\/api\/.*\/login.*/),
        {
          username: "testuser",
          password: "testpassword",
          // Other expected properties based on your Login component
        }
      );
    });

    // Wait for the navigation to home page
    await waitFor(() => {
      expect(screen.getByText("Logged in successfully")).toBeInTheDocument();
      // Adjust the above line based on the text or element you expect on the home page
    });
  });

});
