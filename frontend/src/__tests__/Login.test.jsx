import React from 'react';
import { fireEvent, waitFor, act,render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Login from '../pages/Login';
import parseJwt from "../components/Decode"
import { customRender } from './customRender'; // Import the custom render function
import { UsernameDataProvider } from '../components/UserContext';
import { FormDataProvider } from '../components/FormContext';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useSnackbar,enqueueSnackbar } from 'notistack';
// Mocking axios
jest.mock('axios');
const useRouter = () => {
  const navigate = jest.fn();
  return { navigate };
};
const mockEnqueueSnackbar = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => useRouter().navigate,
}));
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  }),
}));

describe('<Login />', () => {
  test('Renders login form', () => {
    const { getByText, getByPlaceholderText } = customRender( <BrowserRouter>
      <Login />
    </BrowserRouter>);
    expect(getByText('Student Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  test('Renders change password form', () => {
    const { getByText, getByPlaceholderText } = customRender( <BrowserRouter>
      <Login/>
    </BrowserRouter>);
    fireEvent.click(getByText('Change Password'));
    expect(getByText('Change Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Old Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
  });

  test('Renders forgot password form', () => {
    const { getByText, getByPlaceholderText } = customRender(<BrowserRouter><Login/></BrowserRouter>);
    fireEvent.click(getByText('Forgot Password'));
    expect(getByText('Forgot Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
  });

  test('Successful login redirects to home component', async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: { token: 'mockToken' } });
    const { getByPlaceholderText, getByText } = customRender(<BrowserRouter><Login /></BrowserRouter>);
  
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(getByText('Login'));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        password: 'testpassword',
      });
      const cookies = document.cookie;
     // Check for the presence of mockToken
      expect(cookies).toContain('logged=true');
      expect(cookies).toContain('username=testuser');
      // Additional expectations if any...
    });
  });

  test('Successful password change reloads the page', async () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });
  
    const { getByText, getByPlaceholderText } = customRender(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
    fireEvent.click(getByText('Change Password'));
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });
    axios.put.mockResolvedValueOnce({ status: 201 });
  
    await act(async () => {
      fireEvent.click(getByText('Confirm'));
      await waitFor(() => {});
      expect(mockReload).toHaveBeenCalled(); // Check if window.location.reload() was called
    });
  });
  
  

  test('Successful forgot password reloads the page', async () => {
    axios.put.mockResolvedValueOnce({ status: 201 });
  
    // Mock window.location.reload
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
  
    const { getByText, getByPlaceholderText } = customRender(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
    fireEvent.click(getByText('Forgot Password'));
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });
    fireEvent.click(getByText('Confirm'));
  
    // Wait for a brief moment to allow for potential asynchronous operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow a brief moment for potential async operations
    });
  
    // Check if window.location.reload was called
    expect(reloadMock).toHaveBeenCalled();
  });
  
  
  
  
  
  

  test('Displays error on invalid credentials', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByText, getByPlaceholderText } = customRender(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "invalidpassword" },
    });
    fireEvent.click(getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        username: "testuser",
        password: "invalidpassword",
      });
      expect(useSnackbar().enqueueSnackbar).toHaveBeenCalledWith('Invalid Credentials', { variant: 'error' });
    });
  
  });

});
