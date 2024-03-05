import React from 'react';
import { fireEvent, waitFor, act,render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Login from '../pages/Login';
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
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => useRouter().navigate,
}));
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
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
      expect(document.cookie).toContain('jwtToken=mockToken');
      expect(document.cookie).toContain('logged=true');
      expect(document.cookie).toContain('studentname=harry potter');
      expect(document.cookie).toContain('username=testuser');
      // You may need to adjust these expectations based on your application's behavior
    });
  });

  test('Displays error message on invalid credentials', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    const { getByPlaceholderText, getByText } = customRender(<BrowserRouter><Login /></BrowserRouter>);

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'invalidpassword' } });
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        username: 'testuser',
        password: 'invalidpassword',
      });
      expect(getByText('Invalid Credentials')).toBeInTheDocument();
    });
  });

  test('Successful password change', async () => {
    const mockNavigate = jest.fn();
    const { getByText, getByPlaceholderText } = customRender( <BrowserRouter>
        <Login/>
      </BrowserRouter>);
    fireEvent.click(getByText('Change Password'));
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });
    axios.put.mockResolvedValueOnce({ status: 201 });
    await act(async () => {
      fireEvent.click(getByText('Confirm'));
      await waitFor(() => {});

      // Check if navigate was called with the correct route
      expect(useRouter().navigate).toHaveBeenCalledWith('/login');
    });
  });

  test('Successful forgot password redirects to login', async () => {
    axios.put.mockResolvedValueOnce({ status: 201 });

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
    await waitFor(() => {});

    // Check if navigate was called with the correct route
    expect(useRouter().navigate).toHaveBeenCalledWith('/login');
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
