import React from 'react';
import { render } from '@testing-library/react';
import { UsernameDataProvider } from '../components/UserContext';
import { FormDataProvider } from '../components/FormContext';

const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <UsernameDataProvider value={{ token: 'mockToken' }}>
      <FormDataProvider value={{ formData: { username: '', password: '' } }}>
        {children}
      </FormDataProvider>
    </UsernameDataProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export { customRender };
