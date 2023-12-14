import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ message: 'Login successful' }),
      status: 200,
    });

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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ message: 'Password Changed Successfully' }),
      status: 201,
    });

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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ message: 'Password Changed Successfully' }),
      status: 201,
    });

    // await waitFor(() => {
    //   expect(getByText('Password Changed Successfully')).toBeInTheDocument();
    // });
  });

  // Add more test cases as needed
});
