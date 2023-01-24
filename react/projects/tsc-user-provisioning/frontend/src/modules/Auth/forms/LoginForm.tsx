import { Typography } from '@mui/material';
import * as R from 'ramda';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { authAtom } from 'atoms';
import { Button, Input } from 'components';
import { authService, userService } from 'services';
import { Form, FormRow, FormBody } from '../components';
import { FORMS } from '../enums';

const initialState = {
  email: '',
  password: '',
};

type FormKeys = keyof typeof initialState;

interface ILoginForm {
  setForm: (form: FORMS) => void;
}

const LoginForm: React.FC<ILoginForm> = ({ setForm }) => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authAtom);
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password } = values;

    try {
      await authService.login(email, password);
      const user = await authService.getCurrentUser();

      setAuth({
        isAuth: true,
        user: R.assoc('accountType', userService.getAccountType(user.role), user),
      });
      navigate('/');
    } catch (error) {
      setError(error.message || error.email);
      return;
    }
  };

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;

    setError('');
    setValues(R.assoc(name as FormKeys, value));
  };

  const onForgotPasswordClick = () => setForm(FORMS.RESET_PASSWORD);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Typography variant="h3" fontWeight={400}>
          Hey there!
        </Typography>
        <Typography variant="body1" fontSize={16}>
          Welcome to the Tropical Smoothie Cafe User Provisioning Platform - or UP
          for short! Please log in to continue.
        </Typography>
        <FormBody>
          <FormRow>
            <Input
              onChange={onChange}
              value={values.email}
              id="email"
              name="email"
              type="email"
              label="E-mail"
              error={error}
            />
            <Input
              onChange={onChange}
              value={values.password}
              id="password"
              type="password"
              name="password"
              label="Password"
            />
          </FormRow>
        </FormBody>

        <FormRow>
          <Link onClick={onForgotPasswordClick}>
            <Typography>Forgot Password?</Typography>
          </Link>
          <Button type="submit">Sign in</Button>
        </FormRow>
      </Form>
    </>
  );
};

const Link = styled.a`
  font-weight: bold;
  color: #047e8b;
  text-decoration: none;
  cursor: pointer;

  > p {
    font-size: 1rem;
  }
`;

export default LoginForm;
